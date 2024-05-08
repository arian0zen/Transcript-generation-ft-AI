const ytdl = require("ytdl-core");
// const ytdl = require("@distube/ytdl-core");

const fs = require("fs");
const openAiWhisper = require("./openaiWhisper");
const Transcripts = require("../models/Transcripts");

const getTranscriptResponse = async (url, mp3) => {
  try {
    const foundVideo = await Transcripts.findOne({ videoUrl: url });
    if (foundVideo) {
      let videoId = ytdl.getURLVideoID(url);
      console.log("videoId", videoId);
      const info = await ytdl.getBasicInfo(videoId);
      return {
        success: true,
        newFileCreated: false,
        transcriptText: foundVideo.transcript,
        videoTitle: info.videoDetails.title,
      };
    } else {
      let videoId = ytdl.getURLVideoID(url);
      console.log("videoId", videoId);
      const info = await ytdl.getBasicInfo(videoId);
      console.log("The title of the video is ==> ", info.videoDetails.title);
      if (info.videoDetails.lengthSeconds > 1380) {
        return {
          success: false,
          newFileCreated: false,
          error: "Video is larger than expected, try smaller videos",
        };
      }
      console.log("this is line number 28");
      const headerText = `The title is: ${info.videoDetails.title} and the text is: `;
      const video = ytdl(
        videoId,
        { quality: "lowestaudio" },
        { filter: "audioonly" }
      );

      const writeStream = fs.createWriteStream(mp3);
      video.pipe(writeStream);
      const fileCreationPromise = new Promise((resolve) => {
        writeStream.on("finish", () => {
          resolve();
        });
        writeStream.on("error", (error) => {
          console.log("writeStream error ==>", error);
          resolve();
        });
      });
      await fileCreationPromise;

      const transcriptText = await openAiWhisper(url, mp3, headerText);
      console.log("transcriptText", transcriptText);
      if (transcriptText.error) {
        return {
          success: false,
          newFileCreated: false,
          error: transcriptText.error,
        };
      }
      return {
        success: true,
        newFileCreated: true,
        transcriptText: transcriptText.resp,
        mongoId: transcriptText.createdMongoId,
        videoTitle: info.videoDetails.title,
      };
    }
  } catch (error) {
    console.log("getTranscriptResponse error ==>", error);
    return { success: false, newFileCreated: false, error: error.message };
  }
};

module.exports = getTranscriptResponse;
