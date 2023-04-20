require('dotenv').config();
const express = require('express');
const morgan = require('morgan');

const gapi = require('./server/controllers/gCalApi.js');
const task = require('./server/controllers/tasks.js');

const app = express();
app.disable('etag');

app.use(morgan('tiny'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

function getNextReservationStart(property) {
  if (property.reservations.length === 0) {
    return null;
  } else if (property.reservations.length === 1) {
    return property.reservations[0].start.date;
  }
  const today = new Date();
  let firstEvent = new Date(property.reservations[0].start.date);
  if (firstEvent < today) {
    firstEvent = new Date(property.reservations[1].start.date);
  }
  return firstEvent;
}

// the ids are google calendar ids for now
const propertyDetailsKey = [
  {
    address: '564 Kimball',
    name: '564 Kimball',
    id: 'l4qofj1b6ppj8db32aocfl40nhj80srt@import.calendar.google.com',
  },
  {
    address: '566 Kimball',
    name: '566 Kimball',
    id: 'pve7d4grgb0rgbm4a1q94piqeloq60u0@import.calendar.google.com',
  },
];

const calIDs = propertyDetailsKey.map((property) => property.id);

app.get('/properties', async (req, res) => {
  try {
    const data = await (gapi(calIDs));
    const properties = data.map((propertyEvents, index) => ({
      details: propertyDetailsKey[index],
      reservations: propertyEvents.map((event) => ({
        id: event.id,
        start: event.start,
        end: event.end,
      })),
    }));
    properties.sort((a, b) => (new Date(getNextReservationStart(a)) - new Date(getNextReservationStart(b))));
    await task.appendTasks(properties);
    res.status(200).send(properties);

  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
});

app.put('/tasks/:taskID', (req, res) => {
  task.update(req.params.taskID, req.body)
    .then(() => res.sendStatus(200))
    .catch((err) => {
      console.error(err);
      res.status(500).send(err);
    });
})


const port = process.env.PORT || 3000;
app.listen(port);
console.log(`now listening at port http://localhost:${port}`)
