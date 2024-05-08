const ytsr = require("ytsr");

const searchYouTubeVideos = async (
  topic,
  maxResults = 6,
  maxDurationMinutes = 6
) => {
  try {
    const filters = await ytsr.getFilters(topic);

    // Use the 'Type' filter to get only videos
    const videoFilter = filters.get("Type").get("Video");
    // Build the duration filter directly in the URL
    const durationFilter = `short <= ${maxDurationMinutes}`;

    // Get search results based on the specified filters
    const searchResults = await ytsr(videoFilter?.url + "&" + durationFilter, {
      limit: maxResults,
    });

    // Extract video details from the search results
    const videoDetails = searchResults.items.map((item) => ({
      title: item.title,
      url: item.url,
      duration: item.duration,
      videoId: item.id,
      thumbnail: item.bestThumbnail.url, // Get the URL of the best quality thumbnail
    }));

    return videoDetails;
  } catch (error) {
    console.error("Error searching for YouTube videos:", error.message);
    return [];
  }
};

module.exports = searchYouTubeVideos;
