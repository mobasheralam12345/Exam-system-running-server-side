const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
    bcsYear: {
        type: Number,
        required: true
    },
    subject: {
        type: String,
        required: true
    },
    questionText: {
        type: String,
        required: true
    },
    options: {
        type: Object,
        required: true,
        validate: {
            validator: function(options) {
                return ["A", "B", "C", "D"].every(key => options.hasOwnProperty(key));
            },
            message: "Options must include keys: A, B, C, D."
        }
    },
    correctAnswer: {
        type: String,
        enum: ["A", "B", "C", "D"],
        required: true
    },
    explanation: {
        type: String,
        default: ""
    }
}, { timestamps: true });

if (mongoose.models.BCSQuestion) {
    mongoose.deleteModel('BCSQuestion');
}

module.exports = mongoose.model("BCSQuestion", questionSchema);
