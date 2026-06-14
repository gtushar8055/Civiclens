import { useState } from "react";
import Navbar from "../components/Navbar";

function Results() {
  const analysis = JSON.parse(sessionStorage.getItem("analysis"));

  const text = analysis.textAnalysis;
  const image = analysis.imageAnalysis;
  const uploadedImage = sessionStorage.getItem("uploadedImage");

  const [editing, setEditing] = useState(false);

  const [complaintBody, setComplaintBody] = useState(text.draftComplaint.body);

  const [complaintSubject, setComplaintSubject] = useState(
    text.draftComplaint.subject,
  );

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-slate-950 text-white py-12">
        <div className="max-w-6xl mx-auto px-6">
          <h1 className="text-4xl font-bold mb-10">AI Analysis Result</h1>

          {/* Top Cards */}

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-slate-900 p-6 rounded-2xl">
              <p className="text-slate-400">Language</p>
              <h2 className="text-2xl font-bold mt-2">
                {text.detectedLanguage}
              </h2>
            </div>

            <div className="bg-slate-900 p-6 rounded-2xl">
              <p className="text-slate-400">Category</p>
              <h2 className="text-2xl font-bold mt-2">{text.category}</h2>
            </div>

            <div className="bg-slate-900 p-6 rounded-2xl">
              <p className="text-slate-400">Priority</p>

              <h2 className="text-2xl font-bold mt-2 text-red-400">
                {text.priority}
              </h2>
            </div>

            <div className="bg-slate-900 p-6 rounded-2xl">
              <p className="text-slate-400">Department</p>

              <h2 className="text-lg font-semibold mt-2">
                {text.recommendedDepartment.department}
              </h2>
            </div>
          </div>

          {/* Summary */}

          <div className="bg-slate-900 mt-8 p-8 rounded-2xl">
            <h2 className="text-2xl font-bold mb-4">Summary</h2>

            <p className="text-slate-300 leading-8">{text.summary}</p>
          </div>

          {/* Entities */}

          <div className="bg-slate-900 mt-8 p-8 rounded-2xl">
            <h2 className="text-2xl font-bold mb-4">Extracted Entities</h2>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="text-left py-3">Type</th>
                    <th className="text-left py-3">Entity</th>
                  </tr>
                </thead>

                <tbody>
                  {text.entities.map((item, index) => (
                    <tr key={index} className="border-b border-slate-800">
                      <td className="py-4 text-slate-300">{item.type}</td>
                      <td className="py-4">
                        <span className="bg-blue-600 px-3 py-2 rounded-lg">
                          {item.entity}
                        </span>
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-slate-900 mt-8 p-8 rounded-2xl">
            <h2 className="text-2xl font-bold mb-6">Uploaded Image</h2>

            <img
              src={uploadedImage}
              alt="Uploaded Complaint"
              className="rounded-xl w-full max-h-[500px] object-cover border border-slate-700"
            />
          </div>

       

          {/* Vision Analysis */}

          <div className="bg-slate-900 mt-8 p-8 rounded-2xl">
            <h2 className="text-2xl font-bold mb-6">Vision Analysis</h2>

            <div className="space-y-5">
              <div>
                <h3 className="text-lg font-semibold mb-2">AI Image Summary</h3>

                <p className="text-slate-300">{image.imageSummary}</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Detected Issues</h3>

                <ul className="space-y-3">
                  {image.detectedIssues.map((issue, index) => (
                    <li key={index} className="bg-slate-800 rounded-xl p-4">
                      <div className="font-semibold">
                        {issue.type || issue.description}
                      </div>

                      <div className="text-sm text-slate-400 mt-1">
                        Severity : {issue.severity}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Visual Evidence</h3>

                <p className="text-slate-300">{image.visualEvidence}</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">AI Confidence</h3>

                <div className="w-full bg-slate-700 rounded-full h-4">
                  <div
                    className="bg-green-500 h-4 rounded-full"
                    style={{
                      width: `${image.confidenceScore * 100}%`,
                    }}
                  />
                </div>

                <p className="mt-2 text-slate-400">
                  {(image.confidenceScore * 100).toFixed(0)}%
                </p>
              </div>
            </div>
          </div>

          {/* Complaint */}

          <div className="bg-slate-900 mt-8 p-8 rounded-2xl">
            <h2 className="text-2xl font-bold mb-5">Generated Complaint</h2>

            {editing ? (
              <input
                value={complaintSubject}
                onChange={(e) => setComplaintSubject(e.target.value)}
                className="w-full bg-slate-800 p-3 rounded-xl mb-4 outline-none"
              />
            ) : (
              <h3 className="text-xl font-semibold mb-3">{complaintSubject}</h3>
            )}

            {editing ? (
              <textarea
                rows={18}
                value={complaintBody}
                onChange={(e) => setComplaintBody(e.target.value)}
                className="w-full bg-slate-800 p-5 rounded-xl outline-none"
              ></textarea>
            ) : (
              <p className="whitespace-pre-line leading-8">{complaintBody}</p>
            )}
          </div>

          <div className="flex gap-4 mt-8">
            <button
              onClick={() => setEditing(!editing)}
              className="bg-yellow-500 hover:bg-yellow-400 px-6 py-3 rounded-xl"
            >
              {editing ? "Done Editing" : "Edit Complaint"}
            </button>
            <button
              onClick={() => {
                navigator.clipboard.writeText(
                  complaintSubject + "\n\n" + complaintBody,
                );
                alert("Complaint Copied");
              }}
              className="bg-green-600 hover:bg-green-500 px-6 py-3 rounded-xl"
            >
              Copy Complaint
            </button>
          </div>

          {/* Button */}

          <button className="mt-10 w-full bg-blue-600 hover:bg-blue-500 rounded-xl py-4 text-xl font-semibold">
            Save Complaint
          </button>
        </div>
      </div>
    </>
  );
}

export default Results;
