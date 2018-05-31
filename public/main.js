
function joinConference() {
  console.log('join conference called');
  debugger;
  verto.newCall('3010');
}

var wrtc_app = new Vue({
  el: '#wrtc_app',
  data: {
    conferences: []
  },
  methods: {
    joinConference: joinConference
  }
})

var sio = io();
sio.on('conference list', (c_list) => {
  wrtc_app.conferences = c_list;
});

