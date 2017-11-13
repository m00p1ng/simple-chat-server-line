const axios = require('axios');
const key = require('../key.json');

const io = require('socket.io-client');
const socket = io('https://b-line.herokuapp.com');
const sendMessage = require('./sendMessage');

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
        let allProfiles = [];
        let events = req.body.events;

        events.forEach((event) => {
          const userId = event.source.userId;
          allProfiles.push(getProfileInfo(userId))
        })

        Promise.all(allProfiles)
          .then((profiles) => {
            events = events.map((event, i) => {
              event['profile'] = profiles[i];
              return event;
            });

            socket.emit('newEvents', events);
          })
          .catch((err) => console.log(err));

      }
      if ('action' in req.body) {
        const action = req.body.action;
        switch(action) {
          case "newMessages":
            const message = JSON.parse(req.body.messages);
            const sender = req.body.sender;
            sendMessage(message, sender)
            break;
        }
      }
    }
    else {
      res.send("body is empty.")
    }
  });
}

const getProfileInfo = (userId) => {
  const url = `https://api.line.me/v2/bot/profile/${userId}`

  return new Promise((resolve, reject) => {
    axios.get(url, {
      "headers": {
        "Authorization": `Bearer ${key.accessToken}`
      }
    })
    .then((res) => resolve(res.data))
    .catch((err) => reject(err))
  })
}