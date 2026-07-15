import { motion } from "framer-motion";
import {
  BrainCircuit,
  ScanSearch,
  Languages,
  ShieldAlert,
  MapPinned,
  FileText,
  Image as ImageIcon,
} from "lucide-react";

const steps = [
  { icon: Languages, text: "Detecting language..." },
  { icon: BrainCircuit, text: "Understanding complaint..." },
  { icon: MapPinned, text: "Finding concerned department..." },
  { icon: ShieldAlert, text: "Assessing priority level..." },
  { icon: ImageIcon, text: "Analyzing uploaded image..." },
  { icon: FileText, text: "Generating official complaint..." },
];

function LoadingOverlay() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[999] bg-[#10002b]/95 backdrop-blur-xl flex flex-col items-center justify-center"
    >
      {/* Premium AI Core */}
      <div className="relative w-40 h-40 flex items-center justify-center mb-6">
        {/* Outer glowing ring */}
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
          className="absolute inset-0 rounded-full bg-primary/20 blur-2xl"
        />
        
        {/* Orbit Rings */}
        <div className="absolute w-32 h-32 rounded-full border border-primary-light/30" />
        <motion.div 
          animate={{ rotate: -360 }}
          transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
          className="absolute w-32 h-32 rounded-full border-t-2 border-primary-light border-dashed opacity-50"
        />

        {/* Pulsing Center */}
        <motion.div 
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-primary-light shadow-[0_0_40px_rgba(199,125,255,1)] flex items-center justify-center"
        >
          <div className="w-full h-full rounded-full bg-white/20 animate-pulse" />
        </motion.div>

        {/* Orbiting Scanner */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 2.5, ease: "linear" }}
          className="absolute w-32 h-32"
        >
          <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-[#240046] p-1.5 rounded-full border border-primary/50 shadow-[0_0_15px_rgba(157,78,221,0.6)]">
            <ScanSearch size={24} className="text-primary-light" />
          </div>
        </motion.div>
      </div>

      <motion.h1
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-4 text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-light to-white text-center font-heading"
      >
        CivicLens AI
      </motion.h1>

      <motion.p
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="mt-2 text-primary-light text-lg tracking-wide font-medium"
      >
        Synthesizing report...
      </motion.p>

      <div className="mt-12 space-y-4 w-[430px] relative z-10">
        {steps.map((step, index) => {
          const Icon = step.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.4 }}
              className="flex items-center gap-4 bg-[#240046]/50 border border-primary/20 rounded-xl p-4 shadow-lg backdrop-blur-sm relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent w-0 group-hover:w-full transition-all duration-500 ease-out" />
              <div className="p-2 bg-[#10002b] rounded-lg border border-primary/30 relative z-10">
                <Icon size={20} className="text-primary-light" />
              </div>
              <span className="text-slate-200 font-medium relative z-10">{step.text}</span>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-10 h-1.5 bg-[#240046] rounded-full w-80 overflow-hidden">
        <motion.div
          animate={{ x: ["-100%", "100%"] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="h-full bg-gradient-to-r from-transparent via-primary-light to-transparent w-1/2"
        />
      </div>
    </motion.div>
  );
}

export default LoadingOverlay;
