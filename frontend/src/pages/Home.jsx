import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Star, Sparkles, CheckCircle2 } from "lucide-react";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="w-full relative overflow-hidden">
      <Navbar />

      <div className="max-w-[1200px] mx-auto px-6 py-12 lg:py-24 grid lg:grid-cols-2 gap-16 items-center min-h-[calc(100vh-120px)]">
        
        {/* Left Content Area */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-xl"
        >
          <h1 className="text-[3.5rem] leading-[1.1] md:text-[4.5rem] font-bold mb-6 tracking-tight">
            <span className="text-gradient-mesh">AI analysis</span><br />
            for real-time civic issues
          </h1>
          
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 mb-10 leading-relaxed font-medium">
            CivicLens records your complaints, recognizes the core issues, and provides real-time resolutions and official letters — all without taking manual notes.
          </p>

          <div className="flex flex-wrap items-center gap-4 mb-8">
            <button
              onClick={() => navigate("/report")}
              className="btn-gradient px-8 py-3.5 text-lg flex items-center gap-2 group"
            >
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" /> Start reporting
            </button>
            <button
              onClick={() => navigate("/history")}
              className="btn-outline px-8 py-3.5 text-lg"
            >
              View history
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm font-medium text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1.5"><div className="w-1 h-1 rounded-full bg-slate-400"></div> AI-powered extraction</span>
            <span className="flex items-center gap-1.5"><div className="w-1 h-1 rounded-full bg-slate-400"></div> Instant official letters</span>
            <span className="flex items-center gap-1.5"><div className="w-1 h-1 rounded-full bg-slate-400"></div> Priority routing</span>
          </div>
        </motion.div>

        {/* Right Content Area - Floating UI Elements (Screenshot Inspired) */}
        <div className="relative h-[500px] lg:h-[600px] w-full hidden md:block">
          
          {/* Main Central Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 bg-white dark:bg-slate-800 rounded-3xl p-5 shadow-floating border-[3px] border-slate-100 dark:border dark:border-slate-700 z-20"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center text-purple-600 dark:text-purple-400">
                  <Star size={16} className="fill-current" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm">Complaint Analysis</h4>
                  <p className="text-[10px] text-slate-500">Processing text & images</p>
                </div>
              </div>
              <div className="flex gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-200 dark:bg-slate-600"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-slate-200 dark:bg-slate-600"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-slate-200 dark:bg-slate-600"></span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="h-2 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="h-full bg-gradient-to-r from-purple-500 to-orange-400"
                />
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 text-sm border-[3px] border-slate-100 dark:border dark:border-slate-700">
                <div className="flex items-center gap-2 mb-2 text-purple-600 dark:text-purple-400 font-semibold text-xs uppercase tracking-wider">
                  <Sparkles size={14} /> AI Recommendation
                </div>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                  The issue has been identified as <span className="font-bold text-orange-500">High Priority</span>. Drafting official letter to the Municipal Department...
                </p>
              </div>
            </div>
          </motion.div>

          {/* Floating Card 1 - Top Left */}
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[15%] left-[5%] p-3 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border-[3px] border-slate-100 dark:border dark:border-slate-700 z-10 flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-500">
              <CheckCircle2 size={20} />
            </div>
            <div>
              <p className="text-xs font-bold">Category Detected</p>
              <p className="text-[10px] text-slate-500">Infrastructure</p>
            </div>
          </motion.div>

          {/* Floating Card 2 - Bottom Left (Infrastructure) */}
          <motion.div
            animate={{ y: [0, 15, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute bottom-[10%] left-[5%] p-4 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border-[3px] border-slate-100 dark:border dark:border-slate-700 z-30 flex items-center gap-4"
          >
             <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-500">
               <Star size={18} className="fill-current" />
             </div>
             <div>
                <p className="text-sm font-bold text-slate-700 dark:text-slate-300">Pothole Detected</p>
                <p className="text-[10px] text-slate-500 font-medium">Severity: High</p>
             </div>
          </motion.div>

          {/* Decorative Connecting Lines (SVG) */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" style={{ filter: "drop-shadow(0px 2px 4px rgba(0,0,0,0.05))" }}>
            <path d="M 120 200 Q 250 150 300 280" fill="none" stroke="currentColor" className="text-slate-200 dark:text-slate-700" strokeWidth="2" strokeDasharray="4 4" />
            <path d="M 400 350 Q 450 450 380 500" fill="none" stroke="currentColor" className="text-slate-200 dark:text-slate-700" strokeWidth="2" strokeDasharray="4 4" />
          </svg>

        </div>
      </div>
      
      {/* Footer */}
      <footer className="w-full border-t border-slate-200/50 dark:border-slate-700/50 py-8 text-center bg-white/30 dark:bg-slate-900/30 backdrop-blur-sm">
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
          © 2026 CivicLens (Tushar Gupta). All rights reserved.
        </p>
      </footer>
    </div>
  );
}

export default Home;
