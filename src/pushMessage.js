const axios = require('axios');
const key = require('../key.json')

module.exports = (app) => {
  app.post("/newMessage", (req, res) => {
    const messages = req.body.messages;
    const userId = "Ufe5d05be7c7a5314dc03f43303da8198";
    const url = "https://api.line.me/v2/bot/message/push";
    const data = {
      "to": userId,
      "messages": [
        {
          "type": "text",
          "text": "Hello world",
        }
      ]
    }

    axios.post(url, data, {
      "headers": {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${key.accessToken}`
      }
    })
      .then((res) => {
        console.log(res);
        res.send("SUCCESS")
      })
      .catch((err) => {
        console.error(err);
        res.send("ERROR")
      })

  });
}
