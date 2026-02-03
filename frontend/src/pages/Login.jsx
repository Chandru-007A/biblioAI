import { Link } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";

export default function Login() {
  return (
    <AuthLayout title="Login to biblio.ai">
      <form className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 rounded bg-gray-800 outline-none"
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 rounded bg-gray-800 outline-none"
        />

        <button className="w-full bg-indigo-600 hover:bg-indigo-700 p-3 rounded font-semibold">
          Login
        </button>
      </form>

      <p className="text-center text-sm mt-4 text-gray-400">
        Don’t have an account?{" "}
        <Link to="/signup" className="text-indigo-400">
          Sign up
        </Link>
      </p>
    </AuthLayout>
  );
}
