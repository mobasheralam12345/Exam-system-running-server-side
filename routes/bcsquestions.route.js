const express = require('express');
const { getQuestions } = require('../controller/bcsquestions.controller.js');
const {saveExamResultHistory , getExamResultHistory} = require('../controller/bcsHistory.controller.js')
const { saveSubjectWiseResultHistory,getSubjectWiseResultHistory} = require('../controller/bcsHistory.controller.js')
const { getBcsQuestionsBySubjectWise,} = require('../controller/adminLogin.controller.js');

const router = express.Router();

//  All Bcs questions 
router.get('/get-questions/:year',getQuestions);
// Subject wise bcs questions
router.get('/get-questions/:subject/:totalQuestions', getBcsQuestionsBySubjectWise);


// History For Exam
router.post('/save-result', saveExamResultHistory);
router.get('/get-result-history', getExamResultHistory);

// History For Subject-Wise-Exam
router.post('/save-subject-wise-history',saveSubjectWiseResultHistory);
router.get('/get-subject-wise-history', getSubjectWiseResultHistory)

module.exports = router;
