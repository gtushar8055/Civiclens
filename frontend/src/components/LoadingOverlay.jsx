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
  {
    icon: Languages,
    text: "Detecting language...",
  },
  {
    icon: BrainCircuit,
    text: "Understanding complaint...",
  },
  {
    icon: MapPinned,
    text: "Finding concerned department...",
  },
  {
    icon: ShieldAlert,
    text: "Assessing priority level...",
  },
  {
    icon: ImageIcon,
    text: "Analyzing uploaded image...",
  },
  {
    icon: FileText,
    text: "Generating official complaint...",
  },
];

function LoadingOverlay() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[999] bg-slate-950/85 backdrop-blur-md flex flex-col items-center justify-center"
    >
      {/* AI Orb */}

      <div className="relative w-36 h-36 flex items-center justify-center">
        {/* Orbit Ring */}
        <div className="absolute w-28 h-28 rounded-full border-2 border-cyan-500/40" />

        {/* Center Dot */}
        <div className="w-4 h-4 rounded-full bg-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.9)]" />

        {/* Rotating Magnifier */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{
            repeat: Infinity,
            duration: 2,
            ease: "linear",
          }}
          className="absolute w-28 h-28"
        >
          <div className="absolute -top-4 left-1/2 -translate-x-1/2">
            <ScanSearch size={32} className="text-cyan-300" />
          </div>
        </motion.div>
      </div>

      <motion.h1
        initial={{
          opacity: 0,
          y: 15,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        className="mt-8 text-3xl font-bold text-white"
      >
        CivicLens AI is Thinking...
      </motion.h1>

      <motion.p
        animate={{
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          repeat: Infinity,
          duration: 2,
        }}
        className="mt-3 text-slate-300"
      >
        Please wait while AI prepares your civic report.
      </motion.p>

      <div className="mt-10 space-y-4 w-[430px]">
        {steps.map((step, index) => {
          const Icon = step.icon;

          return (
            <motion.div
              key={index}
              initial={{
                opacity: 0,
                x: -30,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              transition={{
                delay: index * 0.25,
              }}
              className="flex items-center gap-4 bg-slate-900/70 border border-slate-700 rounded-xl p-4"
            >
              <Icon size={22} className="text-cyan-400" />

              <span className="text-white">{step.text}</span>
            </motion.div>
          );
        })}
      </div>

      <motion.div
        animate={{
          width: ["0%", "100%"],
        }}
        transition={{
          repeat: Infinity,
          duration: 3,
        }}
        className="mt-10 h-1 bg-cyan-400 rounded-full w-72"
      />
    </motion.div>
  );
}

export default LoadingOverlay;
