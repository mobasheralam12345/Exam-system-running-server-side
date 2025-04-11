const mongoose = require("mongoose");

const hscOthersSchema = new mongoose.Schema(
  {
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
  },
  { timestamps: true }
);

if (mongoose.models.HSCOthers) {
  mongoose.deleteModel("HSCOthers");
}

module.exports = mongoose.model("HSCOthers", hscOthersSchema);
