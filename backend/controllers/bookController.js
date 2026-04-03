import axios from "axios";
import { isNonEmptyString } from "../utils/validators.js";

export const searchBooks = async (req, res, next) => {
  try {
    const query = req.query.q || req.query.query;

    if (!isNonEmptyString(query)) {
      return res.status(400).json({ error: "Query parameter is required" });
    }

    const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&key=${process.env.GOOGLE_BOOKS_API_KEY}`;
    const response = await axios.get(url);

    if (!response.data.items) {
      return res.status(404).json({ error: "No books found" });
    }

    res.json(response.data.items);
  } catch (error) {
    next(error);
  }
};