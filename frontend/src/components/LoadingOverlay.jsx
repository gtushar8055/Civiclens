import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import {
  BrainCircuit,
  ScanSearch,
  Languages,
  ShieldAlert,
  MapPinned,
  FileText,
  Image as ImageIcon,
  CheckCircle2,
  Loader2
} from "lucide-react";

const steps = [
  { icon: Languages, text: "Detecting language..." },
  { icon: ImageIcon, text: "Analyzing visual evidence..." },
  { icon: BrainCircuit, text: "Understanding context..." },
  { icon: MapPinned, text: "Routing to department..." },
  { icon: ShieldAlert, text: "Assessing priority level..." },
  { icon: FileText, text: "Generating official report..." },
];

function LoadingOverlay() {
  const [activeStep, setActiveStep] = useState(0);


  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 1200); // Progress to next step every 1.2s
    
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[999] bg-white/95 dark:bg-[#121212]/95 backdrop-blur-xl flex flex-col items-center justify-center"
    >

      <div className="relative w-40 h-40 flex items-center justify-center mb-8">

        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
          className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 blur-2xl opacity-40 dark:opacity-60"
        />
        

        <div className="absolute w-32 h-32 rounded-full border border-slate-300 dark:border-slate-700" />
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
          className="absolute w-32 h-32 rounded-full border-t-2 border-purple-500 border-dashed"
        />
        <motion.div 
          animate={{ rotate: -360 }}
          transition={{ repeat: Infinity, duration: 12, ease: "linear" }}
          className="absolute w-40 h-40 rounded-full border-b-2 border-orange-500 border-dotted opacity-50"
        />


        <motion.div 
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          className="w-12 h-12 rounded-full bg-gradient-to-tr from-purple-600 to-orange-500 shadow-xl flex items-center justify-center relative z-10"
        >
          <div className="w-full h-full rounded-full bg-white/30 animate-ping absolute" />
          <BrainCircuit size={24} className="text-white relative z-10" />
        </motion.div>


        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
          className="absolute w-32 h-32"
        >
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white dark:bg-slate-800 p-2 rounded-full border border-slate-200 dark:border-slate-700 shadow-lg text-purple-600 dark:text-purple-400">
            <ScanSearch size={20} />
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl font-bold font-heading mb-2">
          <span className="text-gradient-mesh">CivicLens AI</span>
        </h1>
        <p className="text-slate-600 dark:text-slate-400 font-medium animate-pulse">
          Synthesizing official report...
        </p>
      </motion.div>

      <div className="space-y-3 w-full max-w-[400px] relative z-10 px-6">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isActive = index === activeStep;
          const isPast = index < activeStep;
          
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`flex items-center gap-4 border rounded-2xl p-3.5 transition-all duration-300 ${
                isActive 
                  ? "bg-white dark:bg-slate-800 border-purple-400 dark:border-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.2)] scale-105 z-10 relative" 
                  : isPast
                  ? "bg-slate-50/50 dark:bg-slate-800/30 border-slate-200 dark:border-slate-700/50 opacity-70"
                  : "bg-transparent border-transparent opacity-40"
              }`}
            >
              <div className={`p-2 rounded-xl flex-shrink-0 transition-colors duration-300 ${
                isActive 
                  ? "bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400"
                  : isPast
                  ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500"
              }`}>
                {isPast ? <CheckCircle2 size={20} /> : isActive ? <Loader2 size={20} className="animate-spin" /> : <Icon size={20} />}
              </div>
              <span className={`font-semibold text-sm transition-colors duration-300 ${
                isActive 
                  ? "text-slate-900 dark:text-white" 
                  : isPast
                  ? "text-slate-600 dark:text-slate-400"
                  : "text-slate-500 dark:text-slate-500"
              }`}>
                {step.text}
              </span>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

export default LoadingOverlay;
