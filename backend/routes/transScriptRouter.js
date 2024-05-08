const router = require("express").Router();
const fs = require("fs");
const generateTranscript = require("../controller/transcriptController");
const qna = require("../controller/qnaController");
const getYtVideos = require("../controller/getYtVideos.js");

router.route("/transcript").post(generateTranscript);
router.route("/qna").post(qna);
router.route("/ytvideos").post(getYtVideos);

module.exports = router;
