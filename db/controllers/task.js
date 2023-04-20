const Task = require('../models/task.js');

exports.prune = function () {
  console.log('not ready yet');
};

exports.save = function (tasksArray) {
  return Task.create(tasksArray);
};

exports.getAll = function (propertyID) {
  return Task.find({propertyID: propertyID});
};

exports.getAllCleansForProperty = function (propertyID) {
  return Task.find({
    type: 'clean',
    property: propertyID,
  });
};

exports.updateCleans = async function (propertyID, resArray) {
  const tasks = resArray.map(reservation => ({
    type: 'clean',
    reservationID: reservation.id,
    due: new Date(reservation.start.date + 'T12:00:00.000' ),
    priority: 1,
    propertyID: propertyID,
  }));
  const newTasks = [];
    for (let task of tasks) {
      const existingTask = await Task.findOne({ reservationID: task.reservationID }).exec();
      if (existingTask === null) {
        newTasks.push(task);
      }
    }
  console.log(newTasks.length);
  return Task.create(newTasks);
};
