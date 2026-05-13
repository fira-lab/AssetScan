"use client";

import React, { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";
import { Button, Card, Spinner, useToast } from "@chakra-ui/react";

export default function VerifyAiPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [detectedName, setDetectedName] = useState<string | null>(null);
  const toast = useToast();

 
 // 1. Load Models on Mount
useEffect(() => {
  const loadModels = async () => {
    const MODEL_URL = "/model";   // ← Correct path for public/model

    try {
      toast({
        title: "Loading AI Models...",
        description: "Please wait while models are being loaded",
        status: "loading",
        duration: null, // Keeps it open until success/error
        isClosable: false,
      });

      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
        faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
        faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
        faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
      ]);

      setModelsLoaded(true);

      toast({
        title: "Models Loaded Successfully",
        description: "AI Face Detection is ready",
        status: "success",
        duration: 3000,
      });

    } catch (error) {
      console.error("Model loading failed:", error);

      toast({
        title: "Failed to Load Models",
        description: "Please check that all model files are in /public/model folder",
        status: "error",
        duration: 6000,
        isClosable: true,
      });
    }
  };

  loadModels();
}, [toast]);

  // 2. Start Video Stream
  const startVideo = () => {
    setIsScanning(true);
    navigator.mediaDevices
      .getUserMedia({ video: {} })
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch((err) => console.error("Camera access denied", err));
  };

  // 3. Face Detection Loop
  const handleVideoPlay = () => {
    if (!canvasRef.current || !videoRef.current) return;

    const canvas = canvasRef.current;
    const displaySize = { 
      width: videoRef.current.width, 
      height: videoRef.current.height 
    };
    faceapi.matchDimensions(canvas, displaySize);

    setInterval(async () => {
      if (!videoRef.current) return;

      const detections = await faceapi
        .detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceExpressions();

      const resizedDetections = faceapi.resizeResults(detections, displaySize);
      
      const context = canvas.getContext("2d");
      if (context) {
        context.clearRect(0, 0, canvas.width, canvas.height);
        faceapi.draw.drawDetections(canvas, resizedDetections);
        faceapi.draw.drawFaceExpressions(canvas, resizedDetections);
      }

      if (detections.length > 0) {
        // Logic to verify against a stored image would go here
        setDetectedName("Face Detected"); 
      }
    }, 100);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50 dark:bg-gray-900">
      <Card className="p-6 w-full max-w-2xl text-center shadow-xl bg-white dark:bg-gray-800">
        <h1 className="text-2xl font-bold mb-6 text-emerald-600">AI Identity Verification</h1>

        {!modelsLoaded ? (
          <div className="flex flex-col items-center gap-4">
            <Spinner color="emerald.500" size="xl" />
            <p>Loading AI Models... (Check /public/models if this hangs)</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="relative inline-block overflow-hidden rounded-xl border-4 border-emerald-500">
              <video
                ref={videoRef}
                autoPlay
                muted
                onPlay={handleVideoPlay}
                width="640"
                height="480"
                className="rounded-lg"
              />
              <canvas
                ref={canvasRef}
                className="absolute top-0 left-0"
              />
            </div>

            <div className="flex flex-col gap-3">
              {!isScanning ? (
                <Button colorScheme="emerald" size="lg" onClick={startVideo}>
                  Start AI Scanner
                </Button>
              ) : (
                <div className="p-4 bg-emerald-100 text-emerald-800 rounded-lg font-bold">
                  {detectedName || "Scanning for face..."}
                </div>
              )}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}