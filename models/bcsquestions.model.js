const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
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

const subjectSchema = new mongoose.Schema({
  subject_name: {
    type: String,
    required: true,
  },
  questions: {
    type: [questionSchema],
    default: [],
  }
});

const bcsYearSchema = new mongoose.Schema({
  year: {
    type: Number,
    required: true,
    unique: true, // Ensure each year is unique
  },
  subjects: {
    type: [subjectSchema],
    default: [],
  }
});

// Export the model
module.exports = mongoose.model('bcsyear', bcsYearSchema);
