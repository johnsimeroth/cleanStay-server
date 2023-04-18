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
    })
    .catch(console.error);
});


