const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  {
    type: {
      type: String,
      required: true,
    },
    reservationID: {
      type: String,
      required: true,
    },
    scheduled: {
      type: Date,
      required: false,
    },
    invoiceID: {
      type: String,
      required: true,
    },
    taskID:
  }
})