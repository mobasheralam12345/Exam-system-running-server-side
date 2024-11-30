const express = require('express');
const { adminlogin ,getBcsQuestionsBySubjectWise,} = require('../controller/adminLogin.controller.js');

const router = express.Router();

// post admin-login to the database
router.post('/admin-login',adminlogin);

module.exports = router;
