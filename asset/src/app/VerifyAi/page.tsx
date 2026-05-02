// components/VerifyButton.tsx
'use client';

import { DiditSdk } from '@didit-protocol/sdk-web';
import { useState } from 'react';

export default function VerifyButton() {
  const [loading, setLoading] = useState(false);

  const startVerification = async () => {
    setLoading(true);
    
    try {
      // 1. Get the session URL from your backend
      const res = await fetch('/api/verify', { method: 'POST' });
      const { url } = await res.json();

      // 2. Launch the Didit UI
      DiditSdk.shared.onComplete = (result) => {
        if (result.type === 'completed') {
          alert(`Success! Session ID: ${result.session?.sessionId}`);
          console.log('Verification Status:', result.session?.status);
        } else {
          console.log('Verification was cancelled or failed.');
        }
      };

      DiditSdk.shared.startVerification({ url });
      
    } catch (err) {
      console.error("Verification error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button 
      onClick={startVerification}
      disabled={loading}
      className="px-6 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 disabled:opacity-50"
    >
      {loading ? 'Loading...' : 'Start Facial Scan'}
    </button>
  );
}