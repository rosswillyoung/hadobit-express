const express = require('express');
const router = express.Router();
const taskLogic = require('../controllers/TaskLogic');
const passport = require('passport');
const authLogic = require('../middleware/auth.js');

const Task = require('../models/task');

router.get('/tasks/today', authLogic.authenticateToken, taskLogic.getIncompleteTasksForToday);

router.post('/tasks/today', authLogic.authenticateToken, taskLogic.createTaskToday);

router.get('/tasks/week', authLogic.authenticateToken, taskLogic.getWeeksTasks);

router.post('/subtasks/add', authLogic.authenticateToken, taskLogic.createSubtask);

router.post('/tasks/complete', authLogic.authenticateToken, taskLogic.setTaskComplete);

module.exports = router;
