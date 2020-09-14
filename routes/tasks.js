const express = require('express');
const router = express.Router();
const dateLogic = require('../controllers/DateLogic')

const Task = require('../models/task');

router.get('/tasks/today', (req, res) => {
  // console.log(req.session)
  let startToday = new Date();
  startToday.setHours(0,0,0,0);
  let endToday = new Date();
  endToday.setHours(23,59,59,999);
  // let startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  Task.find({date_created: {$gte: startToday, $lt: endToday}, completed: false, user_id: req.session.passport.user}, (err, tasks) => {
    // if (err) {throw err}
    res.json(tasks);
  });
});

router.post('/tasks/today', (req, res) => {
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
});

router.get('/tasks/week', dateLogic.getTasksForWeek);

router.post('/subtasks/add', (req, res) => {
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
});

router.post('/subtasks/complete', (req, res) => {
  Task.updateOne({_id: req.body.id}, {completed: true}, (err) => {
    if(err) {
      console.log(err);
      return;
    } else {
      res.send('Success');
    }
  });
});

module.exports = router;
