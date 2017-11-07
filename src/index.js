const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors')

const PORT = process.env.PORT || 3500;

const app = express();
app.use(cors())
app.options('*', cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const webhook = require('./webhook');
const pushMessage = require("./pushMessage");

const server = app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});

const io = require('socket.io').listen(server)

io.on('connection', (socket) => {
  socket.on('newEvents', (events) => {
    io.emit('newEvents', events)
    console.log(">>> From SOCKET.io: newEvents <<<")
    console.log(JSON.stringify(events, null, 2))
  })
});

app.get("/", (req, res) => {
  res.send("Hello world");
})

webhook(app, server);
pushMessage(app);
