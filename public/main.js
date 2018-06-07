

var blank_config = {
  "environment": "custom",
  "streamingservice": {
      "wowza": {"live": "", "record": ""},
      
      "servers": { "nodes": [ {"host": "custom","port": "",}],
                   "api": [{ "host": "", "port": ""}],
                   "freeswitch": [{"host": "", "poort": ""}]
                },
    }
}

function split_host(host_string){
  var tokens = host_string.split(':');
  if( tokens.length != 2 ) {
    alert('host string must be in the form <host_name>:<port number>');
    return { 'host': '', 'port': ''}
  }

  return { 'host': tokens[0], 'port': [tokens[1]]}
}

window.onload = function () {
  var app = new Vue({
    el: '#app',
    data: {
      conferences: [],
/*       [
        {"id":1062,
         "name":"Dan Edwards' 1st conf stream call",
         "startTimeUtc":"2018-06-06T20:40:00",
         "endTimeUtc":"2018-06-06T22:00:00",
         "isActive":true,
         "applicationID":0,
         "guestPinPhoneNumber":"18663854039",
         "guestPinTollPhoneNumber":"",
         "notes":null,
         "createdDateUtc":"0001-01-01T00:00:00",
         "createdByCoreUserId":"00000000-0000-0000-0000-000000000000",
         "updatedDateUtc":"0001-01-01T00:00:00",
         "updatedByCoreUserId":"00000000-0000-0000-0000-000000000000",
         "recordConference":"N",
         "status":"Available"
        }
      ],
 */
      svc_host: '',
      nrs_host: '',
      wowza: {
        host: '',
        port: '',
        apps: {
          live: '',
          record: ''
        }
      },
      environment: '',
      config_data: config_data,
      config: {},

      isWebRTCSupported: false,
      isFlashSupported: false
    },

    methods: {
      set_config( env ) {
        env = env || this.environment;

        let c = this.config_data.filter( e => e.environment == env);
        if ( c.length == 0 ) return;
        c = c[0];
        let svc = c.streamingservice.servers[0];

        // We treat the custom environment in a unique way. We don't overwrite the existing data.
        // Instead, we copy the current data into the custom config object, allowing a user to just
        // change the bits they need instead of having to completely fill in the whole set of data.
        if (c.environment == "custom") {
          svc.node = split_host(this.svc_host);
          svc.api = split_host(this.nrs_host);
          svc.wowza.apps = this.wowza.apps;
        } else {
          this.svc_host = `${svc.node.host}:${svc.node.port}`;
          this.nrs_host = `${svc.api.host}:${svc.api.port}`;
          this.wowza.host = `${svc.wowza.host}:${svc.wowza.port}`
          this.wowza.apps.live = svc.wowza.apps.live;
          this.wowza.apps.record = svc.wowza.apps.record;
        }
      },

      // Apply changes in UI to the currently config object
      apply() {
        env = this.environment;
        let c= this.config_data.filter( e => e.environment == env);
        if( c.length == 0 ) return;

        c = c[0];
        let svc = c.streamingservice.servers[0];
        svc.node = split_host(this.svc_host);
        svc.api = split_host(this.nrs_host);
        svc.wowza.apps = this.wowza.apps;
      },

      set_calls( call_list ) {
        console.log('Replacing conferences ' + JSON.stringify(this.conferences) + ' with ' + call_list);
        this.conferences = JSON.parse(call_list);
      },

      load_calls() {
        let url = `http://${this.svc_host}/calls`;

        var xhr = new XMLHttpRequest();
        xhr.addEventListener("load", (res) => {
          this.set_calls(res.currentTarget.responseText);
        });
        xhr.addEventListener("error", (err) => {
          console.log(`Error getting call list: ${JSON.stringify(err)}`)
        });
        xhr.addEventListener("progress", (evt) => {
          console.log(`progress: evt=${JSON.stringify(evt)}`)
        });
        
        xhr.open("GET", url);
        xhr.send();
      },

      select_call( cid ) {
        var video = document.getElementById('player_hls');
        var wowza_url = `http://${this.wowza.host}/${this.wowza.apps.live}/${cid}/playlist.m3u8`
        if(Hls.isSupported()) {
          var hls = new Hls();
          hls.loadSource(wowza_url);
          hls.attachMedia(video);
          hls.on(Hls.Events.MANIFEST_PARSED,function() {
            video.play();
        });
       }
       // hls.js is not supported on platforms that do not have Media Source Extensions (MSE) enabled.
       // When the browser has built-in HLS support (check using `canPlayType`), we can provide an HLS manifest (i.e. .m3u8 URL) directly to the video element throught the `src` property.
       // This is using the built-in support of the plain video element, without using hls.js.
        else if (video.canPlayType('application/vnd.apple.mpegurl')) {
          video.src = wowza_url;
          //video.src = 'https://video-dev.github.io/streams/x36xhzz/x36xhzz.m3u8';
          video.addEventListener('canplay',function() {
            video.play();
          });
        }        
      }
    }
  })


  app.environment = "sandbox";
  app.set_config("sandbox");
  setTimeout( () => app.load_calls(), 1000);
}


function select_call(id) {
  flowplayer('#player_hls', {
    live: true,
    clip: {
      sources: [
        { type: "application/x-mpegurl", src: `${app.config.wowza.live}/1062/playlist.m3u8`}
      ]
    }
  }
  )
}