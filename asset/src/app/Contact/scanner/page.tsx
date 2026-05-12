"use client";

import { useEffect, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";

export default function QRScannerPage() {
  const [scanResult, setScanResult] = useState<string | null>(null);

  useEffect(() => {
    // Initialize the scanner
    const scanner = new Html5QrcodeScanner(
      "reader", // This must match the div ID below
      { 
        fps: 10, 
        qrbox: { width: 250, height: 250 },
        rememberLastUsedCamera: true,
        supportedScanTypes: [0] // 0 = Camera only
      },
      /* verbose= */ false
    );

    scanner.render(
      (decodedText) => {
        // Success callback
        setScanResult(decodedText);
        // Optional: scanner.clear(); // Stop scanning after first success
      },
      (error) => {
        // Silent error tracking - normal while searching for code
        console.warn(error);
      }
    );

    // Cleanup when component unmounts
    return () => {
      scanner.clear().catch(err => console.error("Failed to clear scanner", err));
    };
  }, []);

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h1>Asset Scanner</h1>
      
      {scanResult ? (
        <div style={{ margin: "20px", color: "green" }}>
          <strong>Scanned Result:</strong> {scanResult}
          <br />
          <button onClick={() => window.location.reload()}>Scan Again</button>
        </div>
      ) : (
        <div id="reader" style={{ width: "100%", maxWidth: "600px", margin: "0 auto" }}></div>
      )}
    </div>
  );
}