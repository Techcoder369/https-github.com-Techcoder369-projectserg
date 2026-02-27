import React, { useState, useEffect } from 'react';
import { 
  Camera, 
  MapPin, 
  AlertCircle, 
  Heart, 
  Shield, 
  MessageSquare, 
  LayoutDashboard, 
  PlusCircle,
  Search,
  Navigation,
  Info,
  ChevronRight,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Toaster, toast } from 'react-hot-toast';
import { analyzeRescueImage, getRescueGuidance } from './services/gemini';
import { ProblemStatement } from './components/ProblemStatement';

type View = 'landing' | 'report' | 'dashboard' | 'about';

interface Report {
  id: number;
  image_url: string;
  description: string;
  city: string;
  state: string;
  status: string;
  priority: string;
  ai_analysis: string;
  created_at: string;
}

export default function App() {
  const [view, setView] = useState<View>('landing');
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({ total: 0, pending: 0, resolved: 0, critical: 0 });

  // Form State
  const [image, setImage] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiResult, setAiResult] = useState<any>(null);
  const [guidance, setGuidance] = useState<string | null>(null);

  useEffect(() => {
    fetchReports();
    fetchStats();
  }, []);

  const fetchReports = async () => {
    try {
      const res = await fetch('/api/reports');
      const data = await res.json();
      setReports(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/stats');
      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!image) return;
    setIsAnalyzing(true);
    try {
      const result = await analyzeRescueImage(image);
      setAiResult(result);
      const advice = await getRescueGuidance(result.condition);
      setGuidance(advice);
      toast.success('AI Analysis Complete');
    } catch (err) {
      toast.error('AI Analysis Failed');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSubmitReport = async () => {
    if (!image || !description) return;
    setLoading(true);
    try {
      const res = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image_url: image,
          description,
          city: 'San Francisco', // Mocked or use geolocation
          state: 'CA',
          priority: aiResult?.severity?.toLowerCase() || 'medium',
          ai_analysis: JSON.stringify(aiResult),
          location_lat: 37.7749,
          location_lng: -122.4194
        })
      });
      if (res.ok) {
        toast.success('Report Submitted Successfully');
        setView('dashboard');
        fetchReports();
        fetchStats();
        // Reset form
        setImage(null);
        setDescription('');
        setAiResult(null);
        setGuidance(null);
      }
    } catch (err) {
      toast.error('Failed to submit report');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-slate-900 font-sans">
      <Toaster position="top-right" />
      
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView('landing')}>
              <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-200">
                <Heart size={24} fill="currentColor" />
              </div>
              <span className="font-bold text-xl tracking-tight text-slate-800">RescueAI</span>
            </div>
            
            <div className="hidden md:flex items-center gap-8">
              <button onClick={() => setView('landing')} className={`text-sm font-medium transition-colors ${view === 'landing' ? 'text-emerald-600' : 'text-slate-500 hover:text-slate-800'}`}>Home</button>
              <button onClick={() => setView('dashboard')} className={`text-sm font-medium transition-colors ${view === 'dashboard' ? 'text-emerald-600' : 'text-slate-500 hover:text-slate-800'}`}>Dashboard</button>
              <button onClick={() => setView('about')} className={`text-sm font-medium transition-colors ${view === 'about' ? 'text-emerald-600' : 'text-slate-500 hover:text-slate-800'}`}>About</button>
              <button 
                onClick={() => setView('report')}
                className="bg-emerald-600 text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-emerald-700 transition-all shadow-md hover:shadow-lg active:scale-95 flex items-center gap-2"
              >
                <PlusCircle size={18} />
                Report Rescue
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          {view === 'landing' && (
            <motion.div 
              key="landing"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-16"
            >
              {/* Hero Section */}
              <section className="relative py-20 overflow-hidden rounded-[2.5rem] bg-slate-900 text-white">
                <div className="absolute inset-0 opacity-20">
                  <img 
                    src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&q=80&w=2000" 
                    alt="Background" 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="relative z-10 max-w-3xl mx-auto text-center px-6">
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-emerald-400 text-sm font-medium mb-8"
                  >
                    <Shield size={16} />
                    AI-Powered Street Animal Welfare
                  </motion.div>
                  <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-tight">
                    Every Second <span className="text-emerald-400">Counts</span> in a Rescue.
                  </h1>
                  <p className="text-lg text-slate-300 mb-10 leading-relaxed">
                    Connecting citizens, NGOs, and AI to provide instant medical triage and coordinated rescue for street animals in distress.
                  </p>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <button 
                      onClick={() => setView('report')}
                      className="w-full sm:w-auto px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl font-bold text-lg transition-all shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-2"
                    >
                      Report Now <ChevronRight size={20} />
                    </button>
                    <button 
                      onClick={() => setView('about')}
                      className="w-full sm:w-auto px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white rounded-2xl font-bold text-lg transition-all"
                    >
                      Learn More
                    </button>
                  </div>
                </div>
              </section>

              {/* Stats Section */}
              <section className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { label: 'Total Rescues', value: stats.total, icon: Heart, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                  { label: 'Pending Help', value: stats.pending, icon: AlertCircle, color: 'text-amber-600', bg: 'bg-amber-50' },
                  { label: 'Critical Cases', value: stats.critical, icon: Navigation, color: 'text-rose-600', bg: 'bg-rose-50' },
                  { label: 'Resolved', value: stats.resolved, icon: Shield, color: 'text-blue-600', bg: 'bg-blue-50' },
                ].map((stat, i) => (
                  <motion.div 
                    key={i}
                    whileHover={{ y: -5 }}
                    className="p-6 bg-white rounded-3xl border border-slate-100 shadow-sm flex flex-col items-center text-center"
                  >
                    <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center mb-4`}>
                      <stat.icon size={24} />
                    </div>
                    <span className="text-3xl font-bold text-slate-800 mb-1">{stat.value}</span>
                    <span className="text-sm font-medium text-slate-500 uppercase tracking-wider">{stat.label}</span>
                  </motion.div>
                ))}
              </section>

              {/* Features Grid */}
              <section className="space-y-8">
                <div className="text-center max-w-2xl mx-auto">
                  <h2 className="text-3xl font-bold mb-4">How It Works</h2>
                  <p className="text-slate-500">Our platform uses advanced AI to streamline the rescue process from report to recovery.</p>
                </div>
                <div className="grid md:grid-cols-3 gap-8">
                  {[
                    { title: 'AI Triage', desc: 'Upload a photo and our AI instantly identifies the animal type and injury severity.', icon: Camera },
                    { title: 'Smart Routing', desc: 'Reports are automatically sent to the nearest verified NGO and volunteers.', icon: MapPin },
                    { title: 'First-Aid Guide', desc: 'Get instant instructions on how to stabilize the animal while help arrives.', icon: MessageSquare },
                  ].map((feat, i) => (
                    <div key={i} className="p-8 bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                      <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-emerald-600 mb-6">
                        <feat.icon size={28} />
                      </div>
                      <h3 className="text-xl font-bold mb-3">{feat.title}</h3>
                      <p className="text-slate-500 leading-relaxed">{feat.desc}</p>
                    </div>
                  ))}
                </div>
              </section>
            </motion.div>
          )}

          {view === 'report' && (
            <motion.div 
              key="report"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="max-w-2xl mx-auto"
            >
              <div className="bg-white rounded-[2rem] p-8 shadow-xl border border-slate-100">
                <div className="flex items-center gap-4 mb-8">
                  <button onClick={() => setView('landing')} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                    <ChevronRight className="rotate-180" size={24} />
                  </button>
                  <h2 className="text-2xl font-bold">Report Animal in Distress</h2>
                </div>

                <div className="space-y-6">
                  {/* Image Upload */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Animal Photo</label>
                    <div className="relative aspect-video rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 overflow-hidden group">
                      {image ? (
                        <>
                          <img src={image} className="w-full h-full object-cover" alt="Preview" />
                          <button 
                            onClick={() => setImage(null)}
                            className="absolute top-4 right-4 p-2 bg-white/80 backdrop-blur rounded-full shadow-lg hover:bg-white transition-colors"
                          >
                            <PlusCircle className="rotate-45 text-rose-500" size={20} />
                          </button>
                        </>
                      ) : (
                        <label className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-100 transition-colors">
                          <Camera size={40} className="text-slate-400 mb-2" />
                          <span className="text-sm font-medium text-slate-500">Click to upload photo</span>
                          <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                        </label>
                      )}
                    </div>
                  </div>

                  {image && !aiResult && (
                    <button 
                      onClick={handleAnalyze}
                      disabled={isAnalyzing}
                      className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-all disabled:opacity-50"
                    >
                      {isAnalyzing ? <Loader2 className="animate-spin" /> : <Shield size={20} />}
                      Analyze with AI Triage
                    </button>
                  )}

                  {aiResult && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-6 bg-emerald-50 rounded-2xl border border-emerald-100 space-y-4"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-bold text-emerald-900">AI Analysis Result</h4>
                          <p className="text-sm text-emerald-700">{aiResult.animalType} • {aiResult.condition}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                          aiResult.severity === 'Critical' ? 'bg-rose-500 text-white' : 'bg-emerald-200 text-emerald-800'
                        }`}>
                          {aiResult.severity} Priority
                        </span>
                      </div>
                      <p className="text-sm text-emerald-800 italic">"{aiResult.description}"</p>
                      
                      {guidance && (
                        <div className="pt-4 border-t border-emerald-200">
                          <h5 className="text-xs font-bold text-emerald-900 uppercase mb-2 flex items-center gap-1">
                            <Info size={14} /> Immediate First Aid Guidance
                          </h5>
                          <p className="text-sm text-emerald-800 leading-relaxed">{guidance}</p>
                        </div>
                      )}
                    </motion.div>
                  )}

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Description & Location Details</label>
                    <textarea 
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Tell us more about the situation..."
                      className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all min-h-[120px]"
                    />
                  </div>

                  <button 
                    onClick={handleSubmitReport}
                    disabled={loading || !image || !description}
                    className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-bold text-lg hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {loading ? <Loader2 className="animate-spin" /> : <Navigation size={20} />}
                    Submit Rescue Report
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {view === 'dashboard' && (
            <motion.div 
              key="dashboard"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-8"
            >
              <div className="flex justify-between items-end">
                <div>
                  <h2 className="text-3xl font-bold">Rescue Dashboard</h2>
                  <p className="text-slate-500">Real-time reports from your community</p>
                </div>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      type="text" 
                      placeholder="Search reports..." 
                      className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {reports.map((report) => (
                  <motion.div 
                    key={report.id}
                    layoutId={`report-${report.id}`}
                    className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-md transition-all group"
                  >
                    <div className="aspect-video relative overflow-hidden">
                      <img src={report.image_url} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="Rescue" />
                      <div className="absolute top-4 right-4 flex gap-2">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-lg ${
                          report.priority === 'critical' ? 'bg-rose-500 text-white' : 'bg-emerald-500 text-white'
                        }`}>
                          {report.priority}
                        </span>
                      </div>
                    </div>
                    <div className="p-6 space-y-4">
                      <div className="flex items-center gap-2 text-slate-400 text-xs font-medium">
                        <MapPin size={14} />
                        {report.city}, {report.state}
                        <span className="mx-1">•</span>
                        {new Date(report.created_at).toLocaleDateString()}
                      </div>
                      <p className="text-slate-700 font-medium line-clamp-2">{report.description}</p>
                      <div className="pt-4 border-t border-slate-50 flex justify-between items-center">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{report.status}</span>
                        <button className="text-emerald-600 font-bold text-sm flex items-center gap-1 hover:gap-2 transition-all">
                          View Details <ChevronRight size={16} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {view === 'about' && (
            <motion.div 
              key="about"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-12"
            >
              <div className="text-center max-w-3xl mx-auto space-y-4">
                <h2 className="text-4xl font-bold">Our Mission</h2>
                <p className="text-lg text-slate-500">We believe that technology can be a powerful force for compassion. RescueAI was built to ensure that no street animal suffers in silence.</p>
              </div>
              <ProblemStatement />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 text-center space-y-4">
          <div className="flex items-center justify-center gap-2 text-emerald-600 font-bold">
            <Heart size={20} fill="currentColor" /> RescueAI Platform
          </div>
          <p className="text-slate-400 text-sm">Built for Hackathon 2026 • Empowering Street Animal Rescuers</p>
          <div className="flex justify-center gap-6 text-slate-400">
            <a href="#" className="hover:text-emerald-600 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-emerald-600 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-emerald-600 transition-colors">Contact Us</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
