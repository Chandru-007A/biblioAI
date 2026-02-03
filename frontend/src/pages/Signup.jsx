import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import AuthLayout from "../components/AuthLayout";

export default function Signup() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    whatsapp_number: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await register(formData);
      navigate("/home");
    } catch (err) {
      setError(err.response?.data?.detail || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Create your biblio.ai account">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-600 text-white p-3 rounded text-sm">
            {error}
          </div>
        )}

        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Full Name"
          className="w-full p-3 rounded bg-gray-800 outline-none focus:ring-2 focus:ring-indigo-500"
          required
        />

        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          className="w-full p-3 rounded bg-gray-800 outline-none focus:ring-2 focus:ring-indigo-500"
          required
        />

        <input
          type="tel"
          name="whatsapp_number"
          value={formData.whatsapp_number}
          onChange={handleChange}
          placeholder="WhatsApp Number"
          className="w-full p-3 rounded bg-gray-800 outline-none focus:ring-2 focus:ring-indigo-500"
          required
        />

        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Password"
          className="w-full p-3 rounded bg-gray-800 outline-none focus:ring-2 focus:ring-indigo-500"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-600 p-3 rounded font-semibold transition-colors"
        >
          {loading ? "Creating Account..." : "Sign Up"}
        </button>
      </form>

      <p className="text-center text-sm mt-4 text-gray-400">
        Already have an account?{" "}
        <Link to="/" className="text-indigo-400 hover:text-indigo-300">
          Login
        </Link>
      </p>
    </AuthLayout>
  );
}
