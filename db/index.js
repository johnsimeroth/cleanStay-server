const mongoose = require('mongoose');
const task = require('./controllers/task.js');

async function main() {
  await mongoose.connect('mongodb://localhost:27017/cleanstay');
  console.log('connected successfully!')
  return mongoose.connection;
}

exports.connection = main().catch(err => console.error(err));
exports.task = task;
