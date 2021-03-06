

var config_data = [{
    "environment": "custom",
    "streamingservice": {
      "servers": [
        {
          "node": {},
          "api": {},
          "freeswitch": {},
          "wowza": {}
        }
      ]
    }
  },

  {
    "environment": "sandbox",
    "streamingservice": {
      "servers": [
        {
          "node": {
              "host": "ec2-54-174-80-83.compute-1.amazonaws.com",
              "user": "ubuntu",
              "agentId": "d54cecd9-8c9b-4ca8-a23c-2b4b95bde10e",
              "port": "8505",
              "name" : "streaming-service1"
              },

          "api": {
              "host": "ec2-54-174-80-83.compute-1.amazonaws.com",
              "port": "9007"
              },

          "freeswitch": {
              "host": "ec2-54-174-80-83.compute-1.amazonaws.com",
              "port": "8021",
              "pwd": "0SMz7TFZnWfDXf5IYJoM",
              "dn_base": "3100"
              },

          "wowza": {
              "host": "ec2-54-174-80-83.compute-1.amazonaws.com",
              "port": "1935",
              "apps": {
                  "live": "live",
                  "record": "record"
                  }
          }
        }
      ]
    }
  }

]

