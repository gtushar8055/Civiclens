import { Link } from "react-router-dom";
import { Sun, Moon, ArrowRight } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

function Navbar() {
  const { isDark, toggleTheme } = useTheme();
  const isLoggedIn = !!localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");

  return (
    <nav className="w-full z-50 pt-6 pb-4">
      <div className="max-w-[1200px] mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group transition-transform hover:scale-105">
          <img
            src={isDark ? "/Dark_Theme_logo.png" : "/Light_theme_logo.png"}
            alt="CivicLens Logo"
            className="h-10 w-auto object-contain drop-shadow-sm group-hover:drop-shadow-md transition-all"
          />
        </Link>

        {/* Navigation Links - Center */}
        <div className="hidden md:flex items-center gap-8">
          <Link to="/" className="font-medium text-sm transition-colors hover:text-primary">Home</Link>
          {isLoggedIn && (
            <Link to="/history" className="font-medium text-sm transition-colors hover:text-primary">History</Link>
          )}
          <Link to="/report" className="font-medium text-sm transition-colors hover:text-primary">Report Issue</Link>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          {!isLoggedIn ? (
            <div className="flex items-center gap-3">
              <Link to="/login" className="font-medium text-sm transition-colors hover:text-primary hidden sm:block">Log in</Link>
              <Link to="/signup" className="btn-gradient px-5 py-2 text-sm flex items-center gap-2">
                Sign up <ArrowRight size={16} />
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <span className="font-semibold text-sm tracking-wide hidden sm:block">{user?.name}</span>
              <button
                onClick={() => {
                  localStorage.clear();
                  window.location.href = "/login";
                }}
                className="btn-outline px-4 py-2 text-sm text-red-600 hover:text-red-700"
              >
                Logout
              </button>
            </div>
          )}

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="w-10 h-10 rounded-full border border-slate-200 dark:border-slate-700 flex items-center justify-center transition-all hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="Toggle theme"
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
