import Navbar from "../components/Navbar";
import { useTheme } from "../context/ThemeContext";
import { useNavigate } from "react-router-dom";
import {
  BrainCircuit,
  Building2,
  TriangleAlert,
  FileText,
  ScanSearch,
  Lightbulb,
  ArrowRight
} from "lucide-react";

function Home() {
  const { isDark } = useTheme();
  const navigate = useNavigate();

  return (
    <>
      <Navbar />

      <div
        className={`min-h-screen ${isDark ? "bg-gradient-to-br from-slate-950 to-slate-900" : "bg-gradient-to-br from-white to-slate-50"} text-white flex flex-col items-center justify-center px-4 py-20`}
      >
        {/* Hero Content */}
        <div className="text-center max-w-4xl mx-auto">
          {/* Main Heading */}
          <div className="mb-8">
            <h1
              className={`text-7xl md:text-8xl font-bold mb-6 ${
                isDark
                  ? "bg-gradient-to-r from-blue-400 via-blue-500 to-cyan-400 bg-clip-text text-transparent"
                  : "bg-gradient-to-r from-blue-600 via-blue-700 to-cyan-600 bg-clip-text text-transparent"
              }`}
            >
              CivicLens
            </h1>
            <p
              className={`text-xl md:text-2xl font-medium ${isDark ? "text-slate-300" : "text-slate-700"}`}
            >
              AI-Powered Civic Intelligence System
            </p>
          </div>

          {/* Description */}
          <p
            className={`text-lg md:text-xl mb-12 max-w-2xl mx-auto leading-relaxed ${
              isDark ? "text-slate-400" : "text-slate-600"
            }`}
          >
            Report civic issues, let AI analyze them, and drive real change in
            your community. Transform complaints into actionable insights.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col md:flex-row gap-4 justify-center mb-16">
            <button
              onClick={() => navigate("/report")}
              className={`group flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-2xl hover:scale-105 ${
                isDark
                  ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-500 hover:to-blue-600"
                  : "bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-500 hover:to-blue-600"
              }`}
            >
              Report Now
              <ArrowRight
                size={20}
                className="group-hover:translate-x-1 transition"
              />
            </button>

            <button
              onClick={() => navigate("/history")}
              className={`flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 border-2 ${
                isDark
                  ? "border-slate-700 text-slate-300 hover:bg-slate-800/50"
                  : "border-slate-300 text-slate-700 hover:bg-slate-100/50"
              }`}
            >
              View History
              <ArrowRight size={20} />
            </button>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-6 mt-20">
            {[
              {
                icon: BrainCircuit,
                title: "NLP Analysis",
                description:
                  "Extracts category, priority, language and important entities.",
              },
              {
                icon: Building2,
                title: "Department Classification",
                description:
                  "Routes complaints to the most relevant government department.",
              },
              {
                icon: TriangleAlert,
                title: "Priority Detection",
                description:
                  "Detects urgency and classifies complaints into Critical, High or Medium priority.",
              },
              {
                icon: FileText,
                title: "Complaint Letter",
                description:
                  "Creates a formal complaint letter ready for submission.",
              },
              {
                icon: ScanSearch,
                title: "Image Intelligence",
                description:
                  "Analyzes uploaded evidence using Gemini Vision to detect visible civic issues.",
              },
              {
                icon: Lightbulb,
                title: "AI Recommendations",
                description:
                  "Provides resolution suggestions, citizen advisory and potential risks.",
              },
            ].map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div
                  key={idx}
                  className={`p-6 rounded-xl backdrop-blur-sm border transition-all duration-300 hover:scale-105 ${
                    isDark
                      ? "bg-slate-800/50 border-slate-700 hover:bg-slate-700/50 hover:border-blue-600"
                      : "bg-white/50 border-slate-200 hover:bg-white hover:border-blue-500 shadow-sm hover:shadow-md"
                  }`}
                >
                  <Icon className="text-blue-500 mb-4 mx-auto" size={28} />
                  <h3
                    className={`font-bold mb-2 ${isDark ? "text-white" : "text-slate-900"}`}
                  >
                    {feature.title}
                  </h3>
                  <p
                    className={`text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}
                  >
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
