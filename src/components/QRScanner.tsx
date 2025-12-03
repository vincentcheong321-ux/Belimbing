import React, { useEffect, useRef, useState, useCallback } from 'react';
import jsQR from 'jsqr';
import { Camera, XCircle } from 'lucide-react';

interface QRScannerProps {
  onScan: (data: string) => void;
  onClose: () => void;
}

const QRScanner: React.FC<QRScannerProps> = ({ onScan, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const requestRef = useRef<number>(0);

  const scan = useCallback(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (video && canvas && video.readyState === video.HAVE_ENOUGH_DATA) {
      setLoading(false);
      const ctx = canvas.getContext('2d');
      if (ctx) {
        canvas.height = video.videoHeight;
        canvas.width = video.videoWidth;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: "dontInvert",
        });

        if (code) {
          onScan(code.data);
          return; // Stop scanning loop if found (parent handles teardown)
        }
      }
    }
    requestRef.current = requestAnimationFrame(scan);
  }, [onScan]);

  useEffect(() => {
    let stream: MediaStream | null = null;

    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: "environment" } 
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          // Required for iOS to play inline
          videoRef.current.setAttribute("playsinline", "true"); 
          videoRef.current.play();
          requestRef.current = requestAnimationFrame(scan);
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
        setError("Unable to access camera. Please check permissions.");
        setLoading(false);
      }
    };

    startCamera();

    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [scan]);

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center">
      <div className="absolute top-4 right-4 z-50">
        <button onClick={onClose} className="p-2 bg-white/20 rounded-full text-white backdrop-blur-sm">
          <XCircle size={32} />
        </button>
      </div>

      <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
        {loading && <div className="absolute text-white animate-pulse">Initializing Camera...</div>}
        {error && <div className="absolute text-red-400 px-6 text-center">{error}</div>}
        
        <video 
          ref={videoRef} 
          className="absolute inset-0 w-full h-full object-cover" 
          muted 
        />
        <canvas ref={canvasRef} className="hidden" />
        
        {/* Scan Overlay UI */}
        <div className="absolute border-2 border-emerald-500 w-64 h-64 rounded-lg bg-transparent shadow-[0_0_0_999px_rgba(0,0,0,0.7)] pointer-events-none flex items-center justify-center">
             <div className="w-60 h-0.5 bg-emerald-500 opacity-50 animate-[ping_1.5s_ease-in-out_infinite]"></div>
        </div>
        <div className="absolute bottom-10 text-white bg-black/50 px-4 py-2 rounded-full text-sm font-medium backdrop-blur-md">
            Align QR code within frame
        </div>
      </div>
    </div>
  );
};

export default QRScanner;
