
const HscHistory = require("../models/hscHistory.model")
const HscSubjectWiseHistory = require('../models/hscSubjectWiseHistory.model')

{/* Hsc All Questions History */}

exports.saveHscExamResultHistory = async (req, res) => {
    try {
        const {history } = req.body;
        console.log(history);

        // Log email and history to confirm they have values
    
        // Create a new result document
        const newResult = new HscHistory({history });
        
        // Save the result to the database
        await newResult.save();

        res.status(201).json({ message: 'Result saved successfully!', data: newResult });
    } catch (error) {
        console.error('Error saving result:', error);
        res.status(500).json({ error: 'Failed to save result.' });
    }
};


// For fetch data from the database
exports.getHscExamResultHistory = async (req, res) => {
    try {
        // Fetch the results for a specific email
        const email = req.params.email;
        const result = await HscHistory.find({ email });

        if (!result) {
            return res.status(404).json({ error: 'No results found for this email.' });
        }

        res.status(200).json({ message: 'Results fetched successfully!', data: result });
    } catch (error) {
        console.error('Error fetching result:', error);
        res.status(500).json({ error: 'Failed to fetch result.' });
    }
};


 {/*  Hsc Subject Wise Exam History: */}

exports.saveHscSubjectWiseResultHistory= async (req, res) => {
    try {
        const {history } = req.body;

        // Create a new result document
        const newResult = new HscSubjectWiseHistory({history });
        
        // Save the result to the database
        await newResult.save();

        res.status(201).json({ message: 'Result saved successfully!', data: newResult });
    } catch (error) {
        console.error('Error saving result:', error);
        res.status(500).json({ error: 'Failed to save result.' });
    }
};

// For fetch data from the database
exports.getHscSubjectWiseResultHistory = async (req, res) => {
    try {
        // Fetch the results for a specific email
        const email = req.params.email;
        const result = await HscSubjectWiseHistory.find({ email });

        if (!result) {
            return res.status(404).json({ error: 'No results found for this email.' });
        }
        res.status(200).json({ message: 'Results fetched successfully!', data: result });
    } catch (error) {
        console.error('Error fetching result:', error);
        res.status(500).json({ error: 'Failed to fetch result.' });
    }
};
