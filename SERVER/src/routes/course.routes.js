const express = require("express");
const router = express.Router();
const courseController = require("../controller/course.controller");
const { verifySign } = require("../utils/token");

router.post("/create-with-telegram", verifySign, courseController.createCourseWithTelegram);
router.get("/get-by-access-code/:accessCode", courseController.getCourseByAccessCode);

module.exports = router;
