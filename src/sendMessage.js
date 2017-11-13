const axios = require('axios')
const key = require('../key.json')


module.exports = (messages, sender) => {
  const url = "https://api.line.me/v2/bot/message/push";
  const data = {
    to: sender,
    messages: messages,
  }

  axios.post(url, data, {
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${key.accessToken}`
    }
  })
    .then((res) =>  console.log(res))
    .catch((err) =>  console.error(err));
}