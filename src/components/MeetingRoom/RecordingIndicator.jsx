// RecordingIndicator.jsx - Recording Status Badge
import React, { useEffect, useState } from 'react';

export default function RecordingIndicator({ isRecording = false }) {
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    if (!isRecording) return;
    const interval = setInterval(() => setPulse((p) => !p), 1000);
    return () => clearInterval(interval);
  }, [isRecording]);

  if (!isRecording) return null;

  return (
    <div className="fixed top-4 right-4 z-50 flex items-center gap-2 bg-red-600 text-white px-4 py-2.5 rounded-full shadow-lg">
      <div className={`w-2.5 h-2.5 bg-white rounded-full ${pulse ? 'opacity-100' : 'opacity-30'} transition-opacity`} />
      <span className="text-sm font-semibold">REC</span>
    </div>
  );
}
