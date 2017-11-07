const axios = require('axios');
const key = require('../key.json')

const io = require('socket.io-client')
const socket = io('https://b-line.herokuapp.com')
const sendMessage = require('./sendMessage')

module.exports = (app) => {
  app.get("/verify", (req, res) => {
    let url = "https://api.line.me/v1/oauth/verify";
    axios.get(url, {
      "headers": {
        "Authorization": `Bearer ${key.accessToken}`
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
      if ('events' in req.body) {
        socket.emit('newEvents', req.body.events)
      }
      if ('messages' in req.body) {
        sendMessage(req.body.messages)
      }
    }
    else {
      res.send("body is empty.")
    }
  });
}