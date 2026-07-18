import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import { AI_API } from "../services/api";
import { Upload, AlertCircle, FileImage, Sparkles, Mic, MicOff } from "lucide-react";
import LoadingOverlay from "../components/LoadingOverlay";

function ComplaintForm() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);


  const [isRecording, setIsRecording] = useState(false);
  const [activeRecordingField, setActiveRecordingField] = useState(null);
  const [speechSupported, setSpeechSupported] = useState(true);
  const [selectedLang, setSelectedLang] = useState('en-IN');
  const [speechError, setSpeechError] = useState('');
  const [voiceSuccess, setVoiceSuccess] = useState(false);
  
  const recognitionRef = useRef(null);

  useEffect(() => {
    if (!('SpeechRecognition' in window) && !('webkitSpeechRecognition' in window)) {
      setSpeechSupported(false);
    }
  }, []);

  const startRecording = (field) => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSpeechError("Browser not supported");
      return;
    }
    
    setActiveRecordingField(field);
    setSpeechError('');
    setVoiceSuccess(false);
    
    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    
    recognition.lang = selectedLang;
    recognition.continuous = false; // Changed to false: continuous=true can sometimes cause network errors on localhost
    recognition.interimResults = true;
    
    let currentTranscript = field === 'title' ? (title ? title + " " : "") : (description ? description + " " : "");
    let hasError = false;
    
    recognition.onstart = () => {
      setIsRecording(true);
    };
    
    recognition.onresult = (event) => {
      let interimTranscript = '';
      let newFinalTranscript = '';
      
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          newFinalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }
      
      const combined = currentTranscript + newFinalTranscript + interimTranscript;
      if (field === 'title') {
         setTitle(combined);
      } else {
         setDescription(combined);
      }

      if (newFinalTranscript) {
         currentTranscript += newFinalTranscript;
      }
    };
    
    recognition.onerror = (event) => {
      hasError = true;
      setIsRecording(false);
      if (event.error === 'not-allowed') {
         setSpeechError('Permission denied. Please allow microphone access.');
      } else if (event.error === 'no-speech') {
         setSpeechError('Silence. No speech detected.');
      } else if (event.error === 'network') {
         setSpeechError('Network error: If you are using Brave or Chromium, Speech API may be blocked. Please try Google Chrome or Edge.');
      } else {
         setSpeechError(`Recognition failed: ${event.error}`);
      }
    };
    
    recognition.onend = () => {
      setIsRecording(false);
      if (!hasError) {
         setVoiceSuccess(true);
      }
    };
    
    try {
      recognition.start();
    } catch (e) {
      console.error(e);
      setSpeechError("Failed to start recording.");
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }
  };

  const toggleRecording = (field) => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording(field);
    }
  };

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

          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <label className="block text-xs font-bold tracking-widest uppercase text-slate-500 dark:text-slate-400">
                Complaint Title
              </label>

              {speechSupported && (
                <div className="flex items-center gap-2">
                  <select
                    value={selectedLang}
                    onChange={(e) => setSelectedLang(e.target.value)}
                    disabled={isRecording}
                    className="text-xs px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 outline-none focus:ring-1 focus:ring-purple-500 cursor-pointer disabled:opacity-50"
                  >
                    <option value="en-IN">English</option>
                    <option value="hi-IN">Hindi</option>
                    <option value="mr-IN">Marathi</option>
                    <option value="gu-IN">Gujarati</option>
                    <option value="pa-IN">Punjabi</option>
                    <option value="bn-IN">Bengali</option>
                    <option value="ta-IN">Tamil</option>
                    <option value="te-IN">Telugu</option>
                    <option value="kn-IN">Kannada</option>
                    <option value="ml-IN">Malayalam</option>
                  </select>
                  
                  <button
                    onClick={() => toggleRecording('title')}
                    type="button"
                    className={`p-2 rounded-full flex items-center justify-center transition-all ${
                      isRecording && activeRecordingField === 'title'
                        ? "bg-red-500 text-white animate-pulse shadow-lg shadow-red-500/30" 
                        : "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 hover:bg-purple-200 dark:hover:bg-purple-900/50"
                    }`}
                    title={isRecording && activeRecordingField === 'title' ? "Stop Recording" : "Start Voice Recording"}
                  >
                    {isRecording && activeRecordingField === 'title' ? <MicOff size={16} /> : <Mic size={16} />}
                  </button>
                </div>
              )}
            </div>
            
            <input
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (activeRecordingField === 'title') {
                   setVoiceSuccess(false);
                   setSpeechError('');
                }
              }}
              placeholder="e.g. Large pothole near XYZ Colony Gate"
              className={`w-full p-4 rounded-2xl border outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-medium transition-colors ${
                isRecording && activeRecordingField === 'title'
                  ? "border-red-400 dark:border-red-500 ring-1 ring-red-400 shadow-[0_0_15px_rgba(248,113,113,0.15)]" 
                  : "border-slate-200 dark:border-slate-700"
              }`}
            />
            

            <div className={`mt-2 ${activeRecordingField === 'title' ? 'min-h-[24px]' : 'h-0 overflow-hidden'}`}>
              {isRecording && activeRecordingField === 'title' && (
                <p className="text-sm text-red-500 flex items-center gap-2 font-medium">
                  <span className="animate-pulse">🎤</span> Listening... 
                </p>
              )}
              {!isRecording && activeRecordingField === 'title' && speechError && (
                <p className="text-sm text-red-500 flex items-center gap-1.5 font-medium">
                  <AlertCircle size={14} /> {speechError}
                </p>
              )}
              {!isRecording && activeRecordingField === 'title' && !speechError && voiceSuccess && title && (
                <div className="flex items-center gap-3">
                  <p className="text-sm text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 font-medium">
                    ✅ Voice converted successfully.
                  </p>
                  {selectedLang !== 'en-IN' && (
                    <span className="text-xs bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded-full font-semibold">
                      Detected Language: {
                        {
                          'hi-IN': 'Hindi',
                          'mr-IN': 'Marathi',
                          'gu-IN': 'Gujarati',
                          'pa-IN': 'Punjabi',
                          'bn-IN': 'Bengali',
                          'ta-IN': 'Tamil',
                          'te-IN': 'Telugu',
                          'kn-IN': 'Kannada',
                          'ml-IN': 'Malayalam'
                        }[selectedLang]
                      }
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>


          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <label className="block text-xs font-bold tracking-widest uppercase text-slate-500 dark:text-slate-400">
                Complaint Description
              </label>
              
              {speechSupported && (
                <div className="flex items-center gap-2">
                  <select
                    value={selectedLang}
                    onChange={(e) => setSelectedLang(e.target.value)}
                    disabled={isRecording}
                    className="text-xs px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 outline-none focus:ring-1 focus:ring-purple-500 cursor-pointer disabled:opacity-50"
                  >
                    <option value="en-IN">English</option>
                    <option value="hi-IN">Hindi</option>
                    <option value="mr-IN">Marathi</option>
                    <option value="gu-IN">Gujarati</option>
                    <option value="pa-IN">Punjabi</option>
                    <option value="bn-IN">Bengali</option>
                    <option value="ta-IN">Tamil</option>
                    <option value="te-IN">Telugu</option>
                    <option value="kn-IN">Kannada</option>
                    <option value="ml-IN">Malayalam</option>
                  </select>
                  
                  <button
                    onClick={() => toggleRecording('description')}
                    type="button"
                    className={`p-2 rounded-full flex items-center justify-center transition-all ${
                      isRecording && activeRecordingField === 'description'
                        ? "bg-red-500 text-white animate-pulse shadow-lg shadow-red-500/30" 
                        : "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 hover:bg-purple-200 dark:hover:bg-purple-900/50"
                    }`}
                    title={isRecording && activeRecordingField === 'description' ? "Stop Recording" : "Start Voice Recording"}
                  >
                    {isRecording && activeRecordingField === 'description' ? <MicOff size={16} /> : <Mic size={16} />}
                  </button>
                </div>
              )}
            </div>

            <textarea
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                if (activeRecordingField === 'description') {
                   setVoiceSuccess(false);
                   setSpeechError('');
                }
              }}
              rows="5"
              placeholder="Describe the issue in detail. Include exact location, impact, and when you first noticed it..."
              className={`w-full p-4 rounded-2xl border outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-medium resize-none transition-colors ${
                isRecording && activeRecordingField === 'description'
                  ? "border-red-400 dark:border-red-500 ring-1 ring-red-400 shadow-[0_0_15px_rgba(248,113,113,0.15)]" 
                  : "border-slate-200 dark:border-slate-700"
              }`}
            />
            

            <div className={`mt-2 ${activeRecordingField === 'description' ? 'min-h-[24px]' : 'h-0 overflow-hidden'}`}>
              {isRecording && activeRecordingField === 'description' && (
                <p className="text-sm text-red-500 flex items-center gap-2 font-medium">
                  <span className="animate-pulse">🎤</span> Listening... 
                </p>
              )}
              {!isRecording && activeRecordingField === 'description' && speechError && (
                <p className="text-sm text-red-500 flex items-center gap-1.5 font-medium">
                  <AlertCircle size={14} /> {speechError}
                </p>
              )}
              {!isRecording && activeRecordingField === 'description' && !speechError && voiceSuccess && description && (
                <div className="flex items-center gap-3">
                  <p className="text-sm text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 font-medium">
                    ✅ Voice converted successfully.
                  </p>
                  {selectedLang !== 'en-IN' && (
                    <span className="text-xs bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded-full font-semibold">
                      Detected Language: {
                        {
                          'hi-IN': 'Hindi',
                          'mr-IN': 'Marathi',
                          'gu-IN': 'Gujarati',
                          'pa-IN': 'Punjabi',
                          'bn-IN': 'Bengali',
                          'ta-IN': 'Tamil',
                          'te-IN': 'Telugu',
                          'kn-IN': 'Kannada',
                          'ml-IN': 'Malayalam'
                        }[selectedLang]
                      }
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>


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
