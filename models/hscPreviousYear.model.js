const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema(
  {
    examYear: {
      type: Number,
      required: true,
    },
    subject: {
      type: String,
      required: true,
    },
    questionText: {
      type: String,
      required: true,
    },
    options: {
      type: Object,
      required: true,
      validate: {
        validator: function (options) {
          return ["A", "B", "C", "D"].every((key) =>
            options.hasOwnProperty(key)
          );
        },
        message: "Options must include keys: A, B, C, D.",
      },
    },
    correctAnswer: {
      type: String,
      enum: ["A", "B", "C", "D"],
      required: true,
    },
    explanation: {
      type: String,
      default: "",
    },
    board: {
      type: String,
      required: true,
      enum: [
        "Dhaka",
        "Chittagong",
        "Rajshahi",
        "Barishal",
        "Comilla",
        "Jessore",
        "Sylhet",
        "Mymensingh",
        "Dinajpur",
        "Madrasah",
        "Technical",
      ],
      message:
        "Board must be one of the following: Dhaka, Chattogram, Rajshahi, Barishal, Comilla, Jessore, Sylhet, Mymensingh, Dinajpur, Madrasah, Technical",
    },
    group: {
      type: String,
      required: true,
      enum: ["Science", "Humanities", "Business Studies"],
      message:
        "Group must be one of the following: Science, Humanities, Business Studies",
    },
  },
  { timestamps: true }
);

if (mongoose.models.prevHscQuestion) {
  mongoose.deleteModel("prevHscQuestion");
}

module.exports = mongoose.model("prevHscQuestion", questionSchema);
