const db = require('../../db');

async function getTasks (property) {
  await db.task.updateCleans(property.details.id, property.details.name, property.reservations);
  return db.task.getAllIncompleteByProp(property.details.id);
}


exports.appendTasks = async function getAndAppendTasksForAllProperties (properties) {
  const tasks = await Promise.all(properties.map((property) => getTasks(property)));
  properties.forEach((property, index) => {
    property.tasks = tasks[index];
  });
  return properties;
}

exports.update = db.task.updateById;