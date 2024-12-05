const BcsYear = require('../models/bcsquestions.model'); // Ensure model name matches your export

{ /* All Questions Exam */}
exports.getQuestions = async (req, res) => {
    const year = parseInt(req.params.year); // Convert year to an integer
    console.log("Received year:", year); // Log the received year

    try {
        // Query to find the document with the specified year
        const filteredYearEntry = await BcsYear.findOne({ year });
        console.log("Query result:", filteredYearEntry);
        if (filteredYearEntry) {
            // If a document is found, return the subjects and questions
            res.json(filteredYearEntry.subjects); // Return subjects containing questions
        } else {
            // If no document is found for the specified year
            res.status(404).json({ message: 'No questions found for the specified year.' });
        }
    } catch (error) {
        console.error("Error fetching questions:", error); // Log the error for debugging
        res.status(500).json({ message: 'Internal server error.' }); // Return 500 error
    }
};


 { /*  Subject Wise Exam   */} 

exports.getBcsQuestionsBySubjectWise = async (req, res) => {
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
        const questions = await BcsYear.aggregate(pipeline);

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
