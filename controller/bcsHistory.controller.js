
const History=require("../models/bcsHistory.model")
const SubjectWiseHistory = require("../models/bcssubjectWiseHistory.model.js");

{/* All Questions History */}

exports.saveExamResultHistory = async (req, res) => {
    try {
        const {history } = req.body;

        // Log email and history to confirm they have values
    
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


// For fetch data from the database
exports.getExamResultHistory = async (req, res) => {
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


{/*  Subject Wise History */}

exports.saveSubjectWiseResultHistory= async (req, res) => {
    try {
        const {history } = req.body;

        // Log email and history to confirm they have values
    
        // Create a new result document
        const newResult = new SubjectWiseHistory({history });
        
        // Save the result to the database
        await newResult.save();

        res.status(201).json({ message: 'Result saved successfully!', data: newResult });
    } catch (error) {
        console.error('Error saving result:', error);
        res.status(500).json({ error: 'Failed to save result.' });
    }
};

// For fetch data from the database
exports.getSubjectWiseResultHistory = async (req, res) => {
    try {
        // Fetch the results for a specific email
        const email = req.params.email;
        const result = await SubjectWiseHistory.find({ email });

        if (!result) {
            return res.status(404).json({ error: 'No results found for this email.' });
        }
        res.status(200).json({ message: 'Results fetched successfully!', data: result });
    } catch (error) {
        console.error('Error fetching result:', error);
        res.status(500).json({ error: 'Failed to fetch result.' });
    }
};
