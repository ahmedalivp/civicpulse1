"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import CameraView from "@/components/CameraView";

export default function ReportPage() {
  const [step, setStep] = useState(1);
  const [showCamera, setShowCamera] = useState(false);
  const [photo, setPhoto] = useState<string | null>(null);
  const [location, setLocation] = useState<{lat: number, lng: number, acc: number} | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [severity, setSeverity] = useState("Inconvenient");
  
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    const fetchCats = async () => {
      const supabase = createClient();
      const { data } = await supabase.from("categories").select("*");
      if (data) setCategories(data);
    };
    fetchCats();
  }, []);

  const handleCapture = (dataUrl: string) => {
    setPhoto(dataUrl);
    setShowCamera(false);
    
    // Auto-locate on capture
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          acc: pos.coords.accuracy
        });
      });
    }
  };

  const submitReport = async () => {
    setLoading(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      router.push("/login");
      return;
    }

    // In a real P2 app we upload the blob to storage first.
    // For P1, we insert the issue and create a mock issue_images record.
    const { data: issue, error } = await supabase.from("issues").insert({
      author_id: user.id,
      title,
      description,
      category_id: categoryId || null,
      severity,
      ref_code: `CP-${Date.now()}`,
      status: "Processing",
      location: location ? `POINT(${location.lng} ${location.lat})` : null
    }).select().single();

    if (error) {
      alert(error.message);
      setLoading(false);
      return;
    }

    // Mock image record so worker picks it up
    await supabase.from("issue_images").insert({
      issue_id: issue.id,
      uploader_id: user.id,
      kind: "problem",
      processing_status: "pending"
    });

    alert("Issue submitted and is processing!");
    router.push("/");
  };

  if (showCamera) {
    return <CameraView onCapture={handleCapture} onCancel={() => setShowCamera(false)} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20 pt-8 px-4 sm:px-0">
      <div className="max-w-xl mx-auto">
        
        {/* Progress Bar */}
        <div className="flex items-center justify-between mb-8 px-4">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${step >= s ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500 dark:bg-gray-800'}`}>
                {s}
              </div>
              {s < 3 && <div className={`w-12 sm:w-24 h-1 mx-2 rounded ${step > s ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-800'}`} />}
            </div>
          ))}
        </div>

        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-200 dark:border-gray-700/50">
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
              <h1 className="text-3xl font-extrabold mb-2">What's the problem?</h1>
              <p className="text-gray-500 mb-6">Provide clear details so the community and authorities can understand.</p>
              
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Title</label>
                <input 
                  className="w-full rounded-xl border border-gray-300 dark:border-gray-700 p-4 bg-white/50 dark:bg-gray-900/50 focus:ring-2 focus:ring-primary/20 outline-none transition-all" 
                  placeholder="E.g. Deep pothole on Main St"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  maxLength={100}
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Description</label>
                <textarea 
                  className="w-full rounded-xl border border-gray-300 dark:border-gray-700 p-4 bg-white/50 dark:bg-gray-900/50 focus:ring-2 focus:ring-primary/20 outline-none transition-all min-h-[120px]" 
                  placeholder="Provide specific details about the issue..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <button 
                className="w-full bg-gradient-to-r from-primary to-primary-dark text-white font-bold py-4 rounded-xl mt-6 shadow-lg shadow-primary/30 transform hover:scale-[1.02] transition-all disabled:opacity-50 disabled:scale-100"
                onClick={() => setStep(2)}
                disabled={!title || !description}
              >
                Next: Categorize
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
              <h1 className="text-3xl font-extrabold mb-6">Categorize the issue</h1>
              
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Category</label>
                <select 
                  className="w-full rounded-xl border border-gray-300 dark:border-gray-700 p-4 bg-white/50 dark:bg-gray-900/50 outline-none appearance-none"
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                >
                  <option value="" disabled>Select a category...</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.names?.en || c.slug}</option>)}
                  {categories.length === 0 && <option value="fallback">Infrastructure & Roads</option>}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 mt-6">Severity</label>
                <div className="grid grid-cols-3 gap-3">
                  {['Nuisance', 'Inconvenient', 'Hazard'].map(sev => (
                    <button
                      key={sev}
                      onClick={() => setSeverity(sev)}
                      className={`py-3 rounded-xl font-bold text-sm border transition-colors ${severity === sev ? 'bg-primary/10 border-primary text-primary' : 'border-gray-200 dark:border-gray-700 text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
                    >
                      {sev}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-4 mt-8">
                <button className="px-6 py-4 rounded-xl font-bold text-gray-500 bg-gray-100 dark:bg-gray-800" onClick={() => setStep(1)}>Back</button>
                <button 
                  className="flex-1 bg-gradient-to-r from-primary to-primary-dark text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/30"
                  onClick={() => setStep(3)}
                >
                  Next: Photo & Location
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
              <h1 className="text-3xl font-extrabold mb-2">Visual Evidence</h1>
              <p className="text-gray-500 mb-6">Capture the issue clearly. Faces and plates will be automatically blurred.</p>
              
              {!photo ? (
                <div 
                  onClick={() => setShowCamera(true)}
                  className="w-full aspect-[4/3] rounded-2xl border-2 border-dashed border-primary/50 bg-primary/5 flex flex-col items-center justify-center cursor-pointer hover:bg-primary/10 transition-colors"
                >
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white mb-4 shadow-lg shadow-primary/30">
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <span className="font-bold text-primary">Tap to open camera</span>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="relative rounded-2xl overflow-hidden shadow-md">
                    <img src={photo} className="w-full aspect-[4/3] object-cover" alt="Captured" />
                    {location && (
                      <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-md text-white text-xs px-3 py-1.5 rounded-full flex items-center gap-2">
                        <span className="w-2 h-2 bg-success rounded-full animate-pulse"></span>
                        Location Verified
                      </div>
                    )}
                  </div>
                  <button 
                    onClick={() => { setPhoto(null); setShowCamera(true); }}
                    className="w-full py-3 rounded-xl font-bold text-primary border-2 border-primary/20 hover:bg-primary/5 transition-colors"
                  >
                    Retake Photo
                  </button>
                </div>
              )}

              <div className="flex gap-4 mt-8 pt-6 border-t border-gray-100 dark:border-gray-700">
                <button className="px-6 py-4 rounded-xl font-bold text-gray-500 bg-gray-100 dark:bg-gray-800" onClick={() => setStep(2)}>Back</button>
                <button 
                  onClick={submitReport}
                  disabled={loading || !photo}
                  className="flex-1 bg-gradient-to-r from-success to-emerald-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-success/30 disabled:opacity-50 disabled:scale-100 transform hover:scale-[1.02] transition-all"
                >
                  {loading ? "Publishing..." : "Submit Report"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
