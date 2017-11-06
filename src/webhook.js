const axios = require('axios');
const key = require('../key.json')

const io = require('socket.io-client')
const socket = io('https://b-line.herokuapp.com')

module.exports = (app) => {
  app.get("/verify", (req, res) => {
    let url = "https://api.line.me/v1/oauth/verify";
    axios.get(url, {
      "headers": {
        "Authorization": `Bearer ${key.channelToken}`
      }
    })
      .then((response) => {
        res.send(response.data);
      })
      .catch((err) => {
        console.log(err);
      })
  });

  app.post("/webhook", (req, res) => {
    if (Object.keys(req.body).length > 0) {
      socket.emit('newEvents', req.body.events)
    }
    else {
      res.send("body is empty.")
    }
  });
}