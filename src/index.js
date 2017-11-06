const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const axios = require('axios');

const PORT = process.env.PORT || 3500;
const key = require('../key.json')

const app = express();
const logger = morgan('combined');
app.use(logger);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});

app.get("/", (req, res) => {
  res.send("Hello world");
})

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

app.post("/bot", (req, res) => {
  if (Object.keys(req.body) > 0) {
    let result = "";
    for (event in req.body.events) {
      if (event['type'] == 'message' && event['message']['type'] == 'text') {
        let text = event['message']['text'];
        let replyToken = event['replyToken'];

        let message = {
          'type': 'text',
          'text': text,
        }

        let url = 'https://api.line.me/v2/bot/message/reply';
        let data = {
          'replyToken': replyToken,
          'messages': [message]
        }
        

        axios.post(url, data, {
          "headers": {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${key.channelToken}`
          }
        })
          .then((response) => {
            res.send(response + "\r\n");
          })
          .catch((error)=> {
            console.log(error);
          });
      }
    }
    res.send(result)
  } else {
    res.send("body is empty.")
  }
});