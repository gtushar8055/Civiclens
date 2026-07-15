import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { BACKEND_API } from "../services/api";
import { User, Mail, Lock, ArrowRight, ShieldCheck } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

function SignUp() {
  const { isDark } = useTheme();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const response = await BACKEND_API.post("/api/auth/register", {
        name,
        email,
        password,
      });

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      navigate("/");
    } catch {
      alert("Registration failed");
    }
  };

  return (
    <div className="min-h-screen w-full relative flex items-center justify-center p-4">
      <Link to="/" className="absolute top-8 left-8 font-bold text-xl tracking-tight flex items-center gap-2 group text-slate-900 dark:text-white">
        <img
          src={isDark ? "/Dark_Theme_logo.png" : "/Light_theme_logo.png"}
          alt="CivicLens Logo"
          className="h-8 w-auto object-contain drop-shadow-sm group-hover:drop-shadow-md transition-all"
        />
      </Link>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-[420px]"
      >
        <div className="bg-white dark:bg-slate-800 rounded-[32px] p-8 md:p-10 shadow-floating border-[3px] border-slate-100 dark:border dark:border-slate-700 relative overflow-hidden">
          {/* Decorative Top Accent */}
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-purple-500 to-orange-400" />
          
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center mx-auto mb-6 text-orange-500 dark:text-orange-400">
              <ShieldCheck size={32} />
            </div>
            <h1 className="text-3xl font-bold font-heading mb-2 text-slate-900 dark:text-white">Join CivicLens</h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium">Create an account to report issues</p>
          </div>

          <form onSubmit={handleSignup} className="space-y-5">
            <div>
              <label className="block text-xs font-bold tracking-widest uppercase text-slate-500 dark:text-slate-400 mb-2">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                  <User size={18} />
                </div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-11 pr-4 py-4 rounded-2xl border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-medium transition-all"
                  placeholder="John Doe"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold tracking-widest uppercase text-slate-500 dark:text-slate-400 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-4 rounded-2xl border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-medium transition-all"
                  placeholder="name@example.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold tracking-widest uppercase text-slate-500 dark:text-slate-400 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                  <Lock size={18} />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-4 rounded-2xl border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-medium transition-all"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full btn-gradient py-4 flex items-center justify-center gap-2 group mt-8"
            >
              Create Account
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-slate-500 dark:text-slate-400 font-medium">
              Already have an account?{" "}
              <Link to="/login" className="text-purple-600 dark:text-purple-400 font-bold hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default SignUp;
