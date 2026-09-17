import React from 'react';
import { useApp } from '../../context/AppContext';
import { t } from '../../services/i18n';
import { LayoutDashboard, GitBranch, Briefcase, Mic2, Landmark, User, Award } from 'lucide-react';

export const MobileNav: React.FC = () => {
  const { activeTab, setActiveTab, persona, language } = useApp();

  const navItems = [
    { id: 'overview', label: t('overview', language), icon: LayoutDashboard },
    ...(persona === 'student'
      ? [
          { id: 'roadmap', label: 'Upskill', icon: GitBranch },
          { id: 'assessment', label: 'Assess', icon: Award },
          { id: 'opportunities', label: 'Jobs', icon: Briefcase },
          { id: 'interview', label: 'Interview', icon: Mic2 },
        ]
      : [
          { id: 'opportunities', label: 'Jobs', icon: Briefcase },
          { id: 'schemes', label: 'Schemes', icon: Landmark },
        ]),
    { id: 'profile', label: t('profile', language), icon: User },
  ];

  return (
    <nav id="mobile-bottom-nav" className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around border-t border-[#E5E5DE] bg-white/95 px-1 py-2 backdrop-blur-md lg:hidden">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            id={`mobile-nav-${item.id}`}
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center gap-0.5 rounded-md px-2 py-1 text-[10px] font-medium transition-colors ${
              isActive ? 'text-[#183B32] font-bold' : 'text-[#767E86]'
            }`}
          >
            <Icon className={`h-4 w-4 ${isActive ? 'text-[#183B32]' : 'text-[#767E86]'}`} />
            <span className="truncate max-w-[60px]">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
