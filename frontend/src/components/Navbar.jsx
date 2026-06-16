import { Link } from "react-router-dom";
import { BrainCircuit, Sun, Moon } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

function Navbar() {
  const { isDark, toggleTheme } = useTheme();
  const isLoggedIn = !!localStorage.getItem("token");

  const user = JSON.parse(localStorage.getItem("user") || "null");

  return (
    <nav
      className={`w-full border-b sticky top-0 z-50 transition-all duration-300 ${
        isDark
          ? "border-slate-800 bg-slate-950/80 backdrop-blur-md"
          : "border-slate-200 bg-white/80 backdrop-blur-md shadow-sm"
      }`}
    >
      <div className="max-w-7xl mx-auto px-8 h-20 flex items-center justify-between">
        {/* Logo */}

        <Link
          to="/"
          className="flex items-center gap-3 hover:opacity-80 transition"
        >
          <img
            src={isDark ? "/Dark_Theme_logo.png" : "/Light_theme_logo.png"}
            alt="CivicLens Logo"
            className="h-12 w-auto object-contain"
          />
        </Link>

        {/* Navigation & Theme Toggle */}

        <div className="flex items-center gap-8">
          <Link
            to="/"
            className={`font-medium transition hover:text-blue-500 ${
              isDark
                ? "text-slate-300 hover:text-white"
                : "text-slate-700 hover:text-slate-900"
            }`}
          >
            Home
          </Link>

          {isLoggedIn && (
            <Link
              to="/history"
              className={`font-medium transition hover:text-blue-500 ${
                isDark
                  ? "text-slate-300 hover:text-white"
                  : "text-slate-700 hover:text-slate-900"
              }`}
            >
              History
            </Link>
          )}

          <Link
            to={isLoggedIn ? "/report" : "/login"}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 transition px-5 py-3 rounded-xl font-medium text-white shadow-lg hover:shadow-xl"
          >
            Report Complaint
          </Link>

          {!isLoggedIn ? (
            <>
              <Link
                to="/login"
                className={`font-medium ${
                  isDark ? "text-slate-300" : "text-slate-700"
                }`}
              >
                Login
              </Link>

              <Link
                to="/signup"
                className={`font-medium ${
                  isDark ? "text-slate-300" : "text-slate-700"
                }`}
              >
                Signup
              </Link>
            </>
          ) : (
            <>
              <span
                className={`font-medium ${
                  isDark ? "text-white" : "text-slate-800"
                }`}
              >
                {user?.name}
              </span>

              <button
                onClick={() => {
                  localStorage.clear();
                  window.location.href = "/login";
                }}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white"
              >
                Logout
              </button>
            </>
          )}

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className={`p-2.5 rounded-xl transition-all duration-300 hover:scale-110 ${
              isDark
                ? "bg-slate-800 text-yellow-400 hover:bg-slate-700"
                : "bg-slate-200 text-slate-700 hover:bg-slate-300"
            }`}
            aria-label="Toggle theme"
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
