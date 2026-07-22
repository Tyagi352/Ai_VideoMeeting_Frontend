// ControlBar.jsx - Meeting Room Controls
import React from 'react';
import { FiMic, FiMicOff, FiVideo, FiVideoOff, FiShare2, FiPhoneOff, FiMoreVertical } from 'react-icons/fi';

export default function ControlBar({
  isMuted = false,
  isCameraOff = false,
  onMicrophone,
  onCamera,
  onScreenShare,
  onEndCall,
}) {
  return (
    <div className="fixed bottom-5 left-1/2 z-50 -translate-x-1/2 rounded-[22px] border border-white/10 bg-[#111113]/90 p-2 shadow-[0_18px_60px_rgba(0,0,0,.45)] backdrop-blur-2xl">
      <div className="flex items-center justify-center gap-1.5 px-1 py-1 sm:gap-2 sm:px-2">
        {/* Mic Control */}
        <button
          onClick={onMicrophone}
            className={`rounded-[15px] p-3.5 text-white transition duration-200 hover:-translate-y-px ${isMuted
              ? 'bg-red-500 hover:bg-red-400'
              : 'bg-white/10 hover:bg-white/15'
            }`}
          title={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? <FiMicOff className="w-5 h-5" /> : <FiMic className="w-5 h-5" />}
        </button>

        {/* Camera Control */}
        <button
          onClick={onCamera}
            className={`rounded-[15px] p-3.5 text-white transition duration-200 hover:-translate-y-px ${isCameraOff
              ? 'bg-red-500 hover:bg-red-400'
              : 'bg-white/10 hover:bg-white/15'
            }`}
          title={isCameraOff ? 'Turn on camera' : 'Turn off camera'}
        >
          {isCameraOff ? <FiVideoOff className="w-5 h-5" /> : <FiVideo className="w-5 h-5" />}
        </button>

        {/* Screen Share */}
        <button
          onClick={onScreenShare}
          className="rounded-[15px] bg-white/10 p-3.5 text-white transition duration-200 hover:-translate-y-px hover:bg-white/15"
          title="Share screen"
        >
          <FiShare2 className="w-5 h-5" />
        </button>

        {/* Divider */}
        <div className="mx-1 h-7 w-px bg-white/10" />

        {/* More Options */}
        <button
          className="rounded-[15px] bg-white/10 p-3.5 text-white transition duration-200 hover:-translate-y-px hover:bg-white/15"
          title="More options"
        >
          <FiMoreVertical className="w-5 h-5" />
        </button>

        {/* End Call */}
        <button
          onClick={onEndCall}
          className="rounded-[15px] bg-red-500 p-3.5 text-white transition duration-200 hover:-translate-y-px hover:bg-red-400"
          title="End call"
        >
          <FiPhoneOff className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
