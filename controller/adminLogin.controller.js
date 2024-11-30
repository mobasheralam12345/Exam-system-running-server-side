const AdminUser = require('../models/admin.model');
const bcrypt = require('bcryptjs');
const History=require("../models/bcsHistory.model");
const BcsYear=require("../models/bcsquestions.model");

exports.adminlogin = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if the user exists
        const user = await AdminUser.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'User not found. Please register.' });
        }

        // Validate password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid password' });
        }

        // Send success response without token
        res.json({ message: 'Login successful', user: { email: user.email, name: user.name } });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// History -- Save the result to the database
exports.saveResult = async (req, res) => {
    try {
        const {history } = req.body;

        // Log email and history to confirm they have values
    
        console.log("History:", history);

        // Create a new result document
        const newResult = new History({history });
        
        // Save the result to the database
        await newResult.save();

        res.status(201).json({ message: 'Result saved successfully!', data: newResult });
    } catch (error) {
        console.error('Error saving result:', error);
        res.status(500).json({ error: 'Failed to save result.' });
    }
};

// History -- Fetch the result from the database
exports.getResult = async (req, res) => {
    try {
        // Fetch the results for a specific email
        const email = req.params.email;
        const result = await History.find({ email });

        if (!result) {
            return res.status(404).json({ error: 'No results found for this email.' });
        }

        res.status(200).json({ message: 'Results fetched successfully!', data: result });
    } catch (error) {
        console.error('Error fetching result:', error);
        res.status(500).json({ error: 'Failed to fetch result.' });
    }
};

//

// Subject Wise  Controller :

// Controller function to get questions by subject and limit
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




  