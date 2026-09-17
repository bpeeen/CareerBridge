import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { MobileNav } from './components/layout/MobileNav';
import { StudentDashboard } from './components/dashboard/StudentDashboard';
import { RuralDashboard } from './components/dashboard/RuralDashboard';
import { RoadmapView } from './components/roadmap/RoadmapView';
import { AssessmentView } from './components/assessment/AssessmentView';
import { OpportunitiesView } from './components/opportunities/OpportunitiesView';
import { InterviewView } from './components/interview/InterviewView';
import { SchemesView } from './components/schemes/SchemesView';
import { ProfileView } from './components/profile/ProfileView';
import { AuthPage } from './components/auth/AuthPage';
import { OnboardingContainer } from './components/onboarding/OnboardingContainer';
import { Loader2 } from 'lucide-react';

const MainContent: React.FC = () => {
  const { activeTab, persona } = useApp();

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'overview':
        return persona === 'student' ? <StudentDashboard /> : <RuralDashboard />;
      case 'roadmap':
        return <RoadmapView />;
      case 'assessment':
        return <AssessmentView />;
      case 'opportunities':
        return <OpportunitiesView />;
      case 'interview':
        return <InterviewView />;
      case 'schemes':
        return <SchemesView />;
      case 'profile':
        return <ProfileView />;
      default:
        return persona === 'student' ? <StudentDashboard /> : <RuralDashboard />;
    }
  };

  return (
    <main className="flex-1 overflow-y-auto px-4 py-6 pb-24 md:px-8 lg:pb-8 max-w-7xl mx-auto w-full">
      {renderActiveTab()}
    </main>
  );
};

const AppRoutes: React.FC = () => {
  const { userSession, profile, isLoading, showOnboarding } = useApp();

  if (isLoading) {
    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center gap-3 text-xs text-[#5A6065] bg-[#FBFBF9]">
        <Loader2 className="h-6 w-6 animate-spin text-[#183B32]" />
        <span>Loading CareerBridge session...</span>
      </div>
    );
  }

  // Guard 1: Unauthenticated -> Show Auth Screen
  if (!userSession) {
    return <AuthPage />;
  }

  // Guard 2: Authenticated but missing/incomplete profile or explicit onboarding request -> Show Onboarding
  if (!profile || !profile.hasCompletedOnboarding || showOnboarding) {
    return <OnboardingContainer />;
  }

  // Guard 3: Authenticated & Onboarded -> Render Main App Dashboard
  return (
    <div className="min-h-screen bg-[#FBFBF9] text-[#1E2022] flex flex-col font-sans selection:bg-[#E2ECE9] selection:text-[#183B32]">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <MainContent />
      </div>
      <MobileNav />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppRoutes />
    </AppProvider>
  );
}
