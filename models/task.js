
let mongoose = require('mongoose');

// article shema
let taskSchema = mongoose.Schema({
  date_created: {
    type: Date,
    required: true
  },
  task: {
    type: String,
    required: true
  },
  subtasks: {
    type: Array,
    required: false
  },
  date_completed: {
    type: Date,
    required: false
  },
  completed: {
    type: Boolean,
    required: true
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
});

let Task = module.exports = mongoose.model('Task', taskSchema)
