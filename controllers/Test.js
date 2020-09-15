let Task = require("../models/task.js");

const mongoose = require('mongoose');
const config = require('../config/database');

mongoose.connect(config.database);
let db = mongoose.connection;

// Check connection
db.once('open', () => {
  getWeeksTasks()
});

const getWeeksTasks = async() => {
  let startDay = new Date();
  startDay.setHours(0,0,0,0);
  let endDay = new Date();
  endDay.setHours(23,59,59,999);
  let user_id = "5f5a7d5f2381261c164a25a7"
  let daysThisWeek = {}
  await Task.find({date_created: {$gte: startDay, $lt: endDay}, user_id: user_id}, (err, tasks) => {
    daysThisWeek.today = tasks;
    console.log(daysThisWeek);
  });
}
