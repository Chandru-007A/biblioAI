import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import Navbar from "../components/Navbar";
import apiClient from "../utils/api";

function Dashboard() {
  const { user } = useAuth();
  const [books, setBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await apiClient.get("/api/books?limit=12");
      setBooks(response);
    } catch (error) {
      console.error("Error fetching books:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      const results = await apiClient.get(`/api/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchResults(results);
    } catch (error) {
      console.error("Error searching books:", error);
    }
  };

  const handleBorrow = async (bookId) => {
    try {
      await apiClient.post("/api/borrow", { book_id: bookId });
      alert("Book borrowed successfully!");
      fetchBooks(); // Refresh the list
    } catch (error) {
      alert("Error borrowing book: " + error.response?.data?.detail);
    }
  };

  const displayBooks = searchResults.length > 0 ? searchResults.map(r => r.book) : books;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <Navbar />
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />
      <div className="container mx-auto px-4 py-8 pt-24">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Welcome to biblio.ai, {user?.name}!</h1>
          <p className="text-gray-400">Discover your next great read with AI-powered recommendations.</p>
        </div>

        <form onSubmit={handleSearch} className="mb-8">
          <div className="flex gap-4">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for books..."
              className="flex-1 p-3 rounded bg-gray-800 outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 px-6 py-3 rounded font-semibold"
            >
              Search
            </button>
          </div>
        </form>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {displayBooks.map((book) => (
            <div key={book.id} className="bg-gray-800 rounded-lg p-6 hover:bg-gray-700 transition-colors">
              <h3 className="text-xl font-semibold mb-2">{book.title}</h3>
              <p className="text-gray-400 mb-2">by {book.author}</p>
              <p className="text-sm text-gray-500 mb-4 line-clamp-3">{book.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">{book.genre}</span>
                <span className="text-sm text-green-400">{book.available_copies} available</span>
              </div>
              <button
                onClick={() => handleBorrow(book.id)}
                disabled={book.available_copies === 0}
                className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-600 px-4 py-2 rounded font-semibold transition-colors"
              >
                {book.available_copies > 0 ? "Borrow" : "Unavailable"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
