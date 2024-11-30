const BcsYear = require('../models/bcsquestions.model'); // Ensure model name matches your export

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
