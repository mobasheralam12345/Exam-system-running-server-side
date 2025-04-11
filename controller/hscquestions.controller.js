const Department = require("../models/hscquestions.model"); // Adjust the path as necessary
const PreviousHscQuestion = require("../models/hscPreviousYear.model");
const HSCOthers = require("../models/hscOthers.model");

// Hsc All questions Exam:

exports.getHscQuestionsByDepartment = async (req, res) => {
  try {
    const { department } = req.params; // Extract department name from the request parameters

    // Find the department by name and populate its subjects and questions
    const departmentData = await Department.findOne({ department });

    if (!departmentData) {
      return res.status(404).json({ message: "Department not found" });
    }

    res.status(200).json({
      department: departmentData.department,
      subjects: departmentData.subjects, // Includes questions within each subject
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch questions", error: error.message });
  }
};

exports.getPrevHscQuestions = async (req, res) => {
  const { group, board, examYear } = req.params; // Extract parameters from the request

  console.log("Received Parameters:", group, board, examYear); // Log the received parameters for debugging

  try {
    // Query the HSCQuestion collection based on the provided group, board, and examYear
    const questions = await PreviousHscQuestion.find({
      group,
      board,
      examYear: parseInt(examYear), // Ensure the year is an integer
    });

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

      // Prepare the response grouped by subjects
      const response = Object.keys(groupedQuestions).map((subject) => ({
        subject_name: subject,
        questions: groupedQuestions[subject],
      }));

      res.json(response); // Return the grouped questions by subject
    } else {
      return res.status(200).json({ questions: null });
    }
  } catch (error) {
    console.error("Error fetching questions:", error); // Log the error
    res.status(500).json({ message: "Internal server error." }); // Return server error message
  }
};

// Hsc Subject Wise Exam :
exports.getHscQuestionsBySubjectWise = async (req, res) => {
  try {
    const { subject, totalQuestions } = req.params;

    console.log(
      "Request received for subject:",
      subject,
      "with total questions:",
      totalQuestions
    );

    // Validate the parameters
    if (!subject || !totalQuestions) {
      console.log("Missing subject or totalQuestions");
      return res
        .status(400)
        .json({ message: "Subject and totalQuestions are required." });
    }

    // Decode the subject in case it contains special characters like spaces
    const decodedSubject = decodeURIComponent(subject);

    const totalQuestionsCount = parseInt(totalQuestions);

    if (isNaN(totalQuestionsCount) || totalQuestionsCount <= 0) {
      console.log("Invalid totalQuestions value:", totalQuestions);
      return res
        .status(400)
        .json({ message: "Invalid totalQuestions parameter." });
    }

    // Fetch questions from the database based on the subject
    const questions = await PreviousHscQuestion.find({
      subject: decodedSubject,
    })
      .limit(totalQuestionsCount)
      .exec();

    if (questions.length === 0) {
      console.log("No questions found for subject:", decodedSubject);
      return res.status(200).json({ questions: null });
    }

    // Process the questions by converting the options to an array
    const processedQuestions = questions.map((question) => {
      const optionsArray = Object.values(question.options); // Converts {A: 'Option A', B: 'Option B'} to ['Option A', 'Option B', ...]
      return {
        ...question.toObject(), // Convert Mongoose document to plain object
        options: optionsArray, // Add the array of options
      };
    });

    res.status(200).json({ questions: processedQuestions });
  } catch (error) {
    console.error("Error in getHscQuestionsBySubjectWise:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};
// Controller function to save Previous HSC questions
exports.savePrevHscQuestions = async (req, res) => {
  const { examYear, board, group, questions } = req.body;

  try {
    console.log("Saving Previous HSC questions...\n");

    // Format the questions to include 'board', 'group', 'examYear', and 'subject'
    const formattedQuestions = Object.entries(questions).flatMap(
      ([subject, qs]) =>
        qs.map((q) => ({ ...q, subject, examYear, board, group }))
    );

    // Insert the formatted questions into the database
    await PreviousHscQuestion.insertMany(formattedQuestions);

    // Send success response
    res.status(201).send({ message: "HSC questions saved successfully!" });
  } catch (error) {
    console.error("❌ Error saving HSC questions:", error);
    res.status(500).send({ error: "Failed to save HSC questions." });
  }
};

//save HSC others questions

exports.SaveHSCOthersQuestions = async (req, res) => {
  try {
    const questions = req.body;

    if (!Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({
        message: "Request body should be a non-empty array of questions.",
      });
    }
    await HSCOthers.deleteMany({});

    const savedQuestions = await HSCOthers.insertMany(questions);
    res.status(201).json({
      message: `${savedQuestions.length} question(s) saved successfully.`,
      data: savedQuestions,
    });
  } catch (error) {
    console.error("Error saving questions to BCSOthers:", error);
    res.status(500).json({ message: "Server error while saving questions." });
  }
};

exports.getHSCOthersQuestions = async (req, res) => {
  try {
    const questions = await HSCOthers.find();

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
