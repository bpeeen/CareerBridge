import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { t } from '../../services/i18n';
import { VoiceController } from '../../services/voice';
import { 
  Sparkles, 
  Languages, 
  Mic, 
  MicOff, 
  GraduationCap, 
  Briefcase, 
  ChevronDown,
  User,
  Sliders,
  LogOut,
  LogIn
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    profile,
    userSession,
    persona,
    switchMode,
    language,
    setLanguage,
    setShowOnboarding,
    setShowAuthModal,
    setActiveVoiceQuery,
    setActiveTab,
    logout,
  } = useApp();

  const [isListening, setIsListening] = useState(false);
  const [showModeMenu, setShowModeMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const toggleVoiceSearch = () => {
    if (isListening) {
      setIsListening(false);
      VoiceController.stop();
      return;
    }

    setIsListening(true);
    VoiceController.startListening(
      language,
      (transcript) => {
        setIsListening(false);
        setActiveVoiceQuery(transcript);
        if (persona === 'livelihood') {
          setActiveTab('schemes');
        } else {
          setActiveTab('opportunities');
        }
      },
      (err) => {
        console.warn('Voice recognition:', err);
        setIsListening(false);
      },
      () => {
        setIsListening(false);
      }
    );
  };

  const handleModeSwitch = (newMode: 'student' | 'livelihood') => {
    switchMode(newMode);
    setShowModeMenu(false);
  };

  return (
    <header id="app-header" className="sticky top-0 z-30 flex items-center justify-between border-b border-[#E5E5DE] bg-[#FBFBF9]/95 px-4 py-3 backdrop-blur-md md:px-8">
      {/* Brand & Persona Identifier */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#183B32] text-white shadow-xs">
            <Sparkles className="h-4 w-4 text-[#A3E635]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold tracking-tight text-[#1E2022] text-base">CareerBridge</span>
            </div>
            <p className="hidden text-[11px] text-[#6B7280] sm:block">
              {persona === 'student' ? 'Student & Tech Career Pathways' : 'Job Seeker & Rural Livelihood Pathways'}
            </p>
          </div>
        </div>

        {/* Persona Switcher Quick Pill */}
        <div className="relative ml-2">
          <button
            onClick={() => setShowModeMenu(!showModeMenu)}
            className="flex items-center gap-2 rounded-xl border border-[#E5E5DE] bg-white px-3 py-1.5 text-xs font-semibold text-[#1E2022] hover:bg-[#F4F4F0] shadow-2xs transition-all"
          >
            {persona === 'student' ? (
              <span className="flex items-center gap-1.5 text-[#183B32]">
                <GraduationCap className="h-4 w-4" />
                <span>🎓 Student</span>
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-[#D96B27]">
                <Briefcase className="h-4 w-4" />
                <span>💼 Job Seeker</span>
              </span>
            )}
            <ChevronDown className="h-3.5 w-3.5 text-[#8C949D]" />
          </button>

          {/* Mode Switcher Dropdown */}
          {showModeMenu && (
            <div className="absolute left-0 mt-1.5 w-64 rounded-xl border border-[#E5E5DE] bg-white p-2 shadow-lg z-50 animate-in fade-in slide-in-from-top-2">
              <div className="px-2 py-1.5 border-b border-[#F4F4F0] mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#8C949D]">Switch Mode</span>
                <p className="text-xs font-semibold text-[#1E2022]">
                  {persona === 'student' ? 'Currently: 🎓 Student' : 'Currently: 💼 Job Seeker'}
                </p>
              </div>

              <div className="space-y-1">
                <button
                  onClick={() => handleModeSwitch('student')}
                  className={`flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-xs transition-colors ${
                    persona === 'student'
                      ? 'bg-[#E2ECE9] font-bold text-[#183B32]'
                      : 'text-[#5A6065] hover:bg-[#FBFBF9] hover:text-[#1E2022]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <GraduationCap className="h-4 w-4" />
                    <span>Student / Tech Career</span>
                  </div>
                  {persona === 'student' && <span className="h-1.5 w-1.5 rounded-full bg-[#183B32]" />}
                </button>

                <button
                  onClick={() => handleModeSwitch('livelihood')}
                  className={`flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-xs transition-colors ${
                    persona === 'livelihood'
                      ? 'bg-[#FFF4EC] font-bold text-[#D96B27]'
                      : 'text-[#5A6065] hover:bg-[#FBFBF9] hover:text-[#1E2022]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4" />
                    <span>Job Seeker / Livelihood</span>
                  </div>
                  {persona === 'livelihood' && <span className="h-1.5 w-1.5 rounded-full bg-[#D96B27]" />}
                </button>
              </div>

              <div className="mt-2 border-t border-[#F4F4F0] pt-1.5 text-[10px] text-[#8C949D] px-2 leading-relaxed">
                Mode switching preserves all your saved roadmaps and assessments without logging out.
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right Action Tools */}
      <div className="flex items-center gap-2">
        {/* Voice Command Button */}
        <button
          id="global-voice-mic-btn"
          onClick={toggleVoiceSearch}
          title={isListening ? 'Listening...' : 'Voice Search in English or Hindi'}
          className={`flex items-center gap-1.5 rounded-xl border px-2.5 py-1.5 text-xs font-medium transition-all ${
            isListening
              ? 'border-[#D96B27] bg-[#FFF4EC] text-[#D96B27] animate-pulse'
              : 'border-[#E5E5DE] bg-white text-[#33373B] hover:bg-[#F4F4F0]'
          }`}
        >
          {isListening ? <MicOff className="h-3.5 w-3.5" /> : <Mic className="h-3.5 w-3.5 text-[#183B32]" />}
          <span className="hidden sm:inline">
            {isListening ? t('listening', language) : t('voiceSearch', language)}
          </span>
        </button>

        {/* Vernacular Language Switcher */}
        <button
          id="lang-toggle-btn"
          onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
          className="flex items-center gap-1 rounded-xl border border-[#E5E5DE] bg-white px-2.5 py-1.5 text-xs font-medium text-[#33373B] hover:bg-[#F4F4F0] transition-colors"
          title="Switch Language / भाषा बदलें"
        >
          <Languages className="h-3.5 w-3.5 text-[#183B32]" />
          <span className="font-semibold">{language === 'en' ? 'हिन्दी' : 'English'}</span>
        </button>

        {/* User Account / Profile Menu */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 rounded-xl border border-[#E5E5DE] bg-white px-2.5 py-1.5 text-xs font-semibold text-[#1E2022] hover:bg-[#F4F4F0] transition-colors"
          >
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#E2ECE9] text-[#183B32] font-bold text-[10px]">
              {profile?.name ? profile.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <span className="hidden md:inline max-w-[100px] truncate text-xs">
              {profile?.name || 'Account'}
            </span>
            <ChevronDown className="h-3 w-3 text-[#8C949D]" />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-1.5 w-56 rounded-xl border border-[#E5E5DE] bg-white p-2 shadow-lg z-50 animate-in fade-in slide-in-from-top-2">
              <div className="px-2.5 py-2 border-b border-[#F4F4F0]">
                <p className="text-xs font-bold text-[#1E2022] truncate">{profile?.name || 'Candidate'}</p>
                <p className="text-[11px] text-[#8C949D] truncate">{profile?.email || userSession?.email || 'Logged in'}</p>
              </div>

              <div className="space-y-1 py-1">
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    setShowOnboarding(true);
                  }}
                  className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-[#5A6065] hover:bg-[#FBFBF9] hover:text-[#1E2022]"
                >
                  <Sliders className="h-3.5 w-3.5" />
                  <span>Edit Profile / Target Role</span>
                </button>

                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    setShowAuthModal(true);
                  }}
                  className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-[#5A6065] hover:bg-[#FBFBF9] hover:text-[#1E2022]"
                >
                  <LogIn className="h-3.5 w-3.5" />
                  <span>Switch Account / Sign In</span>
                </button>

                <button
                  onClick={async () => {
                    setShowUserMenu(false);
                    await logout();
                  }}
                  className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-[#DC2626] hover:bg-[#FEF2F2]"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
