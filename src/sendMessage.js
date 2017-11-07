const axios = require('axios')
const key = require('../key.json')


module.exports = (messagesRaw) => {
  const messages = JSON.parse(messagesRaw);
  const userId = "Ufe5d05be7c7a5314dc03f43303da8198";
  const url = "https://api.line.me/v2/bot/message/push";
  const data = {
    to: userId,
    messages: messages,
  }

  axios.post(url, data, {
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${key.accessToken}`
    }
  })
    .then((res) => {
      console.log(res);
    })
    .catch((err) => {
      console.error(err);
    })
}