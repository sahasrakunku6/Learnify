import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { motion } from "framer-motion";
import Chatbot from "../components/Chatbot";
import apiClient from "../apiClient";


const NewsFeed = () => {
  const [query, setQuery] = useState("latest news");
  const [news, setNews] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchNews = async (searchQuery) => {
    const trimmedQuery = searchQuery.trim();
    if (!trimmedQuery) return;

    try {
      setLoading(true);
      setError("");
      const response = await apiClient.get(`/search?q=${encodeURIComponent(trimmedQuery)}`);
      setNews(response.data.items || []);
    } catch (error) {
      console.error("Full news error:", error);
      console.error("Backend response data:", error?.response?.data);
      console.error("Backend status:", error?.response?.status);

      setError(
        error?.response?.data?.error ||
        error?.message ||
        "Failed to fetch news."
      );
      setNews([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews(query);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchNews(query);
  };

  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 p-6 bg-[#f9f9f9] min-h-screen">
        <h1 className="text-4xl font-extrabold mb-8 text-center text-gray-800">News Feed</h1>

        <form
          onSubmit={handleSearch}
          className="flex flex-col sm:flex-row gap-4 mb-8 max-w-4xl mx-auto"
        >
          <input
            type="text"
            className="border border-gray-300 px-4 py-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-black"
            placeholder="Search news..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button
            type="submit"
            className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition"
          >
            🔍 Search
          </button>
        </form>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 px-4">
          {loading ? (
            <p className="text-center text-gray-600 col-span-full">Loading news...</p>
          ) : error ? (
            <p className="text-center text-red-600 col-span-full">{error}</p>
          ) : news.length > 0 ? (
            news.map((article, index) => (
              <motion.div
                key={index}
                className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <h3 className="text-xl font-semibold mb-2 text-gray-900">{article.title}</h3>
                <p className="text-gray-700 mb-3">{article.snippet}</p>
                <a
                  href={article.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline font-medium"
                >
                  Read more →
                </a>
              </motion.div>
            ))
          ) : (
            <p className="text-center text-gray-600 col-span-full">No news articles found.</p>
          )}
        </div>
      </div>
      <Chatbot />
    </div>
  );
};

export default NewsFeed;
