const BcsYear = require("../models/bcsquestions.model"); // Ensure model name matches your export
const BCSQuestion = require("../models/bcsquestions.model");

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
      res
        .status(404)
        .json({ message: "No questions found for the specified year." });
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
      return res
        .status(404)
        .json({ message: "No questions found for this subject." });
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
