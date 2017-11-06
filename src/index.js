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
  if(Object.keys(req.body) > 0) {
    for(event in req.body.events) {
      console.log(event)
    }
  } else {
    res.send("body is empty.")
  }
});