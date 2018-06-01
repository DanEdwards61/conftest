<template>
  <div id="app">


    <div class="row">
      <div class="col-xs-6">
        <div class="input-group">
          <label for="svc_host">Service host url:</label>
          <div class="input-group-prepend"><div class="input-group-test">http://</div></div>
          <input id="svc_host" class="form-control" type="text" v-model="svc_host_url">
        </div>
      </div>
      <div class="col-xs-6">
      </div>
    </div>
    <div class="input-group">
      <div class="input-group-prepend"><div class="input-group-text">http://</div></div>
      <input id="id1" class="form-control" type="text">
    </div>


    <footer class="container">
      <p>&copy; NetRoadshow 2018</p>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'app',
  data () {
    return {
      msg: 'Streaming Conference Call Player Test Page',
      title: 'Streaming Player test page'
    }
  },
  methods: {
    setDefault(type) {
      if (type == 'test-uat') {

      }
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
