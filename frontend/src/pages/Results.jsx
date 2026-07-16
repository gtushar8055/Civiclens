import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../components/Navbar";
import { BACKEND_API } from "../services/api";

import { getPortalUrl } from "../services/portalDirectory";
import { Copy, Check, Languages, AlertTriangle, Building2, MapPin, Eye, CheckCircle2, ShieldAlert, FileText, ScanSearch, Lightbulb, TrendingUp, Tags, ExternalLink, ListChecks, FileDown, Info, Save } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

function Results() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [complaintBody, setComplaintBody] = useState("");
  const [complaintSubject, setComplaintSubject] = useState("");
  const [copied, setCopied] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);


  useEffect(() => {
    const fetchComplaint = async () => {
      try {
        const response = await BACKEND_API.get(`/api/complaints/${id}`);
        const data = response.data.analysis;
        setAnalysis(data);
        setComplaintSubject(data.textAnalysis?.draftComplaint?.subject || "");
        setComplaintBody(data.textAnalysis?.draftComplaint?.body || "");
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    if (!id) {
      const stored = JSON.parse(sessionStorage.getItem("analysis"));
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setAnalysis(stored);
      if (stored?.textAnalysis?.draftComplaint) {
        setComplaintSubject(stored.textAnalysis.draftComplaint.subject);
        setComplaintBody(stored.textAnalysis.draftComplaint.body);
      }
      setLoading(false);
      return;
    }
    fetchComplaint();
  }, [id]);

  if (loading) {
    return (
      <div className="w-full relative overflow-hidden min-h-screen">
        <Navbar />
        <div className="flex justify-center items-center h-[60vh]">
          <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
        </div>
      </div>
    );
  }

  if (!analysis || !analysis.textAnalysis) {
    return (
      <div className="w-full relative overflow-hidden min-h-screen">
        <Navbar />
        <div className="flex justify-center items-center h-[60vh]">
          <h2 className="text-xl font-bold">No analysis data found.</h2>
        </div>
      </div>
    );
  }

  const text = analysis.textAnalysis;
  const image = analysis.imageAnalysis;
  const uploadedImage = !id ? sessionStorage.getItem("uploadedImage") : null;

  const saveComplaint = async () => {
    try {
      setIsSaving(true);
      const payload = {
        title: complaintSubject,
        description: complaintBody,
        imageUrl: uploadedImage,
        category: text.category,
        priority: text.priority,
        department: text.recommendedDepartment.department,
        complaintLetter: complaintBody,
        submissionAssistant: text.submissionAssistant || {},
        analysis: analysis,
      };

      const token = localStorage.getItem("token");
      const response = await BACKEND_API.post("/api/complaints", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setIsSuccessModalOpen(true);
    } catch (error) {
      console.log(error);
      alert("Unable to save complaint.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(complaintSubject + "\n\n" + complaintBody);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };



  return (
    <div className="w-full relative overflow-hidden">
      <Navbar />

      <div className="max-w-[1200px] mx-auto px-6 py-12">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="show"
        >
          <motion.div variants={fadeUp} className="mb-12 flex flex-col items-center text-center">
            <h1 className="text-4xl md:text-5xl font-bold font-heading mb-4 tracking-tight">
              Civic Intelligence <span className="text-gradient-mesh">Report</span>
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 font-medium">
              Official analysis and complaint preparation for civic grievance submission.
            </p>
          </motion.div>

          {/* Top Stat Cards */}
          <motion.div variants={fadeUp} className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: "Language", value: text.detectedLanguage, icon: Languages },
              { label: "Category", value: text.category, icon: MapPin },
              { label: "Priority", value: text.priority, icon: AlertTriangle, color: text.priority?.toLowerCase().includes('high') || text.priority?.toLowerCase().includes('critical') ? 'text-orange-500' : 'text-purple-500' },
              { label: "Department", value: text.recommendedDepartment?.department || 'Unknown', icon: Building2 }
            ].map((stat, idx) => (
              <div key={idx} className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-soft border-[3px] border-slate-100 dark:border dark:border-slate-700 hover:-translate-y-1 transition-transform">
                <div className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-900 flex items-center justify-center mb-4">
                  <stat.icon size={20} className="text-slate-600 dark:text-slate-400" />
                </div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">{stat.label}</p>
                <h2 className={`text-xl font-bold font-heading ${stat.color ? stat.color : 'text-slate-900 dark:text-white'}`}>
                  {stat.value}
                </h2>
              </div>
            ))}
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content Column */}
            <div className="lg:col-span-2 space-y-8">

              {/* Summary */}
              <motion.div variants={fadeUp} className="bg-white dark:bg-slate-800 rounded-[32px] p-8 shadow-soft border-[3px] border-slate-100 dark:border dark:border-slate-700">
                <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                  <h2 className="text-2xl font-bold font-heading flex items-center gap-3">
                    <Eye className="text-purple-500" /> Executive Summary
                  </h2>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider bg-slate-50 dark:bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-100 dark:border-slate-800">
                    Generated on {analysis.createdAt ? new Date(analysis.createdAt).toLocaleDateString() : new Date().toLocaleDateString()}
                  </p>
                </div>
                <p className="leading-relaxed text-lg text-slate-700 dark:text-slate-300 font-medium">
                  {text.summary}
                </p>
              </motion.div>

              {/* Generated Formal Complaint */}
              <motion.div variants={fadeUp} className="bg-white dark:bg-slate-800 rounded-[32px] p-8 shadow-floating border border-purple-100 dark:border-purple-900 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-purple-500 to-orange-400" />
                <h2 className="text-2xl font-bold mb-6 font-heading flex items-center gap-3">
                  <FileText className="text-purple-500" /> Generated Official Letter
                </h2>

                <div className="space-y-6">
                  {editing ? (
                    <input
                      value={complaintSubject}
                      onChange={(e) => setComplaintSubject(e.target.value)}
                      className="w-full p-4 rounded-2xl outline-none border border-slate-200 dark:border-slate-700 focus:border-purple-500 bg-slate-50 dark:bg-slate-900 font-semibold"
                    />
                  ) : (
                    <h3 className="text-xl font-bold border-b border-slate-100 dark:border-slate-700 pb-4">
                      Subject: {complaintSubject}
                    </h3>
                  )}

                  {editing ? (
                    <textarea
                      rows={12}
                      value={complaintBody}
                      onChange={(e) => setComplaintBody(e.target.value)}
                      className="w-full p-6 rounded-2xl outline-none border border-slate-200 dark:border-slate-700 focus:border-purple-500 bg-slate-50 dark:bg-slate-900 resize-y"
                    />
                  ) : (
                    <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800">
                      <p className="whitespace-pre-line leading-relaxed text-slate-700 dark:text-slate-300">
                        {complaintBody}
                      </p>
                    </div>
                  )}
                </div>

                <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
                  <div className="mb-4 flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-700">
                    <Info size={14} className="text-blue-500 flex-shrink-0" />
                    <p>Please review and edit the generated complaint before copying or submitting it to any official authority.</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-4">
                    <button
                      onClick={() => setEditing(!editing)}
                      className="btn-outline px-6 py-2.5 flex items-center gap-2"
                    >
                      {editing ? "✓ Save Edits" : "✎ Edit Letter"}
                    </button>
                    <button
                      onClick={handleCopy}
                      className={`px-6 py-2.5 rounded-full font-medium transition-all flex items-center gap-2 ${copied
                        ? "bg-green-100 text-green-700 border border-green-200"
                        : "btn-outline"
                        }`}
                    >
                      {copied ? <Check size={18} /> : <Copy size={18} />}
                      {copied ? "Copied!" : "Copy Text"}
                    </button>

                  </div>
                </div>
              </motion.div>

              {/* AI Submission Assistant */}
              {text.submissionAssistant && text.submissionAssistant.status && (
                <motion.div variants={fadeUp} className="bg-white dark:bg-slate-800 rounded-[32px] p-8 shadow-soft border-[3px] border-slate-100 dark:border dark:border-slate-700">
                  <h2 className="text-2xl font-bold mb-6 font-heading flex items-center gap-3">
                    <ListChecks className="text-purple-500" /> AI Submission Assistant
                  </h2>

                  {/* Status & Score */}
                  <div className="flex flex-wrap items-center justify-between mb-8 p-6 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-4">
                      <div className={`w-3.5 h-3.5 rounded-full ${text.submissionAssistant.readinessScore === 100 ? 'bg-green-500 shadow-[0_0_12px_rgba(34,197,94,0.6)]' : 'bg-orange-500 shadow-[0_0_12px_rgba(249,115,22,0.6)]'}`}></div>
                      <p className={`text-2xl font-bold font-heading ${text.submissionAssistant.readinessScore === 100 ? 'text-green-600 dark:text-green-400' : 'text-orange-600 dark:text-orange-400'}`}>
                        {text.submissionAssistant.status}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 bg-white dark:bg-slate-800 px-5 py-2.5 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                      <p className="text-xs uppercase font-bold text-slate-500">Score</p>
                      <p className="text-xl font-bold text-purple-600 dark:text-purple-400">{text.submissionAssistant.readinessScore}%</p>
                    </div>
                  </div>

                  {/* Missing Requirements */}
                  {text.submissionAssistant.missingRequirements && text.submissionAssistant.missingRequirements.length > 0 && (
                    <div className="mb-8">
                      <h3 className="text-sm font-bold text-orange-500 mb-3 flex items-center gap-2 uppercase tracking-wide">
                        <AlertTriangle size={16} /> Missing Requirements
                      </h3>
                      <ul className="space-y-2">
                        {text.submissionAssistant.missingRequirements.map((req, idx) => (
                          <li key={idx} className="flex items-center gap-2 text-sm text-orange-700 dark:text-orange-300 bg-orange-50 dark:bg-orange-900/20 p-3 rounded-xl border border-orange-100 dark:border-orange-900/30">
                            <span className="w-1.5 h-1.5 rounded-full bg-orange-500" /> {req}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="grid md:grid-cols-2 gap-8 mb-8">
                    {/* Left Column */}
                    <div className="space-y-8">
                      <div className="bg-slate-50 dark:bg-slate-900/50 p-5 rounded-2xl border border-slate-100 dark:border-slate-800">
                        <h3 className="text-xs font-bold text-slate-400 mb-1 uppercase tracking-wide">Official Department</h3>
                        <p className="font-bold text-lg text-slate-800 dark:text-slate-200">{text.submissionAssistant.officialDepartment}</p>
                      </div>

                      <div className="bg-slate-50 dark:bg-slate-900/50 p-5 rounded-2xl border border-slate-100 dark:border-slate-800">
                        <h3 className="text-xs font-bold text-slate-400 mb-1 uppercase tracking-wide">Recommended Portal</h3>
                        <p className="font-bold text-lg text-purple-600 dark:text-purple-400 mb-2">{text.submissionAssistant.recommendedPortal?.name || "Official Government Portal"}</p>
                        {text.submissionAssistant.portalReason && (
                          <p className="text-sm text-slate-600 dark:text-slate-400 border-l-2 border-purple-300 dark:border-purple-700 pl-3">
                            {text.submissionAssistant.portalReason}
                          </p>
                        )}
                      </div>

                      <div>
                        <h3 className="text-sm font-bold text-slate-400 mb-3 uppercase tracking-wide">Required Documents</h3>
                        <ul className="space-y-2">
                          {text.submissionAssistant.requiredDocuments?.map((doc, idx) => (
                            <li key={idx} className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-start gap-2 bg-slate-50 dark:bg-slate-900/30 p-2.5 rounded-xl">
                              <CheckCircle2 size={18} className="text-green-500 flex-shrink-0 mt-0.5" /> <span>{doc}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-8">
                      <div>
                        <h3 className="text-sm font-bold text-slate-400 mb-3 uppercase tracking-wide">Submission Checklist</h3>
                        <ul className="space-y-2">
                          {text.submissionAssistant.submissionChecklist?.map((item, idx) => (
                            <li key={idx} className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-start gap-2 bg-purple-50/50 dark:bg-purple-900/10 p-2.5 rounded-xl border border-purple-100 dark:border-purple-900/30">
                              <Check size={18} className="text-purple-500 flex-shrink-0 mt-0.5" /> <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h3 className="text-sm font-bold text-slate-400 mb-3 uppercase tracking-wide">Submission Steps</h3>
                        <ol className="space-y-3">
                          {text.submissionAssistant.submissionSteps?.map((step, idx) => (
                            <li key={idx} className="text-sm text-slate-700 dark:text-slate-300 flex gap-3 p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-800">
                              <span className="font-bold text-purple-500 flex-shrink-0">{idx + 1}.</span> <span>{step}</span>
                            </li>
                          ))}
                        </ol>
                      </div>
                    </div>
                  </div>

                  {/* Footer Actions */}
                  <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col md:flex-row gap-6 justify-between items-start md:items-center bg-slate-50 dark:bg-slate-900/30 p-6 rounded-2xl">
                    <div className="space-y-3 flex-1">
                      {text.submissionAssistant.expectedOutcome && (
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          <strong className="text-slate-800 dark:text-slate-200">Expected Outcome:</strong> {text.submissionAssistant.expectedOutcome}
                        </p>
                      )}
                      {text.submissionAssistant.nextAction && (
                        <p className="text-sm text-purple-600 dark:text-purple-400 font-medium bg-purple-50 dark:bg-purple-900/20 inline-block px-3 py-1.5 rounded-lg border border-purple-100 dark:border-purple-900/30">
                          <strong className="text-purple-700 dark:text-purple-300">Next Action:</strong> {text.submissionAssistant.nextAction}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="mt-6 text-center">
                    <p className="text-xs text-slate-400 dark:text-slate-500">
                      The submission guidance is AI-generated and intended to assist citizens.<br />
                      Users should verify department-specific requirements on the official government portal before submission.
                    </p>
                  </div>
                </motion.div>
              )}



            </div>

            {/* Side Content Column */}
            <div className="space-y-8">

              {/* Evidence & Visual Analysis */}
              {(!id && uploadedImage) || image ? (
                <motion.div variants={fadeUp} className="bg-white dark:bg-slate-800 rounded-[32px] p-6 shadow-soft border-[3px] border-slate-100 dark:border dark:border-slate-700">
                  <h2 className="text-xl font-bold mb-4 font-heading flex items-center gap-2">
                    <ScanSearch className="text-orange-500" /> Visual Evidence
                  </h2>

                  {!id && uploadedImage && (
                    <img src={uploadedImage} alt="Uploaded evidence" className="w-full h-48 object-cover rounded-2xl mb-6 shadow-sm" />
                  )}

                  {image && (
                    <div className="space-y-5">
                      <div>
                        <h3 className="text-xs uppercase font-bold text-slate-400 mb-2">AI Summary</h3>
                        <p className="text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-900 p-4 rounded-2xl">
                          {image.imageSummary || image.visualEvidence}
                        </p>
                      </div>

                      {image.detectedIssues && image.detectedIssues.length > 0 && (
                        <div>
                          <h3 className="text-xs uppercase font-bold text-slate-400 mb-2">Detected Issues</h3>
                          <div className="space-y-2">
                            {image.detectedIssues.map((issue, idx) => (
                              <div key={idx} className="p-3 bg-red-50 dark:bg-red-900/20 rounded-xl flex flex-col">
                                <span className="font-bold text-sm text-red-700 dark:text-red-300">{issue.type || issue.description}</span>
                                <span className="text-xs text-red-500/80 font-medium">Severity: {issue.severity}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              ) : null}

              {/* Estimated Time */}
              {text.estimatedResolutionTime && (
                <motion.div variants={fadeUp} className="bg-white dark:bg-slate-800 rounded-[32px] p-6 shadow-soft border-[3px] border-slate-100 dark:border dark:border-slate-700 flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase font-bold text-slate-400 mb-1">Est. Resolution Time</p>
                    <p className="text-2xl font-bold text-purple-600 dark:text-purple-400 font-heading">
                      {text.estimatedResolutionTime}
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-500">
                    <TrendingUp size={20} />
                  </div>
                </motion.div>
              )}

              {/* AI Recommended Actions */}
              {text.suggestedResolution && text.suggestedResolution.length > 0 && (
                <motion.div variants={fadeUp} className="bg-white dark:bg-slate-800 rounded-[32px] p-6 shadow-soft border-[3px] border-slate-100 dark:border dark:border-slate-700">
                  <h2 className="text-xl font-bold mb-4 font-heading flex items-center gap-2">
                    <Lightbulb className="text-orange-500" /> AI Recommended Actions
                  </h2>
                  <ul className="space-y-3">
                    {text.suggestedResolution.map((item, idx) => (
                      <li key={idx} className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-300">
                        {item}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}

              {/* Potential Risks */}
              {text.potentialRisks && text.potentialRisks.length > 0 && (
                <motion.div variants={fadeUp} className="bg-white dark:bg-slate-800 rounded-[32px] p-6 shadow-soft border border-red-100 dark:border-red-900/30">
                  <h2 className="text-xl font-bold mb-4 font-heading flex items-center gap-2 text-red-500">
                    <ShieldAlert /> Potential Risks
                  </h2>
                  <ul className="space-y-3">
                    {text.potentialRisks.map((risk, idx) => (
                      <li key={idx} className="flex gap-3 text-sm font-medium text-slate-700 dark:text-slate-300 bg-red-50/50 dark:bg-red-900/10 p-3 rounded-xl border border-red-100 dark:border-red-900/20">
                        <span className="text-red-500">⚠️</span> {risk}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}

              {/* Citizen Advisory */}
              {text.citizenAdvisory && (
                <motion.div variants={fadeUp} className="bg-white dark:bg-slate-800 rounded-[32px] p-6 shadow-soft border-[3px] border-slate-100 dark:border dark:border-slate-700">
                  <h2 className="text-xl font-bold mb-6 font-heading flex items-center gap-2">
                    <CheckCircle2 className="text-purple-500" /> Citizen Advisory
                  </h2>

                  <div className="space-y-6">
                    <div>
                      <h3 className="text-sm font-bold text-green-500 mb-3 flex items-center gap-2 uppercase tracking-wide">
                        Do's
                      </h3>
                      <ul className="space-y-2">
                        {text.citizenAdvisory.dos?.map((item, i) => (
                          <li key={i} className="text-sm bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300 p-3 rounded-xl font-medium border border-green-100 dark:border-green-900/30">
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-sm font-bold text-red-500 mb-3 flex items-center gap-2 uppercase tracking-wide">
                        Don'ts
                      </h3>
                      <ul className="space-y-2">
                        {text.citizenAdvisory.donts?.map((item, i) => (
                          <li key={i} className="text-sm bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300 p-3 rounded-xl font-medium border border-red-100 dark:border-red-900/30">
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

          </div>

          {/* Full Width Sections: Extracted Entities and Save Action */}
          <div className="mt-8 space-y-8">
            {/* Extracted Entities */}
            {text.entities && text.entities.length > 0 && (
              <motion.div variants={fadeUp} className="bg-white dark:bg-slate-800 rounded-[32px] p-8 shadow-soft border-[3px] border-slate-100 dark:border dark:border-slate-700">
                <h2 className="text-2xl font-bold mb-6 font-heading flex items-center gap-3">
                  <Tags className="text-purple-500" /> Extracted Entities
                </h2>
                <div className="overflow-hidden rounded-2xl border-[3px] border-slate-100 dark:border dark:border-slate-700">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-400">
                      <tr>
                        <th className="py-4 px-6 font-semibold text-sm uppercase tracking-wider">Type</th>
                        <th className="py-4 px-6 font-semibold text-sm uppercase tracking-wider">Entity Value</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                      {text.entities.map((item, index) => {
                        let colorClass = "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300";
                        const typeLower = item.type?.toLowerCase() || "";
                        if (typeLower.includes("infrastructure")) {
                          colorClass = "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300";
                        } else if (typeLower.includes("location")) {
                          colorClass = "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300";
                        } else if (typeLower.includes("time")) {
                          colorClass = "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300";
                        } else if (typeLower.includes("risk")) {
                          colorClass = "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300";
                        } else if (typeLower.includes("group") || typeLower.includes("affected")) {
                          colorClass = "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300";
                        }

                        return (
                          <tr key={index} className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                            <td className="py-4 px-6 text-sm font-medium text-slate-600 dark:text-slate-300">{item.type}</td>
                            <td className="py-4 px-6 font-bold text-slate-900 dark:text-white">
                              <span className={`px-3 py-1 rounded-lg ${colorClass}`}>
                                {item.entity || item.name}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {/* Final Save Action */}
            {!id && (
              <motion.div variants={fadeUp} className="flex justify-center pt-8 border-t border-slate-200 dark:border-slate-800">
                <button
                  onClick={saveComplaint}
                  disabled={isSaving}
                  className="btn-gradient px-12 py-4 text-lg font-bold flex items-center gap-3 disabled:opacity-50 shadow-xl shadow-purple-500/20 hover:shadow-purple-500/30 transition-all hover:-translate-y-1"
                >
                  {isSaving ? (
                    <div className="w-6 h-6 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  ) : (
                    <Save size={24} />
                  )}
                  {isSaving ? "Saving Report..." : "Save Complete Report"}
                </button>
              </motion.div>
            )}
          </div>

        </motion.div>
      </div>

      <AnimatePresence>
        {isSuccessModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-slate-800 rounded-3xl p-8 max-w-sm w-full shadow-2xl border border-slate-100 dark:border-slate-700 text-center"
            >
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 size={32} className="text-green-500" />
              </div>
              <h3 className="text-2xl font-bold font-heading mb-2 text-slate-900 dark:text-white">
                Report Saved Successfully
              </h3>
              <p className="text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
                Your civic intelligence report has been securely saved to your complaint history. You can access it anytime from the History section.
              </p>

              <div className="flex flex-col gap-3">
                <button
                  onClick={() => navigate("/history")}
                  className="w-full py-3 px-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-xl hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors"
                >
                  Go to History
                </button>
                <button
                  onClick={() => setIsSuccessModalOpen(false)}
                  className="w-full py-3 px-4 text-slate-600 dark:text-slate-400 font-bold hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-xl transition-colors"
                >
                  Continue Browsing
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Results;
