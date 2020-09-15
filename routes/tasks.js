const express = require('express');
const router = express.Router();
const taskLogic = require('../controllers/TaskLogic')

const Task = require('../models/task');

router.get('/tasks/today', taskLogic.getIncompleteTasksForToday);

router.post('/tasks/today', taskLogic.createTaskToday);

router.get('/tasks/week', taskLogic.getWeeksTasks);

router.post('/subtasks/add', taskLogic.createSubtask);

router.post('/tasks/complete', taskLogic.setTaskComplete);

module.exports = router;
