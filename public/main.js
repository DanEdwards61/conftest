

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

    default_config: {
      "sandbox": {
        "streaming_service": {
          "host": "ec2-54-174-80-83.compute-1.amazonaws.com",
          "port": "8505"
        },

        "nrs_api_host": {
          "host": "ec2-54-174-80-83.compute-1.amazonaws.com",
          "port": "9007"
        },

        "wowza": {
          "live": "rtmp://ec2-54-174-80-83.compute-1.amazonaws.com:1935/live",
          "record": "rtmp://ec2-54-174-80-83.compute-1.amazonaws.com:1935/live_record"
        }
      }
    }
  },
  methods: {
    set_config(type) {
      if (default_config[type]) {
        let def = default_config['type']
        svc_host = `${def['streaming_service']['host']}:${def['streaming_service']['post']}`
        nrs_host = `${def['nrs_api_service']['host']}:${def['nrs_api_service']['post']}`
        wowza.live = def['wowza']['live']
        wowza.record = def['wowza']['record']
      }
    }
  }
})

app.svc_host = "test host"