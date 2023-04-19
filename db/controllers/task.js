const Task = require('../models/task.js');

exports.prune = function () {
  console.log('not ready yet');
};

exports.save = function (tasksArray) {
  return Task.create(tasksArray);
};

exports.getAll = function () {
  return Task.find({});
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
  const newTasks = await Promise.all(tasks.filter(async (task) => (
    Task.find({ reservationID: task.reservationID }) === null
    )
  ));
  return Task.create(newTasks);
};
