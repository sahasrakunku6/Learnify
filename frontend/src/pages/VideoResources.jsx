import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Chatbot from "../components/Chatbot";
import { API_BASE } from "../config.js";
import apiClient from "../apiClient";

const VideoResources = () => {
  const [videos, setVideos] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [subjectFilter, setSubjectFilter] = useState("All");

  // Sample curated videos by subject
  const curatedVideos = {
    Mathematics: [
      {
        id: "K8zC3bXIlEw",
        title: "Introduction to Algebra",
        subject: "Mathematics",
        url: "https://www.youtube.com/embed/K8zC3bXIlEw",
        thumbnail: "https://img.youtube.com/vi/K8zC3bXIlEw/mqdefault.jpg"
      }
    ],
    Science: [
      {
        id: "libKVRa01L8",
        title: "The Solar System",
        subject: "Science",
        url: "https://www.youtube.com/embed/libKVRa01L8",
        thumbnail: "https://img.youtube.com/vi/libKVRa01L8/mqdefault.jpg"
      }
    ],
    Physics: [
      {
        id: "DzE3B2zI-eE",
        title: "Physics - Laws of Motion",
        subject: "Physics",
        url: "https://www.youtube.com/embed/DzE3B2zI-eE",
        thumbnail: "https://img.youtube.com/vi/DzE3B2zI-eE/mqdefault.jpg"
      }
    ]
  };

  // Get all curated videos
  const allCuratedVideos = Object.values(curatedVideos).flat();

  // Fetch videos from YouTube API
  const fetchVideos = async (query) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiClient.get(`/api/youtube/search?query=${encodeURIComponent(query)}`);
      setVideos(response.data);
    } catch (error) {
      console.error("Error fetching videos:", error);
      setError("Failed to fetch videos. Please try again.");
      setVideos(allCuratedVideos); // Fallback to curated videos
    } finally {
      setLoading(false);
    }
  };

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      fetchVideos(searchQuery);
    }
  };

  // Filter videos by subject
  const filteredVideos = subjectFilter === "All" 
    ? videos.length > 0 ? videos : allCuratedVideos
    : (videos.length > 0 ? videos : allCuratedVideos).filter(video => 
        video.subject === subjectFilter || 
        video.title.toLowerCase().includes(subjectFilter.toLowerCase()) ||
        (video.channelTitle && video.channelTitle.toLowerCase().includes(subjectFilter.toLowerCase()))
      );

  // Load curated videos on initial render
  useEffect(() => {
    setVideos(allCuratedVideos);
  }, []);

  const subjects = ["All", "Mathematics", "Science", "Physics", "Chemistry", "Biology", "History", "English"];

  return (
    <div className="flex bg-[#f9f9f9] min-h-screen">
      <Sidebar />
      <div className="p-8 w-3/4 mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">Educational Video Resources</h1>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex items-center max-w-2xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden mb-8">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for educational videos..."
            className="w-full px-4 py-3 text-lg outline-none"
          />
          <button 
            type="submit" 
            className="bg-black hover:bg-gray-700 text-white px-6 py-3 font-semibold"
            disabled={loading}
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </form>

        {/* Subject Filter */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Filter by Subject:</h2>
          <div className="flex flex-wrap gap-2">
            {subjects.map((subject) => (
              <button
                key={subject}
                onClick={() => setSubjectFilter(subject)}
                className={`px-4 py-2 rounded-full text-sm font-medium ${
                  subjectFilter === subject
                    ? "bg-black text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {subject}
              </button>
            ))}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Videos Grid */}
        {loading ? (
          <div className="text-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading videos...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
            {filteredVideos.map((video, index) => (
              <div
                key={video.id || index}
                className="bg-white p-5 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="mb-2">
                  <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full">
                    {video.subject || video.channelTitle || "Education"}
                  </span>
                </div>
                <h2 className="text-lg font-semibold text-gray-800 mb-3 line-clamp-2">
                  {video.title}
                </h2>
                <div className="relative w-full aspect-video overflow-hidden rounded-xl mb-3">
                  <iframe
                    className="absolute top-0 left-0 w-full h-full"
                    src={video.url}
                    title={video.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
                {video.channelTitle && (
                  <p className="text-sm text-gray-600 mt-2">
                    Channel: {video.channelTitle}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* No Results Message */}
        {!loading && filteredVideos.length === 0 && (
          <div className="text-center py-10">
            <p className="text-gray-600 text-lg">No videos found. Try a different search term.</p>
          </div>
        )}
      </div>
      <Chatbot />
    </div>
  );
};

export default VideoResources;