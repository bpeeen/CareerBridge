import React, { useState } from 'react';
import { Mic, MicOff, Loader2 } from 'lucide-react';
import { VoiceController } from '../../services/voice';
import { useApp } from '../../context/AppContext';

interface VoiceButtonProps {
  onTranscript: (text: string) => void;
  className?: string;
  label?: string;
}

export const VoiceButton: React.FC<VoiceButtonProps> = ({ onTranscript, className = '', label }) => {
  const { language } = useApp();
  const [isListening, setIsListening] = useState(false);

  const toggle = () => {
    if (isListening) {
      setIsListening(false);
      VoiceController.stop();
      return;
    }

    setIsListening(true);
    VoiceController.startListening(
      language,
      (text) => {
        setIsListening(false);
        onTranscript(text);
      },
      (err) => {
        console.warn('Voice input notice:', err);
        setIsListening(false);
      },
      () => {
        setIsListening(false);
      }
    );
  };

  return (
    <button
      type="button"
      onClick={toggle}
      className={`inline-flex items-center justify-center gap-1.5 rounded-lg border text-xs font-semibold transition-all ${
        isListening
          ? 'border-[#D96B27] bg-[#FFF4EC] text-[#D96B27] animate-pulse px-3 py-2'
          : 'border-[#E5E5DE] bg-white text-[#33373B] hover:bg-[#F4F4F0] px-3 py-2 shadow-2xs'
      } ${className}`}
      title={isListening ? 'Listening... click to stop' : 'Click to speak'}
    >
      {isListening ? (
        <>
          <MicOff className="h-4 w-4 text-[#D96B27]" />
          <span>Listening...</span>
        </>
      ) : (
        <>
          <Mic className="h-4 w-4 text-[#183B32]" />
          {label && <span>{label}</span>}
        </>
      )}
    </button>
  );
};
