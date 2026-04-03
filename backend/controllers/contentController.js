import axios from "axios";
import { isNonEmptyString } from "../utils/validators.js";

const GNEWS_API_KEY = process.env.GNEWS_API_KEY?.trim();
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY?.trim();

export const searchNews = async (req, res) => {
  try {
    const query = req.query.q;

    if (!isNonEmptyString(query)) {
      return res.status(400).json({ error: "Search query is required" });
    }

    if (!GNEWS_API_KEY) {
      return res.status(500).json({ error: "GNEWS_API_KEY is missing" });
    }

    const response = await axios.get("https://gnews.io/api/v4/search", {
      params: {
        q: query,
        lang: "en",
        country: "in",
        max: 10,
        apikey: GNEWS_API_KEY,
      },
    });

    const items = (response.data.articles || []).map((article) => ({
      title: article.title,
      snippet: article.description || "No description available.",
      link: article.url,
      source: article.source?.name || "Unknown source",
      image: article.image || "",
      publishedAt: article.publishedAt || "",
    }));

    return res.json({ items });
  } catch (error) {
    console.error("GNews error:", error.response?.data || error.message);

    return res.status(error.response?.status || 500).json({
      error:
        error.response?.data?.errors?.[0] ||
        error.response?.data?.message ||
        "Failed to fetch news.",
    });
  }
};

export const searchYoutube = async (req, res, next) => {
  try {
    const { query, maxResults = 12 } = req.query;

    if (!isNonEmptyString(query)) {
      return res.status(400).json({ error: "Query parameter is required" });
    }

    const parsedMaxResults = Number(maxResults);

    if (!Number.isInteger(parsedMaxResults) || parsedMaxResults < 1 || parsedMaxResults > 25) {
      return res.status(400).json({
        error: "maxResults must be an integer between 1 and 25.",
      });
    }

    const response = await axios.get("https://www.googleapis.com/youtube/v3/search", {
      params: {
        part: "snippet",
        q: `${query} educational tutorial`,
        type: "video",
        maxResults: parsedMaxResults,
        key: YOUTUBE_API_KEY,
        videoEmbeddable: "true",
      },
    });

    const videos = response.data.items.map((item) => ({
      id: item.id.videoId,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnail: item.snippet.thumbnails.medium.url,
      channelTitle: item.snippet.channelTitle,
      publishedAt: item.snippet.publishedAt,
      url: `https://www.youtube.com/embed/${item.id.videoId}`,
    }));

    return res.json(videos);
  } catch (error) {
    console.error("YouTube API error:", error.response?.data || error.message);

    return res.status(error.response?.status || 500).json({
      error:
        error.response?.data?.error?.message ||
        "Failed to fetch videos from YouTube.",
    });
  }
};