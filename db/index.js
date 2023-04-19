const mongoose = require('mongoose');

const models

async function main() {
  await mongoose.connect('mongodb://localhost:27017/cleanstay');
  console.log('connected successfully!')
  return mongoose.connection;
}

exports.db = main().catch(err => console.error(err));
