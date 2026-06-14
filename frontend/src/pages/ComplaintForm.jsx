import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import { AI_API } from "../services/api";
function ComplaintForm() {
  const navigate = useNavigate();

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
      console.log(error.response);
      console.log(error.response?.data);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-slate-950 text-white py-16">
        <div className="max-w-4xl mx-auto">
          <div className="mb-10">
            <h1 className="text-4xl font-bold">Report a Civic Issue</h1>
            <p className="text-slate-400 mt-2">
              Submit your complaint and let CivicLens AI analyze it.
            </p>
          </div>
          <div className="bg-slate-900 rounded-2xl p-8 shadow-xl border border-slate-800">
            {/* Title */}
            <div className="mb-6">
              <label className="block mb-2 font-medium">Complaint Title</label>

              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Large pothole near IIIT Sonepat Gate"
                className="w-full p-4 rounded-xl bg-slate-800 border border-slate-700 outline-none focus:border-blue-500"
              />
            </div>
            {/* Description */}
            <div className="mb-6">
              <label className="block mb-2 font-medium">
                Complaint Description
              </label>

              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows="6"
                placeholder="Describe the issue in detail..."
                className="w-full p-4 rounded-xl bg-slate-800 border border-slate-700 outline-none resize-none focus:border-blue-500"
              />
            </div>
            {/* Image */}
            <div className="mb-8">
              <label className="block mb-2 font-medium">Upload Image</label>
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
                className="block w-full text-slate-300"
              />
            </div>

            {/* Button */}
            <button
              onClick={handleAnalyze}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-500 transition rounded-xl py-4 text-lg font-semibold"
            >
              {loading ? "Analyzing..." : "Analyze Complaint"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default ComplaintForm;
