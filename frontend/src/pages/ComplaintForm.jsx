import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import { useTheme } from "../context/ThemeContext";
import { AI_API } from "../services/api";
import { Upload, AlertCircle } from "lucide-react";
import LoadingOverlay from "../components/LoadingOverlay";

function ComplaintForm() {
  const navigate = useNavigate();
  const { isDark } = useTheme();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(false);

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

      console.log("Saved Successfully");
      navigate("/results");
      console.log("Navigation Done");
    } catch (error) {
      console.log(error);
      const message =
        error.response?.data?.detail ||
        "Something went wrong. Please try again.";
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    {loading && <LoadingOverlay />}
      <Navbar />
      <div
        className={`min-h-screen py-16 transition-colors ${
          isDark
            ? "bg-gradient-to-br from-slate-950 to-slate-900 text-white"
            : "bg-gradient-to-br from-white to-slate-50 text-slate-900"
        }`}
      >
        <div className="max-w-4xl mx-auto px-4">
          {/* Header */}
          <div className="mb-10">
            <h1
              className={`text-5xl font-bold mb-3 ${
                isDark
                  ? "bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent"
                  : "bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent"
              }`}
            >
              Report a Civic Issue
            </h1>
            <p
              className={`text-lg ${isDark ? "text-slate-400" : "text-slate-600"}`}
            >
              Submit your complaint and let CivicLens AI analyze it with
              precision.
            </p>
          </div>

          {/* Form Container */}
          <div
            className={`rounded-2xl p-8 shadow-xl border backdrop-blur-sm transition-all ${
              isDark
                ? "bg-slate-800/50 border-slate-700 hover:shadow-2xl"
                : "bg-white/70 border-slate-200 hover:shadow-2xl"
            }`}
          >
            {/* Title Input */}
            <div className="mb-8">
              <label
                className={`block mb-3 font-semibold text-lg ${isDark ? "text-white" : "text-slate-900"}`}
              >
                Complaint Title
              </label>

              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Large pothole near XYZ Colony Gate"
                className={`w-full p-4 rounded-xl border-2 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                  isDark
                    ? "bg-slate-700/50 border-slate-600 text-white placeholder-slate-500"
                    : "bg-white border-slate-300 text-slate-900 placeholder-slate-400"
                }`}
              />
            </div>

            {/* Description Input */}
            <div className="mb-8">
              <label
                className={`block mb-3 font-semibold text-lg ${isDark ? "text-white" : "text-slate-900"}`}
              >
                Complaint Description
              </label>

              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows="6"
                placeholder="Describe the issue in detail. Include location, impact, and any other relevant information..."
                className={`w-full p-4 rounded-xl border-2 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none ${
                  isDark
                    ? "bg-slate-700/50 border-slate-600 text-white placeholder-slate-500"
                    : "bg-white border-slate-300 text-slate-900 placeholder-slate-400"
                }`}
              />
            </div>

            {/* Image Upload */}
            <div className="mb-8">
              <label
                className={`block mb-3 font-semibold text-lg ${isDark ? "text-white" : "text-slate-900"}`}
              >
                Upload Evidence Image
              </label>

              <div
                className={`border-2 border-dashed rounded-xl p-8 text-center transition cursor-pointer ${
                  isDark
                    ? "border-slate-600 hover:border-blue-500 hover:bg-slate-700/30"
                    : "border-slate-300 hover:border-blue-500 hover:bg-blue-50"
                }`}
              >
                <input
                  type="file"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    setImage(file);
                    if (file) {
                      const preview = URL.createObjectURL(file);
                      setImagePreview(preview);
                    }
                  }}
                  accept="image/*"
                  className="hidden"
                  id="image-input"
                />
                <label htmlFor="image-input" className="cursor-pointer">
                  <Upload
                    className={`mx-auto mb-3 ${isDark ? "text-blue-400" : "text-blue-600"}`}
                    size={32}
                  />
                  <p
                    className={`font-semibold ${isDark ? "text-white" : "text-slate-900"}`}
                  >
                    Click to upload or drag and drop
                  </p>
                  <p
                    className={`text-sm mt-1 ${isDark ? "text-slate-400" : "text-slate-600"}`}
                  >
                    PNG, JPG, GIF up to 10MB
                  </p>
                </label>
              </div>

              {/* Image Preview */}
              {imagePreview && (
                <div className="mt-6">
                  <p
                    className={`mb-3 font-semibold ${isDark ? "text-white" : "text-slate-900"}`}
                  >
                    Preview:
                  </p>
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="max-h-48 mx-auto rounded-xl shadow-lg border-2 border-blue-500"
                  />
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              disabled = {loading}
              onClick={handleAnalyze}
              disabled={loading}
              className={`w-full py-4 px-6 rounded-xl text-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed ${
                isDark
                  ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-500 hover:to-blue-600"
                  : "bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-500 hover:to-blue-600"
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                  Analyzing... Please Wait
                </span>
              ) : (
                "Analyze Complaint"
              )}
            </button>
          </div>

          {/* Info Box */}
          <div
            className={`mt-8 p-4 rounded-xl border-l-4 border-blue-500 backdrop-blur-sm ${
              isDark
                ? "bg-blue-900/20 text-blue-300"
                : "bg-blue-50 text-blue-900"
            }`}
          >
            <div className="flex gap-3 items-start">
              <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
              <p className="text-sm">
                Ensure you provide clear, detailed information and supporting
                images for better AI analysis. All data is kept confidential.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ComplaintForm;
