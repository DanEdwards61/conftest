<template>
  <div id="app">
    
    <div class="jumbotron">
      <div class="container">
      <img src="./assets/logo@2x.png">
        <h1 class="display-3">{{ title }}</h1>
        <p>This page provides a simple mechanism to test various options for playing live streamed or previously recorded conference calls.</p>
      </div>
    </div>


        <div class="container">
          <!-- Configuration & diagnostics section -->
          <div class="row">
            <div class="col-md-6">
              <h2>Configuration</h2>
              <p>Select a default configuration, or enter custom information</p>
              <p><a class="btn btn-default btn-sm" href="#" role="button">Test UAT</a>
                 <a class="btn btn-default btn-sm" href="#" role="button">Test</a>
              </p>

              <div class="row">
                <div class="col">
                  <div class="form-group">
                    <b-form-group>
                      <label for="svc_host">Service host URL:</label>
                      <b-form-text id="svc_host"></b-form-text>
                      <label for="nrs_host">NRS API URL:</label>
                      <b-form-text id="nrs_host"></b-form-text>
                    </b-form-group>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-md-6">
              <h2>Diagnostics</h2>
              <p>Data collected about your environment.</p>
              <p><a class="btn btn-secondary" href="#" role="button">Copy to Clipboard &raquo;</a></p>
            </div>
          </div>

          <!-- Call list & test player section -->
          <div class="row">
              <div class="col-md-6">
                  <h2>Available Calls</h2>
              </div>
              <div class="col-md-6">
                  <h2>Players</h2>
              </div>
          </div>
  
        </div> <!-- /container -->

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
