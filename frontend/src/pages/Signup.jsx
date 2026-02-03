import { Link } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";

export default function Signup() {
  return (
    <AuthLayout title="Create your biblio.ai account">
      <form className="space-y-4">
        <input
          type="text"
          placeholder="Full Name"
          className="w-full p-3 rounded bg-gray-800 outline-none"
        />

        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 rounded bg-gray-800 outline-none"
        />

        <input
          type="tel"
          placeholder="WhatsApp Number"
          className="w-full p-3 rounded bg-gray-800 outline-none"
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 rounded bg-gray-800 outline-none"
        />

        <button className="w-full bg-indigo-600 hover:bg-indigo-700 p-3 rounded font-semibold">
          Sign Up
        </button>
      </form>

      <p className="text-center text-sm mt-4 text-gray-400">
        Already have an account?{" "}
        <Link to="/" className="text-indigo-400">
          Login
        </Link>
      </p>
    </AuthLayout>
  );
}
