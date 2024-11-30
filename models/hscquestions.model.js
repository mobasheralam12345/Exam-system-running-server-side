const mongoose = require('mongoose');

// Schema for individual questions
const hscquestionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
  },
  options: {
    type: [String],
    required: true,
    validate: {
      validator: function (v) {
        return v.length >= 2; // Ensure there are at least two options
      },
      message: 'A question must have at least two options.',
    },
  },
  answer: {
    type: String,
    required: true,
  }
});

// Schema for individual subjects
const hscsubjectSchema = new mongoose.Schema({
  subject_name: {
    type: String,
    required: true,
  },
  questions: {
    type: [hscquestionSchema],
    default: [],
  }
});

// Main schema for departments
const departmentSchema = new mongoose.Schema({
  department: {
    type: String,
    required: true,
    unique: true, // Ensure each department is unique
  },
  subjects: {
    type: [hscsubjectSchema],
    default: [],
  }
});

// Export the model
module.exports = mongoose.model('hscquestions', departmentSchema);
