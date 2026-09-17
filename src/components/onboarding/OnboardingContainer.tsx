import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { PersonaSelection } from './PersonaSelection';
import { StudentOnboardingForm } from './StudentOnboardingForm';
import { JobSeekerOnboardingForm } from './JobSeekerOnboardingForm';
import { Persona } from '../../types';

export const OnboardingContainer: React.FC = () => {
  const { userSession, persona, profile } = useApp();
  const [selectedPersona, setSelectedPersona] = useState<Persona | null>(
    persona || profile?.persona || userSession?.persona || null
  );

  useEffect(() => {
    if (persona) {
      setSelectedPersona(persona);
    }
  }, [persona]);

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-[#FBFBF9] px-4 py-8 font-sans">
      <div className="w-full max-w-2xl">
        {!selectedPersona ? (
          <PersonaSelection onSelectPersona={(p) => setSelectedPersona(p)} />
        ) : selectedPersona === 'student' ? (
          <StudentOnboardingForm
            onBackToSelection={() => setSelectedPersona(null)}
            onSwitchPersona={(p) => setSelectedPersona(p)}
          />
        ) : (
          <JobSeekerOnboardingForm
            onBackToSelection={() => setSelectedPersona(null)}
            onSwitchPersona={(p) => setSelectedPersona(p)}
          />
        )}
      </div>
    </div>
  );
};
