import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import { BACKEND_API } from "../services/api";
import { Clock, MapPin, AlertTriangle, ArrowRight, Sparkles, FolderOpen } from "lucide-react";

const staggerContainer = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
};

function History() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await BACKEND_API.get("/api/complaints", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setComplaints(response.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchComplaints();
  }, []);

  return (
    <div className="w-full relative overflow-hidden">
      <Navbar />

      <div className="max-w-[1000px] mx-auto px-6 py-12 lg:py-20 min-h-[calc(100vh-120px)]">
        
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-2xl text-purple-600 dark:text-purple-400">
              <FolderOpen size={28} />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold font-heading text-slate-900 dark:text-white">
              My <span className="text-gradient-mesh">History</span>
            </h1>
          </div>
          <p className="text-lg font-medium ml-[60px] text-slate-600 dark:text-slate-400">
            Track and manage all your submitted civic reports.
          </p>
        </motion.div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : complaints.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-24 rounded-[32px] border-2 border-dashed border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50"
          >
            <div className="w-20 h-20 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-6 text-purple-600 dark:text-purple-400">
              <Sparkles size={32} />
            </div>
            <h3 className="text-2xl font-bold mb-3 font-heading text-slate-900 dark:text-white">No reports found</h3>
            <p className="text-lg mb-8 max-w-md mx-auto text-slate-500 dark:text-slate-400">
              You haven't submitted any civic issues yet. Be the change in your community!
            </p>
            <Link to="/report" className="btn-gradient px-8 py-3.5 text-lg inline-flex">
              Report an Issue
            </Link>
          </motion.div>
        ) : (
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            animate="show"
            className="grid gap-6"
          >
            {complaints.map((complaint) => (
              <motion.div
                variants={fadeUp}
                key={complaint._id}
                className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-soft border-[3px] border-slate-100 dark:border dark:border-slate-700 hover:-translate-y-1 hover:shadow-floating transition-all duration-300 group"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  
                  <div className="flex-1">
                    <div className="flex flex-wrap gap-3 mb-4">
                      <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                        {complaint.category}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                        complaint.priority?.toLowerCase().includes('high') || complaint.priority?.toLowerCase().includes('critical')
                          ? "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"
                          : complaint.priority?.toLowerCase().includes('medium')
                          ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                          : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                      }`}>
                        <AlertTriangle size={14} />
                        {complaint.priority} Priority
                      </span>
                    </div>
                    
                    <h2 className="text-2xl font-bold mb-6 font-heading text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                      {complaint.title}
                    </h2>

                    <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider mb-1 text-slate-400">
                          Department
                        </p>
                        <p className="font-medium text-slate-700 dark:text-slate-300">
                          {complaint.department}
                        </p>
                      </div>
                      <div className="w-px h-8 bg-slate-200 dark:bg-slate-700 hidden sm:block" />
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider mb-1 flex items-center gap-1.5 text-slate-400">
                          <Clock size={12} /> Submitted
                        </p>
                        <p className="font-medium text-slate-700 dark:text-slate-300">
                          {new Date(complaint.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                        </p>
                      </div>
                      <div className="w-px h-8 bg-slate-200 dark:bg-slate-700 hidden sm:block" />
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider mb-1 flex items-center gap-1.5 text-slate-400">
                          <MapPin size={12} /> Status
                        </p>
                        <p className="font-medium text-green-500">Processed</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex-shrink-0 mt-4 md:mt-0">
                    <Link
                      to={`/results/${complaint._id}`}
                      className="btn-outline px-6 py-3 flex items-center gap-2 group-hover:bg-slate-50 dark:group-hover:bg-slate-700"
                    >
                      View Analysis
                      <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>

                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default History;
