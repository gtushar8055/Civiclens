import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { useTheme } from "../context/ThemeContext";
import { BACKEND_API } from "../services/api";
import { Copy, Check } from "lucide-react";
import { useParams } from "react-router-dom";

function Results() {
  const { isDark } = useTheme();
  const { id } = useParams();

  const [analysis, setAnalysis] = useState(
    JSON.parse(sessionStorage.getItem("analysis")),
  );

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      const stored = JSON.parse(sessionStorage.getItem("analysis"));
      setAnalysis(stored);
      setComplaintSubject(stored.textAnalysis.draftComplaint.subject);
      setComplaintBody(stored.textAnalysis.draftComplaint.body);
      setLoading(false);
      return;
    }
    fetchComplaint();
  }, []);

  const fetchComplaint = async () => {
    try {
      const response = await BACKEND_API.get(`/api/complaints/${id}`);

      const data = response.data.analysis;

      setAnalysis(data);
      setComplaintSubject(data.textAnalysis.draftComplaint.subject);
      setComplaintBody(data.textAnalysis.draftComplaint.body);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const [editing, setEditing] = useState(false);
  const [complaintBody, setComplaintBody] = useState("");
  const [complaintSubject, setComplaintSubject] = useState("");

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        Loading...
      </div>
    );
  }

  const text = analysis.textAnalysis;
  const image = analysis.imageAnalysis;
  const uploadedImage = !id ? sessionStorage.getItem("uploadedImage") : null;

  const saveComplaint = async () => {
    console.log("SAVE BUTTON CLICKED");
    try {
      const payload = {
        title: complaintSubject,
        description: complaintBody,
        imageUrl: uploadedImage,
        category: text.category,
        priority: text.priority,
        department: text.recommendedDepartment.department,
        complaintLetter: complaintBody,
        analysis: analysis,
      };

      const token = localStorage.getItem("token");

      const response = await BACKEND_API.post("/api/complaints", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert(response.data.message);
    } catch (error) {
      console.log(error);

      alert("Unable to save complaint.");
    }
  };

  return (
    <>
      <Navbar />

      <div
        className={`min-h-screen py-12 transition-colors ${
          isDark
            ? "bg-gradient-to-br from-slate-950 to-slate-900 text-white"
            : "bg-gradient-to-br from-white to-slate-50 text-slate-900"
        }`}
      >
        <div className="max-w-6xl mx-auto px-6">
          <h1
            className={`text-5xl font-bold mb-10 ${
              isDark
                ? "bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent"
                : "bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent"
            }`}
          >
            AI Analysis Result
          </h1>

          {/* Top Cards */}

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div
              className={`p-6 rounded-2xl border backdrop-blur-sm transition-all ${
                isDark
                  ? "bg-slate-800/50 border-slate-700 hover:bg-slate-700/50"
                  : "bg-white/70 border-slate-200 hover:bg-white"
              }`}
            >
              <p className={`${isDark ? "text-slate-400" : "text-slate-600"}`}>
                Language Detected
              </p>
              <h2
                className={`text-2xl font-bold mt-2 ${isDark ? "text-white" : "text-slate-900"}`}
              >
                {text.detectedLanguage}
              </h2>
            </div>

            <div
              className={`p-6 rounded-2xl border backdrop-blur-sm transition-all ${
                isDark
                  ? "bg-slate-800/50 border-slate-700 hover:bg-slate-700/50"
                  : "bg-white/70 border-slate-200 hover:bg-white"
              }`}
            >
              <p className={`${isDark ? "text-slate-400" : "text-slate-600"}`}>
                Category
              </p>
              <h2
                className={`text-2xl font-bold mt-2 ${isDark ? "text-white" : "text-slate-900"}`}
              >
                {text.category}
              </h2>
            </div>

            <div
              className={`p-6 rounded-2xl border backdrop-blur-sm transition-all ${
                isDark
                  ? "bg-slate-800/50 border-slate-700 hover:bg-slate-700/50"
                  : "bg-white/70 border-slate-200 hover:bg-white"
              }`}
            >
              <p className={`${isDark ? "text-slate-400" : "text-slate-600"}`}>
                Priority
              </p>

              <h2
                className={`text-2xl font-bold mt-2 ${isDark ? "text-red-400" : "text-red-600"}`}
              >
                {text.priority}
              </h2>
            </div>

            <div
              className={`p-6 rounded-2xl border backdrop-blur-sm transition-all ${
                isDark
                  ? "bg-slate-800/50 border-slate-700 hover:bg-slate-700/50"
                  : "bg-white/70 border-slate-200 hover:bg-white"
              }`}
            >
              <p className={`${isDark ? "text-slate-400" : "text-slate-600"}`}>
                Concerned Department
              </p>

              <h2
                className={`text-lg font-semibold mt-2 ${isDark ? "text-white" : "text-slate-900"}`}
              >
                {text.recommendedDepartment.department}
              </h2>
            </div>
          </div>

          {/* Summary */}

          <div
            className={`mt-8 p-8 rounded-2xl border backdrop-blur-sm transition-all ${
              isDark
                ? "bg-slate-800/50 border-slate-700"
                : "bg-white/70 border-slate-200"
            }`}
          >
            <h2
              className={`text-2xl font-bold mb-4 ${isDark ? "text-white" : "text-slate-900"}`}
            >
              What's the matter actually ?
            </h2>

            <p
              className={`leading-8 ${isDark ? "text-slate-300" : "text-slate-700"}`}
            >
              {text.summary}
            </p>
          </div>

          {/* Suggested Resolution */}

          <div
            className={`p-8 rounded-2xl mt-8 border backdrop-blur-sm transition-all ${
              isDark
                ? "bg-slate-800/50 border-slate-700"
                : "bg-white/70 border-slate-200"
            }`}
          >
            <h2
              className={`text-2xl font-bold mb-6 ${isDark ? "text-white" : "text-slate-900"}`}
            >
              Suggested Resolution
            </h2>

            <ul className="space-y-3">
              {text.suggestedResolution.map((item, index) => (
                <li
                  key={index}
                  className={`p-4 rounded-xl border transition-all ${
                    isDark
                      ? "bg-slate-700/50 border-slate-600 hover:bg-slate-700/70"
                      : "bg-slate-100 border-slate-300 hover:bg-slate-200"
                  }`}
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div
            className={`p-8 rounded-2xl mt-8 border backdrop-blur-sm transition-all ${
              isDark
                ? "bg-slate-800/50 border-slate-700"
                : "bg-white/70 border-slate-200"
            }`}
          >
            <h2
              className={`text-2xl font-bold mb-4 ${isDark ? "text-white" : "text-slate-900"}`}
            >
              Estimated Resolution Time
            </h2>

            <p
              className={`text-3xl font-bold ${isDark ? "text-cyan-400" : "text-cyan-600"}`}
            >
              {text.estimatedResolutionTime}
            </p>
          </div>

          <div
            className={`p-8 rounded-2xl mt-8 border backdrop-blur-sm transition-all ${
              isDark
                ? "bg-slate-800/50 border-slate-700"
                : "bg-white/70 border-slate-200"
            }`}
          >
            <h2
              className={`text-2xl font-bold mb-6 ${isDark ? "text-white" : "text-slate-900"}`}
            >
              Citizen Advisory
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3
                  className={`${isDark ? "text-green-400" : "text-green-600"} font-bold mb-4 flex items-center gap-2`}
                >
                  ✅ Do's
                </h3>

                <ul className="space-y-3">
                  {text.citizenAdvisory.dos.map((item, index) => (
                    <li
                      key={index}
                      className={`${isDark ? "text-slate-300" : "text-slate-700"}`}
                    >
                      • {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3
                  className={`${isDark ? "text-red-400" : "text-red-600"} font-bold mb-4 flex items-center gap-2`}
                >
                  ❌ Don'ts
                </h3>

                <ul className="space-y-3">
                  {text.citizenAdvisory.donts.map((item, index) => (
                    <li
                      key={index}
                      className={`${isDark ? "text-slate-300" : "text-slate-700"}`}
                    >
                      • {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div
            className={`p-8 rounded-2xl mt-8 border backdrop-blur-sm transition-all ${
              isDark
                ? "bg-slate-800/50 border-slate-700"
                : "bg-white/70 border-slate-200"
            }`}
          >
            <h2
              className={`text-2xl font-bold mb-6 ${isDark ? "text-white" : "text-slate-900"}`}
            >
              Potential Risks
            </h2>

            <ul className="space-y-3">
              {text.potentialRisks.map((risk, index) => (
                <li
                  key={index}
                  className={`p-4 rounded-xl border-l-4 transition-all ${
                    isDark
                      ? "bg-red-900/20 border-l-red-600 border-r border-slate-700"
                      : "bg-red-50 border-l-red-600 border-r border-red-200"
                  }`}
                >
                  <span
                    className={`${isDark ? "text-red-300" : "text-red-900"}`}
                  >
                    ⚠️ {risk}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Entities */}

          <div
            className={`mt-8 p-8 rounded-2xl border backdrop-blur-sm transition-all ${
              isDark
                ? "bg-slate-800/50 border-slate-700"
                : "bg-white/70 border-slate-200"
            }`}
          >
            <h2
              className={`text-2xl font-bold mb-4 ${isDark ? "text-white" : "text-slate-900"}`}
            >
              Extracted Entities
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr
                    className={`border-b ${isDark ? "border-slate-700" : "border-slate-300"}`}
                  >
                    <th
                      className={`text-left py-3 font-semibold ${isDark ? "text-white" : "text-slate-900"}`}
                    >
                      Type
                    </th>
                    <th
                      className={`text-left py-3 font-semibold ${isDark ? "text-white" : "text-slate-900"}`}
                    >
                      Entity
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {text.entities.map((item, index) => (
                    <tr
                      key={index}
                      className={`border-b transition-colors hover:bg-opacity-50 ${
                        isDark
                          ? "border-slate-800 hover:bg-slate-700/30"
                          : "border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      <td
                        className={`py-4 ${isDark ? "text-slate-300" : "text-slate-700"}`}
                      >
                        {item.type}
                      </td>
                      <td className="py-4">
                        <span
                          className={`px-3 py-2 rounded-lg font-medium ${
                            isDark
                              ? "bg-blue-600 text-white"
                              : "bg-blue-100 text-blue-900"
                          }`}
                        >
                          {item.entity}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {!id && (
            <div
              className={`mt-8 p-8 rounded-2xl border backdrop-blur-sm transition-all ${
                isDark
                  ? "bg-slate-800/50 border-slate-700"
                  : "bg-white/70 border-slate-200"
              }`}
            >
              <h2
                className={`text-2xl font-bold mb-6 ${isDark ? "text-white" : "text-slate-900"}`}
              >
                Uploaded Image
              </h2>
              {uploadedImage ? (
                <img
                  src={uploadedImage}
                  alt="Uploaded Complaint"
                  className={`rounded-xl w-full max-h-[500px] object-cover border-2 ${
                    isDark ? "border-slate-700" : "border-slate-300"
                  }`}
                />
              ) : (
                <div
                  className={`p-10 rounded-xl text-center ${
                    isDark
                      ? "bg-slate-800 text-slate-400"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  📷 Image preview is available only for the current session.
                </div>
              )}
            </div>
          )}

          {/* Vision Analysis */}

          {image ? (
            <div
              className={`mt-8 p-8 rounded-2xl border backdrop-blur-sm transition-all ${
                isDark
                  ? "bg-slate-800/50 border-slate-700"
                  : "bg-white/70 border-slate-200"
              }`}
            >
              <h2
                className={`text-2xl font-bold mb-6 ${
                  isDark ? "text-white" : "text-slate-900"
                }`}
              >
                Analysis from the Image
              </h2>

              <div className="space-y-5">
                <div>
                  <h3
                    className={`text-lg font-semibold mb-2 ${
                      isDark ? "text-white" : "text-slate-900"
                    }`}
                  >
                    AI Image Summary
                  </h3>

                  <p
                    className={`${isDark ? "text-slate-300" : "text-slate-700"}`}
                  >
                    {image.imageSummary}
                  </p>
                </div>

                <div>
                  <h3
                    className={`text-lg font-semibold mb-2 ${
                      isDark ? "text-white" : "text-slate-900"
                    }`}
                  >
                    Detected Issues
                  </h3>

                  <ul className="space-y-3">
                    {image.detectedIssues.map((issue, index) => (
                      <li
                        key={index}
                        className={`rounded-xl p-4 border ${
                          isDark
                            ? "bg-slate-700/50 border-slate-600"
                            : "bg-slate-100 border-slate-300"
                        }`}
                      >
                        <div
                          className={`font-semibold ${
                            isDark ? "text-white" : "text-slate-900"
                          }`}
                        >
                          {issue.type || issue.description}
                        </div>

                        <div
                          className={`text-sm mt-1 ${
                            isDark ? "text-slate-400" : "text-slate-600"
                          }`}
                        >
                          Severity : {issue.severity}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3
                    className={`text-lg font-semibold mb-2 ${
                      isDark ? "text-white" : "text-slate-900"
                    }`}
                  >
                    Visual Evidence
                  </h3>

                  <p
                    className={`${isDark ? "text-slate-300" : "text-slate-700"}`}
                  >
                    {image.visualEvidence}
                  </p>
                </div>

                <div>
                  <h3
                    className={`text-lg font-semibold mb-2 ${
                      isDark ? "text-white" : "text-slate-900"
                    }`}
                  >
                    AI Confidence
                  </h3>

                  <div
                    className={`w-full rounded-full h-4 border ${
                      isDark
                        ? "bg-slate-700 border-slate-600"
                        : "bg-slate-300 border-slate-400"
                    }`}
                  >
                    <div
                      className="bg-gradient-to-r from-green-400 to-green-500 h-4 rounded-full"
                      style={{
                        width: `${image.confidenceScore * 100}%`,
                      }}
                    />
                  </div>

                  <p
                    className={`mt-2 font-semibold ${
                      isDark ? "text-green-400" : "text-green-600"
                    }`}
                  >
                    {(image.confidenceScore * 100).toFixed(0)}% Confidence
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div
              className={`mt-8 p-8 rounded-2xl border ${
                isDark
                  ? "bg-slate-800/50 border-slate-700"
                  : "bg-white/70 border-slate-200"
              }`}
            >
              <h2
                className={`text-2xl font-bold mb-4 ${
                  isDark ? "text-white" : "text-slate-900"
                }`}
              >
                Visual Evidence
              </h2>

              <p
                className={`${isDark ? "text-slate-300" : "text-slate-700"} leading-8`}
              >
                ⚠️ Visual evidence analysis is temporarily unavailable due to
                high AI server load.
                <br />
                <br />
                The complaint has been successfully analyzed using advanced
                Natural Language Processing (NLP), including language detection,
                priority assessment, department recommendation, entity
                extraction, risk identification, citizen advisory, and formal
                complaint generation.
              </p>
            </div>
          )}

          {/* Complaint */}

          <div
            className={`mt-8 p-8 rounded-2xl border backdrop-blur-sm transition-all ${
              isDark
                ? "bg-slate-800/50 border-slate-700"
                : "bg-white/70 border-slate-200"
            }`}
          >
            <h2
              className={`text-2xl font-bold mb-5 ${isDark ? "text-white" : "text-slate-900"}`}
            >
              Generated Formal Complaint
            </h2>

            {editing ? (
              <input
                value={complaintSubject}
                onChange={(e) => setComplaintSubject(e.target.value)}
                className={`w-full p-3 rounded-xl mb-4 outline-none border-2 focus:border-blue-500 ${
                  isDark
                    ? "bg-slate-700 border-slate-600 text-white"
                    : "bg-white border-slate-300 text-slate-900"
                }`}
              />
            ) : (
              <h3
                className={`text-xl font-semibold mb-3 ${isDark ? "text-white" : "text-slate-900"}`}
              >
                {complaintSubject}
              </h3>
            )}

            {editing ? (
              <textarea
                rows={18}
                value={complaintBody}
                onChange={(e) => setComplaintBody(e.target.value)}
                className={`w-full p-5 rounded-xl outline-none border-2 focus:border-blue-500 resize-none ${
                  isDark
                    ? "bg-slate-700 border-slate-600 text-white"
                    : "bg-white border-slate-300 text-slate-900"
                }`}
              />
            ) : (
              <p
                className={`whitespace-pre-line leading-8 ${isDark ? "text-slate-300" : "text-slate-700"}`}
              >
                {complaintBody}
              </p>
            )}
          </div>

          <div className="flex flex-col md:flex-row gap-4 mt-8">
            <button
              onClick={() => setEditing(!editing)}
              className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all hover:scale-105 ${
                isDark
                  ? "bg-amber-600 hover:bg-amber-500 text-white"
                  : "bg-amber-500 hover:bg-amber-600 text-white"
              }`}
            >
              {editing ? "✓ Done Editing" : "✎ Edit Complaint"}
            </button>
            <button
              onClick={() => {
                navigator.clipboard.writeText(
                  complaintSubject + "\n\n" + complaintBody,
                );
                alert("Complaint Copied!");
              }}
              className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all hover:scale-105 ${
                isDark
                  ? "bg-green-600 hover:bg-green-500 text-white"
                  : "bg-green-500 hover:bg-green-600 text-white"
              }`}
            >
              <Copy size={18} />
              Copy Complaint
            </button>
          </div>

          {/* Button */}

          <button
            onClick={saveComplaint}
            className={`mt-10 w-full rounded-xl py-4 text-xl font-semibold transition-all hover:scale-105 shadow-lg hover:shadow-xl ${
              isDark
                ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-500 hover:to-blue-600"
                : "bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-500 hover:to-blue-600"
            }`}
          >
            Save Complaint
          </button>
        </div>
      </div>
    </>
  );
}

export default Results;
