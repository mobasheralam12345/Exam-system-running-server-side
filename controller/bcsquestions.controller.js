const BcsYear = require("../models/bcsquestions.model"); // Ensure model name matches your export
const BCSQuestion = require("../models/bcsquestions.model");
const BCSOthers = require("../models/bcsOthers.model");

{
  /* All Questions Exam */
}
exports.getQuestions = async (req, res) => {
  const year = parseInt(req.params.year); // Convert year to an integer
  console.log("Received year:", year); // Log the received year

  try {
    // Query to find all questions for the specified year
    const questions = await BCSQuestion.find({ bcsYear: year });

    if (questions.length > 0) {
      // Group questions by subject
      const groupedQuestions = questions.reduce((acc, question) => {
        if (!acc[question.subject]) {
          acc[question.subject] = [];
        }

        // Convert options from object to array (if necessary)
        const optionsArray = Array.isArray(question.options)
          ? question.options
          : Object.values(question.options); // Convert options object to an array

        acc[question.subject].push({
          question: question.questionText,
          options: optionsArray, // Ensure options is an array
          correctAnswer: question.correctAnswer,
          explanation: question.explanation,
        });
        return acc;
      }, {});

      const response = Object.keys(groupedQuestions).map((subject) => ({
        subject_name: subject,
        questions: groupedQuestions[subject],
      }));

      res.json(response); // Return grouped questions by subject
    } else {
      return res.status(200).json({ questions: null });
    }
  } catch (error) {
    console.error("Error fetching questions:", error); // Log the error for debugging
    res.status(500).json({ message: "Internal server error." }); // Return 500 error
  }
};

{
  /*  Subject Wise Exam   */
}

exports.getBcsQuestionsBySubjectWise = async (req, res) => {
  try {
    const { subject, totalQuestions } = req.params;
    console.log("Came");
    // Validate the parameters
    if (!subject || !totalQuestions) {
      return res
        .status(400)
        .json({ message: "Subject and totalQuestions are required." });
    }

    const totalQuestionsCount = parseInt(totalQuestions);

    if (isNaN(totalQuestionsCount) || totalQuestionsCount <= 0) {
      return res
        .status(400)
        .json({ message: "Invalid totalQuestions parameter." });
    }

    const questions = await BCSQuestion.find({ subject })
      .limit(totalQuestionsCount)
      .exec();

    if (questions.length === 0) {
      return res.status(200).json({ questions: null });
    }

    // Convert options object to an array and process each question
    const processedQuestions = questions.map((question) => {
      const optionsArray = Object.values(question.options); // Converts {A: 'Option A', B: 'Option B'} to ['Option A', 'Option B', ...]
      return {
        ...question.toObject(), // Convert question document to plain object
        options: optionsArray, // Add the array of options
      };
    });

    res.status(200).json({ questions: processedQuestions });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

//save BCS others questions

exports.SaveBCSOthersQuestions = async (req, res) => {
  try {
    const questions = req.body;

    if (!Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({
        message: "Request body should be a non-empty array of questions.",
      });
    }
    await BCSOthers.deleteMany({});

    const savedQuestions = await BCSOthers.insertMany(questions);
    res.status(201).json({
      message: `${savedQuestions.length} question(s) saved successfully.`,
      data: savedQuestions,
    });
  } catch (error) {
    console.error("Error saving questions to BCSOthers:", error);
    res.status(500).json({ message: "Server error while saving questions." });
  }
};

exports.getBCSOthersQuestions = async (req, res) => {
  try {
    const questions = await BCSOthers.find();

    if (questions.length === 0) {
      return res.status(404).json({ message: "No questions found." });
    }

    const modifiedQuestions = questions.map((q) => {
      let optionsArray = [];

      if (
        q.options &&
        typeof q.options === "object" &&
        q.options.A &&
        q.options.B &&
        q.options.C &&
        q.options.D
      ) {
        optionsArray = [q.options.A, q.options.B, q.options.C, q.options.D];
      }

      return {
        ...q.toObject(),
        options: optionsArray,
      };
    });

    res.status(200).json({
      message: `${modifiedQuestions.length} question(s) found.`,
      data: modifiedQuestions,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching questions", error: error.message });
  }
};
