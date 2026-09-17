import React from 'react';
import { useApp } from '../../context/AppContext';
import { t } from '../../services/i18n';
import {
  LayoutDashboard,
  GitBranch,
  Briefcase,
  Mic2,
  Landmark,
  LineChart,
  User,
  Zap,
  Award
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, persona, language, profile } = useApp();

  const navItems = [
    {
      id: 'overview',
      label: t('overview', language),
      icon: LayoutDashboard,
    },
    ...(persona === 'student'
      ? [
          {
            id: 'roadmap',
            label: 'Upskill & Roadmap',
            icon: GitBranch,
            badge: 'Structured',
          },
          {
            id: 'assessment',
            label: 'Assessment',
            icon: Award,
            badge: 'Skill Depth',
          },
          {
            id: 'opportunities',
            label: 'Job Matching',
            icon: Briefcase,
          },
          {
            id: 'interview',
            label: 'Mock Interview',
            icon: Mic2,
            badge: 'AI Coach',
          },
        ]
      : [
          {
            id: 'opportunities',
            label: 'Find Jobs',
            icon: Briefcase,
            badge: 'Local & Near',
          },
          {
            id: 'schemes',
            label: 'Government Schemes',
            icon: Landmark,
            badge: 'Verified',
          },
        ]),
    {
      id: 'profile',
      label: t('profile', language),
      icon: User,
    },
  ];

  return (
    <aside id="desktop-sidebar" className="hidden w-64 flex-col border-r border-[#E5E5DE] bg-[#FBFBF9] p-4 lg:flex shrink-0">
      {/* Target Role & Readiness Summary Card */}
      <div className="mb-6 rounded-xl border border-[#E5E5DE] bg-white p-3.5 shadow-2xs">
        <div className="flex items-center justify-between text-xs text-[#6B7280]">
          <span className="font-medium">{t('currentPosition', language)}</span>
          <span className="font-mono font-semibold text-[#183B32]">{profile?.readinessScore ?? 0}%</span>
        </div>
        <h3 className="mt-1 text-sm font-bold text-[#1E2022] truncate">
          {profile?.targetRole || profile?.tradeOrDomain || 'Career Path'}
        </h3>
        <p className="text-[11px] text-[#5A6065] truncate">
          {profile?.location.villageOrCity}, {profile?.location.state}
        </p>

        <div className="mt-2.5 h-1.5 w-full rounded-full bg-[#E5E5DE] overflow-hidden">
          <div
            className="h-full bg-[#183B32] transition-all duration-500 rounded-full"
            style={{ width: `${profile?.readinessScore ?? 0}%` }}
          />
        </div>
      </div>

      {/* Main Navigation List */}
      <nav className="flex-1 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              id={`nav-link-${item.id}`}
              onClick={() => setActiveTab(item.id)}
              className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-[#183B32] text-white shadow-2xs'
                  : 'text-[#5A6065] hover:bg-[#F4F4F0] hover:text-[#1E2022]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon className={`h-4 w-4 ${isActive ? 'text-[#A3E635]' : 'text-[#767E86]'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`rounded px-1.5 py-0.5 text-[10px] font-mono ${
                    isActive ? 'bg-[#2A6658] text-[#E2ECE9]' : 'bg-[#EFEFED] text-[#5A6065]'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Shared Engine Verified Status Footer */}
      <div className="mt-auto border-t border-[#E5E5DE] pt-3 text-[11px] text-[#6B7280]">
        <div className="flex items-center gap-1.5 font-medium text-[#183B32]">
          <Zap className="h-3.5 w-3.5 text-[#D96B27]" />
          <span>Unified Matching v3.4</span>
        </div>
        <p className="mt-0.5 text-[10px] text-[#8C949D]">
          Explainable ranking across jobs, roadmaps & schemes
        </p>
      </div>
    </aside>
  );
};
