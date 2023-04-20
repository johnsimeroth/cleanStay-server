const mongoose = require('mongoose');
const db = require('../index.js')

const taskSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
  },
  reservationID: {
    type: String,
    required: false,
    index: true,
  },
  scheduled: {
    type: Date,
    required: false,
  },
  due: {
    type: Date,
    required: false,
  },
  invoiceID: {
    type: String,
    required: false,
  },
  priority: {
    type: Number,
    required: true,
    min: 1,
    max: 4
  },
  propertyID: {
    type: String,
    required: true,
    index: true,
  }
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;