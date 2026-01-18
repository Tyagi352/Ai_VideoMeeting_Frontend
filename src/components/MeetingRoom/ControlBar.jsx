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
    <div className="fixed bottom-0 left-0 right-0 backdrop-blur-md bg-black/80 border-t border-gray-700/50">
      <div className="flex items-center justify-center gap-4 px-6 py-5 max-w-full">
        {/* Mic Control */}
        <button
          onClick={onMicrophone}
          className={`p-3 rounded-full transition duration-300 ${
            isMuted
              ? 'bg-red-600 hover:bg-red-700 text-white'
              : 'bg-gray-700 hover:bg-gray-600 text-white'
          }`}
          title={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? <FiMicOff className="w-5 h-5" /> : <FiMic className="w-5 h-5" />}
        </button>

        {/* Camera Control */}
        <button
          onClick={onCamera}
          className={`p-3 rounded-full transition duration-300 ${
            isCameraOff
              ? 'bg-red-600 hover:bg-red-700 text-white'
              : 'bg-gray-700 hover:bg-gray-600 text-white'
          }`}
          title={isCameraOff ? 'Turn on camera' : 'Turn off camera'}
        >
          {isCameraOff ? <FiVideoOff className="w-5 h-5" /> : <FiVideo className="w-5 h-5" />}
        </button>

        {/* Screen Share */}
        <button
          onClick={onScreenShare}
          className="p-3 rounded-full bg-gray-700 hover:bg-gray-600 text-white transition duration-300"
          title="Share screen"
        >
          <FiShare2 className="w-5 h-5" />
        </button>

        {/* Divider */}
        <div className="h-8 w-px bg-gray-600" />

        {/* More Options */}
        <button
          className="p-3 rounded-full bg-gray-700 hover:bg-gray-600 text-white transition duration-300"
          title="More options"
        >
          <FiMoreVertical className="w-5 h-5" />
        </button>

        {/* End Call */}
        <button
          onClick={onEndCall}
          className="p-3 rounded-full bg-red-600 hover:bg-red-700 text-white transition duration-300"
          title="End call"
        >
          <FiPhoneOff className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
