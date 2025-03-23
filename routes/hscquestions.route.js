const express = require("express");
const {
  getHscQuestionsByDepartment,
  getHscQuestionsBySubjectWise,
  savePrevHscQuestions,
  getPrevHscQuestions,
} = require("../controller/hscquestions.controller");
const {
  saveHscExamResultHistory,
  getHscExamResultHistory,
  saveHscSubjectWiseResultHistory,
  getHscSubjectWiseResultHistory,
} = require("../controller/hscHistory.controller");
const router = express.Router();

//Exam :
// Hsc all questions exam
router.get("/get-questions/:department", getHscQuestionsByDepartment);
// Hsc Subject Wise Exam
router.get(
  "/hsc-subjectWise/:subject/:totalQuestions",
  getHscQuestionsBySubjectWise
);

router.get("/getPrevHscQuestions/:group/:board/:examYear", getPrevHscQuestions);

// Route to save HSC questions
router.post("/savePrevHscQuestions", savePrevHscQuestions);

// History :
//Hsc all questions exam history :
router.post("/save-result-history", saveHscExamResultHistory);
router.get("/get-result-history", getHscExamResultHistory);

// Hsc Subject Wise Exam History :
router.post("/save-hsc-subjectWise-history", saveHscSubjectWiseResultHistory);
router.get("/get-hsc-subjectWise-history", getHscSubjectWiseResultHistory);

module.exports = router;
