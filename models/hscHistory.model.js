const mongoose = require('mongoose');

const HscHistorySchema = new mongoose.Schema({

    history: [
        {
            email: {
                type: String,
                required: true
            },
            department: {
                type: String,
                required: true
            },
            totalMarks: {
                type: Number,
                required: true
            },
            correctAnswers: {
                type: Number,
                required: true
            },
            incorrectAnswers: {
                type: Number,
                required: true
            },
            skippedAnswers: {
                type: Number,
                required: true
            }
        }
    ]
}, { timestamps: true });

module.exports = mongoose.model('hscAllQuestionsHistory', HscHistorySchema);