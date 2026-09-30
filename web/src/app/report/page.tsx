"use client";

import { useState, useRef, useCallback } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

export default function ReportPage() {
  const [step, setStep] = useState(1);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const router = useRouter();

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Camera access denied", err);
    }
  };

  const capturePhoto = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext("2d");
      context?.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
      const dataUrl = canvasRef.current.toDataURL("image/jpeg");
      setPhoto(dataUrl);
      // Stop stream
      const stream = videoRef.current.srcObject as MediaStream;
      stream?.getTracks().forEach((track) => track.stop());
    }
  }, []);

  const submitReport = async () => {
    setLoading(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      alert("Must be logged in!");
      router.push("/login");
      return;
    }

    // Insert dummy record (ignoring file upload for MVP speed)
    const { error } = await supabase.from("issues").insert({
      author_id: user.id,
      title,
      description,
      ref_code: `CP-${Date.now()}`,
      status: "Processing"
    });

    if (error) {
      alert(error.message);
    } else {
      alert("Issue submitted and is processing!");
      router.push("/");
    }
    setLoading(false);
  };

  return (
    <div className="max-w-xl mx-auto p-6 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Report an Issue</h1>
      
      {step === 1 && (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
          <label className="block text-sm font-semibold">Title</label>
          <input 
            className="w-full rounded-md border border-gray-300 dark:border-gray-700 p-3 bg-inherit" 
            placeholder="E.g. Large pothole on Main St"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <label className="block text-sm font-semibold mt-4">Description</label>
          <textarea 
            className="w-full rounded-md border border-gray-300 dark:border-gray-700 p-3 bg-inherit min-h-[120px]" 
            placeholder="Provide details..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <button 
            className="w-full bg-primary text-white font-bold py-3 rounded-md mt-6"
            onClick={() => { setStep(2); startCamera(); }}
            disabled={!title}
          >
            Next: Add Photo
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4 animate-in fade-in slide-in-from-right-8">
          <p className="text-sm text-gray-500">Capture the issue clearly.</p>
          
          {!photo ? (
            <>
              <div className="relative w-full aspect-[4/3] bg-black rounded-lg overflow-hidden">
                <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                <canvas ref={canvasRef} width="800" height="600" className="hidden" />
              </div>
              <button 
                onClick={capturePhoto}
                className="w-full border-2 border-primary text-primary font-bold py-3 rounded-md mt-4"
              >
                Capture Photo
              </button>
            </>
          ) : (
            <>
              <img src={photo} className="w-full rounded-lg" alt="Captured" />
              <div className="grid grid-cols-2 gap-4 mt-4">
                <button 
                  onClick={() => { setPhoto(null); startCamera(); }}
                  className="bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-bold py-3 rounded-md"
                >
                  Retake
                </button>
                <button 
                  onClick={submitReport}
                  disabled={loading}
                  className="bg-primary text-white font-bold py-3 rounded-md"
                >
                  {loading ? "Submitting..." : "Submit Report"}
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
