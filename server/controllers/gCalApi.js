// Credit: this file's authentication process and initial api queries are based
// directly on the quickstart example provided by google in the calendar api
// documentation here: https://developers.google.com/calendar/api/quickstart/nodejs

const fs = require('fs').promises;
const path = require('path');
const { cwd } = require('process');
const { authenticate } = require('@google-cloud/local-auth');
const { google } = require('googleapis');

const scopes = ['https://www.googleapis.com/auth/calendar.readonly'];
const tokenPath = path.join(cwd(), 'secrets', 'token.json');
const credentialsPath = path.join(cwd(), 'secrets', 'credentials.json');

const loadCredentials = async () => {
  try {
    const content = await fs.readFile(tokenPath);
    const credentials = JSON.parse(content);
    return google.auth.fromJSON(credentials);
  } catch (err) {
    return null;
  }
}

const saveCredentials = async (client) => {
  const content = await fs.readFile(credentialsPath);
  const keys = JSON.parse(content);
  const key = keys.installed || keys.web;
  const payload = JSON.stringify({
    type: 'authorized_user',
    client_id: key.client_id,
    client_secret: key.client_secret,
    refresh_token: client.credentials.refresh_token,
  });
  await fs.writeFile(tokenPath, payload);
}

const authorize = async () => {
  let client = await loadCredentials();
  if (client) {
    return client;
  }
  client = await authenticate({
    scopes: scopes,
    keyfilePath: credentialsPath,
  });
  if (client.credentials) {
    await saveCredentials(client);
  }
  return client;
}

async function listEvents(auth, calID) {
  const calendar = google.calendar({version: 'v3', auth});
  const minDate = new Date();
  let maxDate = new Date();
  maxDate.setDate(minDate.getDate() + 7);
  const res = await calendar.events.list({
    calendarId: calID,
    timeMin: minDate.toISOString(),
    timeMax: maxDate.toISOString(),
    singleEvents: true,
    orderBy: 'startTime',
  });
  return res.data.items;
}

module.exports = function authAndList(calIDs) {
  return authorize()
    .then((client) => {
      return Promise.all(calIDs.map((id) => listEvents(client, id)))
    })
    .catch(console.error);
}
