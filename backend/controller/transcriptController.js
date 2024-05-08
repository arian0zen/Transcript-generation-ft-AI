const fs = require("fs");
const getTranscriptResponse = require("../api/getTranscript");
const storeEmbeddedTranscript = require("../api/storeEmbeddedTranscript");

const getTranscript = async (req, res) => {
  const url = req.body.url;
  const mp3 = "audio-output.mp3";
  try {
    const transcriptData = await getTranscriptResponse(url, mp3);

    // console.log("Transcript Data", transcriptData);
    if (transcriptData.newFileCreated === true) {
      fs.unlink(mp3, (err) => {
        if (err) {
          res.json({ error: "something went wrong" });
          return;
        }
      });
      fs.writeFile(
        `./Documents/${transcriptData.mongoId}.txt`,
        transcriptData.transcriptText,
        (err) => {
          if (err) {
            res.json({ error: "something went wrong" });
            return;
          }
        }
      );
      await storeEmbeddedTranscript(
        `./Documents/${transcriptData.mongoId}.txt`
      );
    }
    if (transcriptData.success === true) {
      fs.unlink(`./Documents/${transcriptData.mongoId}.txt`, (err) => {
        if (err) {
          return;
        }
      });
      res.json({
        transcriptData: transcriptData,
        message: "now you can ask question about this",
      });
      return;
    } else {
      res.json({ error: transcriptData.error });
      return;
    }
  } catch (error) {
    console.log("getTranscript controller error ==>", error.message);
    res.json({ error: error.message });
    return;
  }
};
const getOnlyTranscript = async (req, res) => {
  const url = req.body.url;
  const mp3 = "audio-output.mp3";

  console.log("getOnlyTranscript controller url ==>", url);

  try {
    const transcriptData = await getTranscriptResponse(url, mp3);

    console.log(
      "getOnlyTranscript controller transcriptData ==>",
      transcriptData
    );

    // console.log("Transcript Data", transcriptData);
    if (transcriptData.newFileCreated === true) {
      fs.unlink(mp3, (err) => {
        if (err) {
          res.json({ error: "something went wrong" });
          return;
        }
      });
      fs.writeFile(
        `./Documents/${transcriptData.mongoId}.txt`,
        transcriptData.transcriptText,
        (err) => {
          if (err) {
            res.json({ error: "something went wrong" });
            return;
          }
        }
      );
      // await storeEmbeddedTranscript(
      //   `./Documents/${transcriptData.mongoId}.txt`
      // );
    }
    if (transcriptData.success === true) {
      fs.unlink(`./Documents/${transcriptData.mongoId}.txt`, (err) => {
        if (err) {
          return;
        }
      });
      res.json({
        transcriptData: transcriptData,
        message: "now you can ask question about this",
        videoTitle: transcriptData.videoTitle,
      });
      return;
    } else {
      res.json({ error: transcriptData.error });
      return;
    }
  } catch (error) {
    console.log("getOnlyTranscript controller error ==>", error.message);
    res.json({ error: error.message });
    return;
  }
};

module.exports = {
  getTranscript,
  getOnlyTranscript,
};
