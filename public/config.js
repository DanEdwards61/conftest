

var config_data = [{
    "environment": "custom",
    "streamingservice": {
        "wowza": {
          "live": "",
          "live_record": ""
        },
        
        "servers": {
          "nodes": [
            {
            "host": "",
            "user": "ubuntu",
              "port": "8505",
            }
          ],
          "api": [
            {
              "host": "",
              "port": ""
            }
            ],
          "freeswitch": [
            {
              "host": "",
              "port": "",
              "pwd": ""
            }
            ]
        },
      }
},
    {
  "environment": "sandbox",
  
  "agents": {
    "linux": "linux"
  },
  
  "streamingservice": {
    "wowza": {
      "live": "rtmp://ec2-54-174-80-83.compute-1.amazonaws.com:1935/live",
      "record": "rtmp://ec2-54-174-80-83.compute-1.amazonaws.com:1935/record"
    },
    
    "servers": {
      "nodes": [
        {
        "host": "ec2-54-174-80-83.compute-1.amazonaws.com",
        "user": "ubuntu",
        "agentId": "d54cecd9-8c9b-4ca8-a23c-2b4b95bde10e",
          "port": "8505",
          "name" : "streaming-service1"
        }
      ],
      "api": [
        {
          "host": "ec2-54-174-80-83.compute-1.amazonaws.com",
          "port": "9007"
        }
        ],
      "freeswitch": [
        {
          "host": "ec2-54-174-80-83.compute-1.amazonaws.com",
          "port": "8021",
          "pwd": "0SMz7TFZnWfDXf5IYJoM",
          "dn_base": "3100"
        }
        ]
    },
  }
}

]

