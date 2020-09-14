let Task = require("../models/task.js");
let express = require('express');

  // Get the latest Sunday from a Date object
const getSunday = (day) => {
  let daysFromSunday = day.getDay();
  let date = new Date();
  let sunday = new Date();

  sunday.setDate(date.getDate() - daysFromSunday);

  return sunday;
}

// Takes a date and adds a specified number of days to it.
const addDays = (day, daysToAdd) => {
  let date = new Date();
  date.setDate(day.getDate() + daysToAdd);

  return date;
}

// Takes a day and returns all the days in that week.
const getDaysThisWeek = (day) => {
  let sunday = getSunday(day);
  let monday = addDays(sunday, 1);
  let tuesday = addDays(sunday, 2);
  let wednesday = addDays(sunday, 3);
  let thursday = addDays(sunday, 4);
  let friday = addDays(sunday, 5);
  let saturday = addDays(sunday, 6);

  let weekdays = {
    sunday: sunday,
    monday: monday,
    tuesday: tuesday,
    wednesday: wednesday,
    thursday: thursday,
    friday: friday,
    saturday: saturday
  };

  return weekdays;
}

// Get incomplete tasks for a certain day
exports.getTasksForDay = (req, res) =>{
  let startDay = new Date();
  startDay.setHours(0,0,0,0);
  console.log(startDay);
  let endDay = new Date();
  endDay.setHours(23,59,59,999);
  console.log(endDay);
  // let tasks = [];
  // let startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  Task.find({date_created: {$gte: startDay, $lt: endDay}, user_id: "5f57cb66bacfd9399edb4ee1"}, (err, tasks) => {
    res.json(tasks);
  });
}

exports.getTasksForWeek = (req, res) => {
  let today = new Date();
  let weekDays = getDaysThisWeek(today);
  let startSunday = weekDays.sunday.setHours(0,0,0,0);
  let endSaturday = weekDays.saturday.setHours(23, 59, 59, 999);

  Task.find({
    date_created: {$gte: startSunday, $lte: endSaturday},
    user_id: "5f57cb66bacfd9399edb4ee1"
  }, (err, tasks) => {
    res.json(tasks);
  });
}



// module.exports = {getSunday, addDays, getDaysThisWeek, getTasksForDay};
