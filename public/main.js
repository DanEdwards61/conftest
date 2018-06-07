

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

window.onload = function () {
  var app = new Vue({
    el: '#app',
    data: {
      conferences: 
      [
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

      svc_host: '',
      nrs_host: '',
      wowza: {
        live: '',
        record: ''
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
        let svc = c.streamingservice.servers;
        this.svc_host = `${svc.nodes[0].host}:${svc.nodes[0].port}`
        this.nrs_host = `${svc.api[0].host}:${svc.api[0].port}`
        this.wowza = c.streamingservice.wowza;
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
        if(Hls.isSupported()) {
          var hls = new Hls();
          // http://54.174.80.83:1935/record/1062/playlist.m3u8
          var wowza_url = this.wowza.record + '/' + cid + '/playlist.m3u8'
          //hls.loadSource('https://video-dev.github.io/streams/x36xhzz/x36xhzz.m3u8');
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
          video.src = 'https://video-dev.github.io/streams/x36xhzz/x36xhzz.m3u8';
          video.addEventListener('canplay',function() {
            video.play();
          });
        }        
      }
    }
  })


  app.environment = "sandbox";
  app.set_config("sandbox");


  app.isWebRTCSupported = !!window.RTCPeerConnection;

  // The following code is lifted from: https://stackoverflow.com/questions/998245/how-can-i-detect-if-flash-is-installed-and-if-not-display-a-hidden-div-that-inf
  var hasFlash = false;
  try {
    var fo = new ActiveXObject('ShockwaveFlash.ShockwaveFlash');
    if (fo) {
      hasFlash = true;
    }
  } catch (e) {
    if (navigator.mimeTypes
          && navigator.mimeTypes['application/x-shockwave-flash'] != undefined
          && navigator.mimeTypes['application/x-shockwave-flash'].enabledPlugin) {
      hasFlash = true;
    }
  }
  app.isFlashSupported = hasFlash;
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