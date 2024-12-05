const express = require('express');
const { getQuestions ,getBcsQuestionsBySubjectWise} = require('../controller/bcsquestions.controller.js');
const {saveExamResultHistory , getExamResultHistory,
    saveSubjectWiseResultHistory,getSubjectWiseResultHistory} = require('../controller/bcsHistory.controller.js')

const router = express.Router();

//  All Bcs questions exam
router.get('/get-questions/:year',getQuestions);
// Subject wise bcs questions exam
router.get('/get-questions/:subject/:totalQuestions', getBcsQuestionsBySubjectWise);


// All Questions History
router.post('/save-result', saveExamResultHistory);
router.get('/get-result-history', getExamResultHistory);

// Subject-Wise-Exam History
router.post('/save-subject-wise-history', saveSubjectWiseResultHistory);
router.get('/get-subject-wise-history', getSubjectWiseResultHistory)

module.exports = router;


