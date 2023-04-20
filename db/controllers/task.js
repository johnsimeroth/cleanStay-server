const Task = require('../models/task.js');

exports.prune = function () {
  console.log('not ready yet');
};

exports.save = function (tasksArray) {
  return Task.create(tasksArray);
};

exports.getAllIncompleteByProp = function (propertyID) {
  return Task.find({
    propertyID: propertyID,
    complete: false,
  });
};

exports.getAllCleansForProperty = function (propertyID) {
  return Task.find({
    type: 'clean',
    property: propertyID,
  });
};

exports.updateCleans = async function (propertyID, propertyName, resArray) {
  const tasks = resArray.map(reservation => ({
    type: 'clean',
    reservationID: reservation.id,
    description: 'Clean for next guest',
    due: new Date(reservation.start.date + 'T12:00:00.000' ),
    priority: 1,
    propertyID: propertyID,
    propertyName: propertyName,
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

exports.updateById = function (id, update) {
  return Task.findByIdAndUpdate(id, update);
}