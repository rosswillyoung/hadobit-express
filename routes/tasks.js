const express = require('express');
const router = express.Router();

let Task = require('../models/task');

router.get('/tasks', (req, res) => {
  let startToday = new Date();
  startToday.setHours(0,0,0,0);
  let endToday = new Date();
  endToday.setHours(23,59,59,999);
  // let startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  Task.find({date_created: {$gte: startToday, $lt: endToday}, completed: false}, (err, tasks) => {
    res.json(tasks);
  });
});

router.post('/tasks', (req, res) => {
  let task = new Task();
  console.log(req.body);
  task.task = req.body.task;
  task.date_created = new Date();
  task.completed = false;

  task.save((err) => {
    if(err) {
      console.log(err);
      return;
    } else {
      res.send('Success')
    }
  })
});

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
