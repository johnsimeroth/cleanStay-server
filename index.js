require('dotenv').config();
const express = require('express');
const gapi = require('./server/controllers/gCalApi.js');
const morgan = require('morgan');

const app = express();
app.disable('etag');

app.use(morgan('tiny'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

function getNextEventStart(property) {
  if (property.events.length === 0) {
    return null;
  } else if (property.events.length === 1) {
    return property.events[0].start.date;
  }
  const today = new Date();
  let firstEvent = new Date(property.events[0].start.date);
  if (firstEvent < today) {
    firstEvent = new Date(property.events[1].start.date);
  }
  return firstEvent;
}

const propertyDetailsKey = [
  {
    address: '564 Kimball',
    gCalID: 'l4qofj1b6ppj8db32aocfl40nhj80srt@import.calendar.google.com',
  },
  {
    address: '566 Kimball',
    gCalID: 'pve7d4grgb0rgbm4a1q94piqeloq60u0@import.calendar.google.com',
  },
];

const calIDs = propertyDetailsKey.map((property) => property.gCalID);

app.get('/properties', async (req, res) => {
  try {
    const data = await (gapi(calIDs));
    const properties = data.map((propertyEvents, index) => ({
      details: propertyDetailsKey[index],
      events: propertyEvents.map((event) => ({
        id: event.id,
        start: event.start,
        end: event.end,
      })),
    }));
    properties.sort((a, b) => (
      new Date(getNextEventStart(a)) - new Date(getNextEventStart(b))
    ));
    res.status(200).send(properties);
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
});


const port = process.env.PORT || 3000;
app.listen(port);
console.log(`now listening at port http://localhost:${port}`)
