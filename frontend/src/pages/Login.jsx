import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { BACKEND_API } from "../services/api";
import { Mail, Lock, LogIn } from "lucide-react";

function Login() {
  const navigate = useNavigate();
  const { isDark } = useTheme();

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const login = async () => {
    try {
      const response = await BACKEND_API.post(
        "/api/auth/login",

        {
          email,

          password,
        },
      );

      localStorage.setItem(
        "token",

        response.data.token,
      );

      localStorage.setItem(
        "user",

        JSON.stringify(response.data.user),
      );

      alert("Login Successful");

      navigate("/");
    } catch (error) {
      alert(error.response?.data?.message || "Login Failed");
    }
  };

  return (
    <div
      className={`min-h-screen flex justify-center items-center transition-colors ${
        isDark
          ? "bg-gradient-to-br from-slate-950 to-slate-900"
          : "bg-gradient-to-br from-white to-slate-50"
      }`}
    >
      <div
        className={`p-10 rounded-2xl w-full max-w-sm shadow-2xl border backdrop-blur-sm ${
          isDark
            ? "bg-slate-800/50 border-slate-700"
            : "bg-white/70 border-slate-200"
        }`}
      >
        {/* Header */}
        <div className="mb-10 text-center">
          <h1
            className={`text-4xl font-bold mb-2 ${
              isDark
                ? "bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent"
                : "bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent"
            }`}
          >
            Welcome Back
          </h1>
          <p
            className={`text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}
          >
            Sign in to your CivicLens account
          </p>
        </div>

        {/* Email Input */}
        <div className="mb-5">
          <label
            className={`block mb-2 font-medium text-sm ${isDark ? "text-slate-300" : "text-slate-700"}`}
          >
            Email Address
          </label>
          <div
            className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition ${
              isDark
                ? "bg-slate-700/50 border-slate-600 focus-within:border-blue-500"
                : "bg-white border-slate-300 focus-within:border-blue-500"
            }`}
          >
            <Mail
              size={18}
              className={isDark ? "text-slate-400" : "text-slate-600"}
            />
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full outline-none bg-transparent ${isDark ? "text-white placeholder-slate-500" : "text-slate-900 placeholder-slate-400"}`}
            />
          </div>
        </div>

        {/* Password Input */}
        <div className="mb-6">
          <label
            className={`block mb-2 font-medium text-sm ${isDark ? "text-slate-300" : "text-slate-700"}`}
          >
            Password
          </label>
          <div
            className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition ${
              isDark
                ? "bg-slate-700/50 border-slate-600 focus-within:border-blue-500"
                : "bg-white border-slate-300 focus-within:border-blue-500"
            }`}
          >
            <Lock
              size={18}
              className={isDark ? "text-slate-400" : "text-slate-600"}
            />
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full outline-none bg-transparent ${isDark ? "text-white placeholder-slate-500" : "text-slate-900 placeholder-slate-400"}`}
            />
          </div>
        </div>

        {/* Login Button */}
        <button
          onClick={login}
          className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold transition-all hover:scale-105 shadow-lg hover:shadow-xl ${
            isDark
              ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-500 hover:to-blue-600"
              : "bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-500 hover:to-blue-600"
          }`}
        >
          <LogIn size={18} />
          Sign In
        </button>

        {/* Signup Link */}
        <p
          className={`mt-8 text-center ${isDark ? "text-slate-400" : "text-slate-600"}`}
        >
          Don't have an account?
          <Link
            to="/signup"
            className={`font-semibold ml-2 transition hover:underline ${
              isDark
                ? "text-blue-400 hover:text-blue-300"
                : "text-blue-600 hover:text-blue-700"
            }`}
          >
            Create one now
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
