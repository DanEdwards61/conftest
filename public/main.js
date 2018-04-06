
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

var callbacks = {
  onMessage: ( verto, dialog, msg, data) => {
    console.log(`onMessage: ${msg}`);
  },

  onDialogState: d => {
    console.log(`onDialogState: d=${JSON.stringify(d)}`)
  },

  onWSLogin: (v, success) => {
    console.log(`onWSLogin: v=${JSON.stringify(v)}`);
  },

  onWSClose: (v, success) => {
    console.log(`onWSClose: v=${JSON.stringify(v)}`);
  }
}

var verto = new $.verto({
  login: '1000@verto.nrs.com',
  passwd: '1122',
  socketUrl: 'wss://ec2-18-222-61-84.us-east-2.compute.amazonaws.com:8082',
  tag: "audio",
  iceServers: true
}, callbacks);

