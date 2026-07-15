import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import { AI_API } from "../services/api";
import { Upload, AlertCircle, FileImage, Sparkles } from "lucide-react";
import LoadingOverlay from "../components/LoadingOverlay";

function ComplaintForm() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFile = (file) => {
    setImage(file);
    if (file) {
      const preview = URL.createObjectURL(file);
      setImagePreview(preview);
    }
  };

  const handleAnalyze = async () => {
    if (!title || !description || !image) {
      alert("Please fill all fields.");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("file", image);

      const response = await AI_API.post("/analyze-complete", formData);

      sessionStorage.setItem("analysis", JSON.stringify(response.data));
      sessionStorage.setItem("uploadedImage", imagePreview);

      navigate("/results");
    } catch (error) {
      console.log(error);
      const message = error.response?.data?.detail || "Something went wrong. Please try again.";
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full relative overflow-hidden">
      {loading && <LoadingOverlay />}
      <Navbar />
      
      <div className="max-w-[800px] mx-auto px-6 py-12 lg:py-20">
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center"
        >
          <div className="inline-flex items-center justify-center p-3 bg-purple-100 dark:bg-purple-900/30 rounded-2xl mb-6 text-purple-600 dark:text-purple-400">
            <Sparkles size={28} />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 font-heading tracking-tight text-slate-900 dark:text-white">
            Report a <span className="text-gradient-mesh">Civic Issue</span>
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 font-medium max-w-xl mx-auto">
            Provide details and evidence below. Our AI will analyze the issue and generate a comprehensive official report.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-slate-800 rounded-[32px] p-8 md:p-10 shadow-soft border-[3px] border-slate-100 dark:border dark:border-slate-700"
        >
          {/* Title Input */}
          <div className="mb-6">
            <label className="block mb-2 text-xs font-bold tracking-widest uppercase text-slate-500 dark:text-slate-400">
              Complaint Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Large pothole near XYZ Colony Gate"
              className="w-full p-4 rounded-2xl border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-medium"
            />
          </div>

          {/* Description Input */}
          <div className="mb-6">
            <label className="block mb-2 text-xs font-bold tracking-widest uppercase text-slate-500 dark:text-slate-400">
              Complaint Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="5"
              placeholder="Describe the issue in detail. Include exact location, impact, and when you first noticed it..."
              className="w-full p-4 rounded-2xl border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-medium resize-none"
            />
          </div>

          {/* Image Upload */}
          <div className="mb-10">
            <label className="block mb-2 text-xs font-bold tracking-widest uppercase text-slate-500 dark:text-slate-400">
              Upload Evidence Image
            </label>

            {!imagePreview ? (
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-3xl p-10 text-center transition-all cursor-pointer ${
                  dragActive 
                    ? "border-purple-500 bg-purple-50 dark:bg-purple-900/10 scale-[1.02]" 
                    : "border-slate-300 dark:border-slate-600 hover:border-purple-400 hover:bg-purple-50/50 dark:hover:bg-purple-900/10"
                }`}
              >
                <input
                  type="file"
                  onChange={(e) => handleFile(e.target.files[0])}
                  accept="image/*"
                  className="hidden"
                  id="image-input"
                />
                <label htmlFor="image-input" className="cursor-pointer flex flex-col items-center justify-center w-full h-full">
                  <div className="w-16 h-16 rounded-full mb-4 bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-400 transition-transform hover:scale-110">
                    <Upload size={28} />
                  </div>
                  <p className="text-lg font-bold text-slate-900 dark:text-white mb-1">
                    Drag & drop your image here
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    or click to browse from your device
                  </p>
                  <p className="text-xs mt-4 font-medium text-slate-400">
                    Supports JPG, PNG, GIF (Max 10MB)
                  </p>
                </label>
              </div>
            ) : (
              <div className="relative rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-700 p-2 bg-slate-50 dark:bg-slate-900">
                <div className="relative rounded-2xl overflow-hidden group">
                  <img src={imagePreview} alt="Preview" className="w-full h-64 object-cover" />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                    <button 
                      onClick={() => { setImage(null); setImagePreview(""); }}
                      className="px-6 py-2 bg-white/20 hover:bg-white/30 text-white rounded-full backdrop-blur-md transition-colors font-medium"
                    >
                      Change Image
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 mt-1">
                  <FileImage size={20} className="text-purple-500" />
                  <span className="text-sm font-medium truncate text-slate-700 dark:text-slate-300">
                    {image.name}
                  </span>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="w-full btn-gradient py-4 text-lg flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? "Initializing AI..." : "Analyze with CivicLens AI"}
            {!loading && <Sparkles size={20} className="group-hover:rotate-12 transition-transform" />}
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8 p-6 rounded-3xl bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 flex gap-4 items-start"
        >
          <AlertCircle size={24} className="flex-shrink-0 mt-0.5 text-blue-500" />
          <p className="text-sm leading-relaxed font-medium text-blue-800 dark:text-blue-300">
            For best AI analysis, ensure the uploaded image is clear and well-lit. 
            Our system will automatically extract relevant entities, detect priority, and draft an official letter.
          </p>
        </motion.div>
      </div>
    </div>
  );
}

export default ComplaintForm;
