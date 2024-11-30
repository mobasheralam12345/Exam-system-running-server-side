const Department = require('../models/hscquestions.model'); // Adjust the path as necessary

// Hsc All questions :

exports.getHscQuestionsByDepartment = async (req, res) => {
  try {
    const { department } = req.params; // Extract department name from the request parameters

    // Find the department by name and populate its subjects and questions
    const departmentData = await Department.findOne({ department });

    if (!departmentData) {
      return res.status(404).json({ message: 'Department not found' });
    }

    res.status(200).json({
      department: departmentData.department,
      subjects: departmentData.subjects, // Includes questions within each subject
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch questions', error: error.message });
  }
};


// Hsc Subject Wise Exam :
exports.getHscQuestionsBySubjectWise = async (req, res) => {
  try {
      const { subject, totalQuestions } = req.params; // Read subject and totalQuestions from URL parameters
      const limit = parseInt(totalQuestions, 10); // Convert totalQuestions to an integer

      // Validate input
      if (isNaN(limit) || limit <= 0) {
          return res.status(400).json({ error: "Invalid 'totalQuestions' value. It must be a positive integer." });
      }

      // Build the aggregation pipeline
      const pipeline = [
          // Unwind the subjects array
          { $unwind: "$subjects" },

          // Match the specified subject name
          { $match: { "subjects.subject_name": subject } },

          // Unwind the questions array within the matched subject
          { $unwind: "$subjects.questions" },

          // Project the required fields
          {
              $project: {
                  _id: 0,
                  question: "$subjects.questions.question",
                  options: "$subjects.questions.options",
                  answer: "$subjects.questions.answer",
                  subject: "$subjects.subject_name",
                  year: "$year",
              },
          },

          // Shuffle the questions using $sample to return a random selection
          { $sample: { size: limit } },
      ];

      // Execute the aggregation query
      const questions = await Department.aggregate(pipeline);

      // If no questions are found
      if (!questions || questions.length === 0) {
          return res.status(404).json({ error: "No questions found for the specified subject." });
      }

      // Send the questions in the response
      res.json({
          subject,
          questions,
      });
  } catch (error) {
      console.error("Error fetching questions by subject:", error);
      res.status(500).json({ error: "An error occurred while fetching questions." });
  }
};




