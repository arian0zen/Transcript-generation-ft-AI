const ytdl = require("ytdl-core");
const fs = require("fs");
const openAiWhisper = require("./openaiWhisper");
const Transcripts = require("../models/Transcripts");

const getTranscriptResponse = async (url, mp3) => {
  try {
    const foundVideo = await Transcripts.findOne({ videoUrl: url });
    if (foundVideo) {
      return { success: true, newFileCreated: false, transcriptText: foundVideo.transcript };
    } else {
      const info = await ytdl.getInfo(url);
      if(info.videoDetails.lengthSeconds > 1380){
        return { success: false,  newFileCreated: false, error: "Video is larger than expected, try smaller videos" };
      }
      const headerText = `The title is: ${info.videoDetails.title} and the text is: `
      const video = ytdl(url, {quality: "lowestaudio"}, { filter: "audioonly" });
      const writeStream = fs.createWriteStream(mp3);
      video.pipe(writeStream);
      const fileCreationPromise = new Promise((resolve) => {
        writeStream.on("finish", () => {
          resolve();
        });
      });
      await fileCreationPromise;

      const transcriptText = await openAiWhisper(url, mp3, headerText);
      console.log("transcriptText", transcriptText)
      if(transcriptText.error){
        return { success: false,  newFileCreated: false, error: transcriptText.error };
      }
      return { success: true, newFileCreated: true, transcriptText: transcriptText.resp, mongoId: transcriptText.createdMongoId };
    }
  } catch (error) {
    return { success: false,  newFileCreated: false, error: error.message };
  }
};

module.exports = getTranscriptResponse;
