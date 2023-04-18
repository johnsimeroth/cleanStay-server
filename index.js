require('dotenv').config();
const express = require('express');
const gapi = require('./server/controllers/gCalApi.js');
// const routes = require('./server/routes');
const morgan = require('morgan');

const app = express();

app.use(morgan('tiny'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/reservations', (req, res) => {
  gapi()
    .then((events) => {
      events.forEach((event) => {
        console.log(event.start.date)
      })
      console.log(events[0]);
      res.status(200).send(events);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send(err);
    });
});


const port = process.env.PORT || 3000;
app.listen(port);
console.log(`now listening at port http://localhost:${port}`)
