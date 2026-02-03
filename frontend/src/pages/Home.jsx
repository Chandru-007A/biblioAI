import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import GalaxyBackground from "../components/background/GalaxyBackground";
import Navbar from "../components/Navbar";
import TextRotate from "../components/ui/TextRotate";
import CountUp from "../components/ui/CountUp";
import apiClient from "../utils/api";

export default function Home() {
  const [stats, setStats] = useState({
    total_books: 0,
    total_users: 0,
    active_borrowings: 0
  });
  const [loading, setLoading] = useState(true);
  const [recommendations, setRecommendations] = useState([]);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchLibraryStats();
    if (user) {
      fetchRecommendations();
    }
  }, [user]);

  const fetchLibraryStats = async () => {
    try {
      const response = await apiClient.get("/api/analytics/library");
      setStats({
        total_books: response.total_books,
        total_users: response.total_users,
        active_borrowings: response.active_borrowings
      });
    } catch (error) {
      console.error("Error fetching library stats:", error);
      // Fallback to basic stats if analytics endpoint fails
      try {
        const books = await apiClient.get("/api/books?limit=1");
        setStats(prev => ({ ...prev, total_books: books.length || 0 }));
      } catch (err) {
        console.error("Error fetching books count:", err);
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchRecommendations = async () => {
    try {
      const recs = await apiClient.getRecommendations(6);
      setRecommendations(recs);
    } catch (error) {
      console.error("Error fetching recommendations:", error);
    }
  };

  const handleBorrow = async (bookId) => {
    try {
      await apiClient.borrowBook(bookId);
      alert("Book borrowed successfully!");
      fetchRecommendations(); // Refresh recommendations
    } catch (error) {
      alert("Error borrowing book: " + error.response?.data?.detail);
    }
  };

  return (
    <div className="relative min-h-screen text-white">
      <GalaxyBackground />
      <Navbar />

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen pt-20">
        <h1 className="text-5xl font-bold mb-4 text-emerald-400">
          biblio.ai
        </h1>

        <TextRotate />

        <div className="flex gap-12 mt-10 text-center">
          <div>
            <CountUp to={stats.total_books} className="text-3xl font-bold" />
            <p className="text-gray-400">Books</p>
          </div>
          <div>
            <CountUp to={stats.total_users} className="text-3xl font-bold" />
            <p className="text-gray-400">Users</p>
          </div>
          <div>
            <CountUp to={stats.active_borrowings} className="text-3xl font-bold" />
            <p className="text-gray-400">Active Borrowings</p>
          </div>
        </div>

        {user && (
          <div className="mt-12 w-full max-w-6xl px-4">
            <h2 className="text-2xl font-bold mb-6 text-center">Recommended for You</h2>
            {recommendations.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recommendations.slice(0, 6).map((rec) => (
                  <div key={rec.book.id} className="bg-gray-800/80 backdrop-blur-sm rounded-lg p-6 hover:bg-gray-700/80 transition-colors">
                    <h3 className="text-xl font-semibold mb-2">{rec.book.title}</h3>
                    <p className="text-gray-400 mb-2">by {rec.book.author}</p>
                    <p className="text-sm text-gray-300 mb-4 line-clamp-2">{rec.book.description}</p>
                    <p className="text-sm text-emerald-400 mb-4">{rec.reason}</p>
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-sm text-gray-400">{rec.book.genre}</span>
                      <span className="text-sm text-green-400">{rec.book.available_copies} available</span>
                    </div>
                    <button
                      onClick={() => handleBorrow(rec.book.id)}
                      disabled={rec.book.available_copies === 0}
                      className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-600 px-4 py-2 rounded font-semibold transition-colors"
                    >
                      {rec.book.available_copies > 0 ? "Borrow" : "Unavailable"}
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-400">
                <p>Loading recommendations...</p>
              </div>
            )}

            <div className="text-center mt-8">
              <button
                onClick={() => navigate("/dashboard")}
                className="bg-emerald-600 hover:bg-emerald-700 px-8 py-3 rounded-lg font-semibold transition-colors"
              >
                Explore All Books
              </button>
            </div>
          </div>
        )}

        {!user && (
          <div className="mt-12 text-center">
            <p className="text-gray-400 mb-6">Join our AI-powered library system</p>
            <div className="space-x-4">
              <button
                onClick={() => navigate("/")}
                className="bg-indigo-600 hover:bg-indigo-700 px-6 py-3 rounded font-semibold transition-colors"
              >
                Login
              </button>
              <button
                onClick={() => navigate("/signup")}
                className="bg-emerald-600 hover:bg-emerald-700 px-6 py-3 rounded font-semibold transition-colors"
              >
                Sign Up
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
