

var blank_config = {
  "environment": "custom",
  "streamingservice": {
      "wowza": {"live": "", "live_record": ""},
      
      "servers": { "nodes": [ {"host": "custom","port": "",}],
                   "api": [{ "host": "", "port": ""}],
                   "freeswitch": [{"host": "", "poort": ""}]
                },
    }
}

var app = new Vue({
  el: '#app',
  data: {
    conferences: [],
    svc_host: '',
    nrs_host: '',
    wowza: {
      live: '',
      record: ''
    },
    environment: '',
    config_data: config_data,
    config: {}
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
      conferences = JSON.parse(call_list);
    },

    load_calls() {
      let url = `http://${this.svc_host}/calls`;

      var xhr = new XMLHttpRequest();
      xhr.addEventListener("load", (res) => this.set_calls(res.responseText));
      xhr.addEventListener("error", (err) => {
        console.log(`Error getting call list: ${JSON.stringify(err)}`)
      });
      xhr.addEventListener("progress", (evt) => {
        console.log(`progress: evt=${JSON.stringify(evt)}`)
      });
      
      xhr.open("GET", url);
      xhr.send();
    }
  }
})


app.environment = "sandbox";
app.set_config("sandbox");