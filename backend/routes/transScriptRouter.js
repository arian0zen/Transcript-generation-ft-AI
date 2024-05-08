const router = require("express").Router();
const fs = require("fs");
const {
  getOnlyTranscript,
  getTranscript,
} = require("../controller/transcriptController");
const qna = require("../controller/qnaController");
const getYtVideos = require("../controller/getYtVideos.js");

router.route("/transcript").post(getTranscript);
router.route("/qna").post(qna);
router.route("/ytvideos").post(getYtVideos);

router.post("/yt-transcript-only", getOnlyTranscript);

module.exports = router;
