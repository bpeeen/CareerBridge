import React, { useState, useEffect } from 'react';
import { Volume2, Square } from 'lucide-react';
import { VoiceController } from '../../services/voice';
import { useApp } from '../../context/AppContext';
import { t } from '../../services/i18n';

interface AudioPlayerProps {
  textToRead: string;
  className?: string;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({ textToRead, className = '' }) => {
  const { language } = useApp();
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    return () => {
      if (isPlaying) {
        VoiceController.stop();
      }
    };
  }, [isPlaying]);

  const handleToggle = () => {
    if (isPlaying) {
      VoiceController.stop();
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      VoiceController.speak(textToRead, language, () => {
        setIsPlaying(false);
      });
    }
  };

  return (
    <button
      onClick={handleToggle}
      className={`inline-flex items-center gap-1.5 rounded-md border border-[#E5E5DE] bg-white px-2.5 py-1 text-xs font-semibold text-[#183B32] hover:bg-[#F4F4F0] transition-colors shadow-2xs ${className}`}
      title={isPlaying ? 'Stop reading' : 'Listen to explanation'}
    >
      {isPlaying ? (
        <>
          <Square className="h-3 w-3 text-[#D96B27] fill-current" />
          <span className="text-[#D96B27]">{t('stopAudio', language)}</span>
        </>
      ) : (
        <>
          <Volume2 className="h-3.5 w-3.5 text-[#183B32]" />
          <span>{t('listenAudio', language)}</span>
        </>
      )}
    </button>
  );
};
