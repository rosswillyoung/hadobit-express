let Task = require("../models/task.js");
let express = require('express');
const mongoose = require('mongoose');
const config = require('../config/database');

mongoose.connect(config.database);

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

const returnQueryForOneDay = (day, user_id) => {
  let startDay = new Date(day);
  startDay.setHours(0,0,0,0);
  let endDay = new Date(day);
  endDay.setHours(23,59,59,999);
  let query = {date_created: {$gte: startDay, $lt: endDay}, user_id: user_id}
  return query;
}

exports.getWeeksTasks = async (req, res) => {
  let today = new Date();
  let weekDays = getDaysThisWeek(today);
  let tasksForWeek = []
  let mondayQuery = returnQueryForOneDay(weekDays.monday, "5f57cb66bacfd9399edb4ee1")
  let tuesdayQuery = returnQueryForOneDay(weekDays.tuesday, "5f57cb66bacfd9399edb4ee1")
  let wednesdayQuery = returnQueryForOneDay(weekDays.wednesday, "5f57cb66bacfd9399edb4ee1")
  let thursdayQuery = returnQueryForOneDay(weekDays.thursday, "5f57cb66bacfd9399edb4ee1")
  let fridayQuery = returnQueryForOneDay(weekDays.friday, "5f57cb66bacfd9399edb4ee1")
  let saturdayQuery = returnQueryForOneDay(weekDays.saturday, "5f57cb66bacfd9399edb4ee1")
  let sundayQuery = returnQueryForOneDay(weekDays.sunday, "5f57cb66bacfd9399edb4ee1")
  await Task.find(sundayQuery, (err, tasks) => {
    tasksForWeek.push({day: "SUNDAY", id: 0, tasks: tasks})
    // sunday = {tasks: tasks}
  })
  await Task.find(mondayQuery, (err, tasks) => {
    tasksForWeek.push({day: "MONDAY", id: 1, tasks: tasks})
    // monday = {tasks: tasks}
  })
  await Task.find(tuesdayQuery, (err, tasks) => {
    tasksForWeek.push({day: "TUESDAY", id: 2, tasks: tasks})
    // tuesday = {tasks: tasks}
  })
  await Task.find(wednesdayQuery, (err, tasks) => {
    tasksForWeek.push({day: "WEDNESDAY", id: 3, tasks: tasks})
    // wednesday = {tasks: tasks}
  })
  await Task.find(thursdayQuery, (err, tasks) => {
    tasksForWeek.push({day: "THURSDAY", id: 4,tasks: tasks})
    // thursday = {tasks: tasks}
  })
  await Task.find(fridayQuery, (err, tasks) => {
    tasksForWeek.push({day: "FRIDAY", id: 5, tasks: tasks})
    // friday = {tasks: tasks}
  })
  await Task.find(saturdayQuery, (err, tasks) => {
    tasksForWeek.push({day:"SATURDAY", id: 6, tasks: tasks})
    // saturday = {tasks: tasks}
  })

  res.json(tasksForWeek);
}

// Get incomplete tasks for a certain day
exports.getIncompleteTasksForToday = (req, res) =>{
  let startDay = new Date();
  startDay.setHours(0,0,0,0);
  let endDay = new Date();
  endDay.setHours(23,59,59,999);
  Task.find({date_created: {$gte: startDay, $lt: endDay}, completed: false, user_id: req.session.passport.user}, (err, tasks) => {
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
    user_id: req.session.passport.user
  }, (err, tasks) => {
    res.json(tasks);
  });
}

exports.setTaskComplete = (req, res) => {
  Task.updateOne({_id: req.body.id}, {completed: true}, (err) => {
    if(err) {
      console.log(err);
      return;
    } else {
      res.send('Success');
    }
  });
}

exports.createTaskToday =  (req, res) => {
  if (req.session.passport) {
    let task = new Task();
    task.task = req.body.task;
    task.date_created = new Date();
    task.completed = false;
    task.user_id = req.session.passport.user;

    console.log("Creating task " + task.task + " for user " + req.session.passport.user);

    task.save((err) => {
      if(err) {
        console.log(err);
        return;
      } else {
        res.json(req.session);
      }
    })
  } else {
    console.log("user not found");
  }
}

exports.createSubtask = (req, res) => {
  let subtask = {
    subtasks: {subtask: req.body.subtask, completed: false}
  };
  let id = req.body.id;
  // console.log(subtask);

  Task.updateOne({_id: id}, {$push: subtask}, (err) => {
    if(err) {
      console.log(err);
      return;
    } else {
      res.send('Success');
    }
  });
}



// returnTasksForOneDay(new Date(), "5f5a7d5f2381261c164a25a7")
// module.exports = {getSunday, addDays, getDaysThisWeek, getTasksForDay};
