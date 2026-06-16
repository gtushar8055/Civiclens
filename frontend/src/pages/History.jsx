import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useTheme } from "../context/ThemeContext";
import { BACKEND_API } from "../services/api";
import { Clock, MapPin, AlertTriangle } from "lucide-react";

function History() {
  const [complaints, setComplaints] = useState([]);
  const { isDark } = useTheme();

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await BACKEND_API.get(
        "/api/complaints",

        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setComplaints(response.data);
    } catch (error) {
      console.log(error);
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
          {/* Header */}
          <div className="mb-10">
            <h1
              className={`text-5xl font-bold mb-3 ${
                isDark
                  ? "bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent"
                  : "bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent"
              }`}
            >
              My Complaints
            </h1>
            <p
              className={`text-lg ${isDark ? "text-slate-400" : "text-slate-600"}`}
            >
              Track and manage all your submitted civic complaints
            </p>
          </div>

          {/* Complaints Grid */}
          <div className="grid gap-6">
            {complaints.length === 0 ? (
              <div
                className={`text-center py-16 rounded-2xl border-2 border-dashed ${
                  isDark
                    ? "border-slate-700 bg-slate-800/30"
                    : "border-slate-300 bg-slate-100/30"
                }`}
              >
                <p
                  className={`text-lg ${isDark ? "text-slate-400" : "text-slate-600"}`}
                >
                  No complaints yet. Start reporting issues to help your
                  community!
                </p>
              </div>
            ) : (
              complaints.map((complaint) => (
                <div
                  key={complaint._id}
                  className={`rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border backdrop-blur-sm ${
                    isDark
                      ? "bg-slate-800/50 border-slate-700 hover:bg-slate-700/50"
                      : "bg-white/70 border-slate-200 hover:bg-white"
                  }`}
                >
                  {/* Title and Category */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h2
                        className={`text-2xl font-bold mb-2 ${isDark ? "text-white" : "text-slate-900"}`}
                      >
                        {complaint.title}
                      </h2>
                      <div className="flex flex-wrap gap-2">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            isDark
                              ? "bg-blue-900/50 text-blue-300 border border-blue-700"
                              : "bg-blue-100 text-blue-900 border border-blue-300"
                          }`}
                        >
                          {complaint.category}
                        </span>
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${
                            complaint.priority === "High"
                              ? isDark
                                ? "bg-red-900/50 text-red-300 border border-red-700"
                                : "bg-red-100 text-red-900 border border-red-300"
                              : complaint.priority === "Medium"
                                ? isDark
                                  ? "bg-yellow-900/50 text-yellow-300 border border-yellow-700"
                                  : "bg-yellow-100 text-yellow-900 border border-yellow-300"
                                : isDark
                                  ? "bg-green-900/50 text-green-300 border border-green-700"
                                  : "bg-green-100 text-green-900 border border-green-300"
                          }`}
                        >
                          <AlertTriangle size={16} />
                          {complaint.priority} Priority
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Details Grid */}
                  <div className="grid md:grid-cols-3 gap-4 mb-6">
                    <div>
                      <p
                        className={`text-sm font-medium ${isDark ? "text-slate-400" : "text-slate-600"}`}
                      >
                        Department
                      </p>
                      <p
                        className={`mt-1 font-semibold ${isDark ? "text-white" : "text-slate-900"}`}
                      >
                        {complaint.department}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Clock
                        size={16}
                        className={isDark ? "text-slate-400" : "text-slate-600"}
                      />
                      <div>
                        <p
                          className={`text-sm font-medium ${isDark ? "text-slate-400" : "text-slate-600"}`}
                        >
                          Submitted
                        </p>
                        <p
                          className={`text-sm ${isDark ? "text-slate-300" : "text-slate-700"}`}
                        >
                          {new Date(complaint.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <MapPin
                        size={16}
                        className={isDark ? "text-slate-400" : "text-slate-600"}
                      />
                      <div>
                        <p
                          className={`text-sm font-medium ${isDark ? "text-slate-400" : "text-slate-600"}`}
                        >
                          Status
                        </p>
                        <p className={`text-sm font-semibold text-green-400`}>
                          Processed
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* View Button */}
                  <Link
                    to={`/results/${complaint._id}`}
                    className={`inline-block px-6 py-3 rounded-xl font-semibold transition-all hover:scale-105 ${
                      isDark
                        ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-500 hover:to-blue-600"
                        : "bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-500 hover:to-blue-600"
                    }`}
                  >
                    View Full Analysis
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default History;
