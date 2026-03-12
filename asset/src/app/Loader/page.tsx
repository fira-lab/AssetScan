"use client";
import React from "react";

const Page = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-blue-950">
      <div className="g-omm-loader" />
      <h2 className="loader-text text-2xl font-semibold text-blue-300 mt-4">
        G-OMM
      </h2>
      <p className="text-blue-400 mt-2">Initializing...</p>
      <style jsx>{`
        .g-omm-loader {
          width: 80px;
          height: 80px;
          position: relative;
          margin: 0 auto;
        }
        .g-omm-loader:before,
        .g-omm-loader:after {
          content: "";
          position: absolute;
          width: 100%;
          height: 100%;
          border: 4px solid transparent;
          border-top-color: #3b82f6;
          border-radius: 50%;
          animation: spin 1.5s cubic-bezier(0.68, -0.55, 0.27, 1.55) infinite;
        }
        .g-omm-loader:after {
          border-top-color: #60a5fa;
          animation-delay: -0.75s;
          transform: scale(0.8);
        }
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
        @keyframes textPulse {
          0%,
          100% {
            opacity: 1;
            transform: translateY(0);
          }
          50% {
            opacity: 0.5;
            transform: translateY(-5px);
          }
        }
        .loader-text {
          animation: textPulse 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Page;
