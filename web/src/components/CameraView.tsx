"use client";

import { useState, useRef, useCallback, useEffect } from "react";

interface CameraViewProps {
  onCapture: (dataUrl: string) => void;
  onCancel: () => void;
}

export default function CameraView({ onCapture, onCancel }: CameraViewProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let stream: MediaStream | null = null;
    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: "environment" } 
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Camera access denied", err);
        setError("Camera access denied. Please enable camera permissions.");
      }
    };
    startCamera();

    return () => {
      stream?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  const handleCapture = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext("2d");
      canvasRef.current.width = videoRef.current.videoWidth;
      canvasRef.current.height = videoRef.current.videoHeight;
      context?.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
      const dataUrl = canvasRef.current.toDataURL("image/jpeg", 0.8);
      onCapture(dataUrl);
    }
  }, [onCapture]);

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col">
      <div className="flex-1 relative overflow-hidden">
        {error ? (
          <div className="absolute inset-0 flex items-center justify-center p-6 text-center text-white">
            <p className="bg-danger/20 text-danger p-4 rounded-xl border border-danger/30">{error}</p>
          </div>
        ) : (
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            className="w-full h-full object-cover" 
          />
        )}
        <canvas ref={canvasRef} className="hidden" />
        
        {/* Overlay Grid */}
        <div className="absolute inset-0 pointer-events-none grid grid-cols-3 grid-rows-3 opacity-30">
          <div className="border-b border-r border-white"></div>
          <div className="border-b border-r border-white"></div>
          <div className="border-b border-white"></div>
          <div className="border-b border-r border-white"></div>
          <div className="border-b border-r border-white"></div>
          <div className="border-b border-white"></div>
          <div className="border-r border-white"></div>
          <div className="border-r border-white"></div>
          <div></div>
        </div>
      </div>
      
      <div className="bg-black pb-12 pt-6 px-8 flex justify-between items-center">
        <button 
          onClick={onCancel}
          className="text-white font-semibold opacity-80 hover:opacity-100 py-3 px-6 rounded-full"
        >
          Cancel
        </button>
        
        <button 
          onClick={handleCapture}
          className="w-20 h-20 bg-white rounded-full border-[6px] border-gray-400 focus:outline-none focus:ring-4 focus:ring-white/50 active:scale-95 transition-transform"
          aria-label="Take photo"
        />
        
        <div className="w-20" /> {/* Spacer for centering */}
      </div>
    </div>
  );
}
