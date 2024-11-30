const mongoose = require('mongoose');

const HistorySchema = new mongoose.Schema({

    history: [
        {
            email: {
                type: String,
                required: true
            },
            bcsYear: {
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

module.exports = mongoose.model('History', HistorySchema);
