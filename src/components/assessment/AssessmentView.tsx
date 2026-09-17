import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Award, 
  Sparkles, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  RotateCcw, 
  ChevronRight, 
  Check, 
  BookOpen, 
  BrainCircuit,
  Zap
} from 'lucide-react';

export const AssessmentView: React.FC = () => {
  const {
    profile,
    assessmentSession,
    latestAssessmentResult,
    startAssessment,
    submitAssessment,
    closeAssessment,
    isGeneratingAssessment,
    assessmentSkillName,
    setActiveTab
  } = useApp();

  const [selectedSkill, setSelectedSkill] = useState<string>('Python');
  const [currentAnswers, setCurrentAnswers] = useState<Record<string, number>>({});
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState<number>(0);
  const [selectedOptionIdx, setSelectedOptionIdx] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const availableSkills = Object.keys(profile?.skills || {
    Python: {},
    SQL: {},
    'REST APIs': {},
    DSA: {},
    Git: {},
  });

  const handleStart = async (skillToTest: string) => {
    setCurrentAnswers({});
    setCurrentQuestionIdx(0);
    setSelectedOptionIdx(null);
    setIsSubmitted(false);
    await startAssessment(skillToTest);
  };

  const handleSelectOption = (idx: number) => {
    setSelectedOptionIdx(idx);
  };

  const handleNextOrSubmit = async () => {
    if (!assessmentSession) return;
    const currentQ = assessmentSession.questions[currentQuestionIdx];
    const newAnswers = {
      ...currentAnswers,
      [currentQ.id]: selectedOptionIdx !== null ? selectedOptionIdx : 0,
    };
    setCurrentAnswers(newAnswers);

    if (currentQuestionIdx < assessmentSession.questions.length - 1) {
      setCurrentQuestionIdx(currentQuestionIdx + 1);
      setSelectedOptionIdx(null);
    } else {
      // Final submission
      setIsSubmitted(true);
      await submitAssessment(newAnswers);
    }
  };

  // 1. Initial Selection State (no active session)
  if (!assessmentSession) {
    return (
      <div className="space-y-6">
        {/* Header Banner */}
        <div className="rounded-2xl border border-[#E5E5DE] bg-white p-6 shadow-2xs">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#183B32] bg-[#E2ECE9] px-2 py-0.5 rounded">
                  Demonstrated Skill Verification
                </span>
              </div>
              <h1 className="mt-1.5 text-2xl font-bold tracking-tight text-[#1E2022]">
                Assess Your Skill Depth
              </h1>
              <p className="mt-1 text-xs text-[#5A6065] max-w-2xl leading-relaxed">
                Take an AI-calibrated assessment to test conceptual mastery, system design edge cases, and code efficiency. Scores update your profile readiness and adapt your roadmap milestones.
              </p>
            </div>
          </div>
        </div>

        {/* Skill Selection Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {availableSkills.map((skillName) => {
            const skillData = profile?.skills[skillName];
            const isDemonstrated = skillData?.evidence?.includes('assessment');
            const isThisSkillLoading = isGeneratingAssessment && assessmentSkillName === skillName;

            return (
              <div
                key={skillName}
                className="rounded-2xl border border-[#E5E5DE] bg-white p-5 shadow-2xs flex flex-col justify-between hover:border-[#CCD0D5] transition-all"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-base text-[#1E2022]">{skillName}</span>
                    <span className="font-mono text-sm font-bold text-[#183B32]">
                      {skillData?.level ?? 0}%
                    </span>
                  </div>

                  <div className="mt-2 h-1.5 w-full rounded-full bg-[#E5E5DE] overflow-hidden">
                    <div
                      className={`h-full rounded-full ${isDemonstrated ? 'bg-[#183B32]' : 'bg-[#D96B27]'}`}
                      style={{ width: `${skillData?.level ?? 0}%` }}
                    />
                  </div>

                  <p className="mt-3 text-xs text-[#5A6065]">
                    {isDemonstrated ? '✓ Verified with demonstrated evidence' : 'Self-reported level. Take assessment to verify.'}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-[#F4F4F0]">
                  <button
                    onClick={() => handleStart(skillName)}
                    disabled={isGeneratingAssessment}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#183B32] py-2.5 text-xs font-bold text-white shadow-xs hover:bg-[#15342C] transition-all disabled:opacity-75"
                  >
                    <Award className={`h-4 w-4 ${isThisSkillLoading ? 'animate-spin' : ''}`} />
                    <span>{isThisSkillLoading ? 'Generating Assessment...' : `Start ${skillName} Assessment`}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // 2. Active Assessment Questions State
  const currentQuestion = assessmentSession.questions[currentQuestionIdx];
  const isLastQuestion = currentQuestionIdx === assessmentSession.questions.length - 1;

  if (!assessmentSession.isCompleted && !latestAssessmentResult) {
    return (
      <div className="space-y-6 max-w-3xl mx-auto">
        {/* Progress & Header */}
        <div className="flex items-center justify-between border-b border-[#E5E5DE] pb-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#5A6065]">
              {assessmentSession.skill} Assessment • Question {currentQuestionIdx + 1} of {assessmentSession.questions.length}
            </span>
            <h2 className="text-base font-bold text-[#1E2022]">
              Conceptual & Applied Verification
            </h2>
          </div>

          <button
            onClick={closeAssessment}
            className="text-xs font-semibold text-[#5A6065] hover:text-[#1E2022]"
          >
            Cancel
          </button>
        </div>

        {/* Question Card */}
        <div className="rounded-2xl border border-[#E5E5DE] bg-white p-6 shadow-2xs space-y-5">
          <div className="space-y-2">
            <span className="rounded bg-[#E2ECE9] px-2 py-0.5 font-mono text-[10px] font-bold text-[#183B32] uppercase">
              Topic: {currentQuestion.topic || assessmentSession.skill}
            </span>
            <p className="text-sm font-semibold text-[#1E2022] leading-relaxed">
              {currentQuestion.question}
            </p>
          </div>

          {/* Options */}
          <div className="space-y-2.5 pt-2">
            {currentQuestion.options.map((opt, optIdx) => {
              const isSelected = selectedOptionIdx === optIdx;

              return (
                <button
                  key={optIdx}
                  onClick={() => handleSelectOption(optIdx)}
                  className={`flex w-full items-start justify-between rounded-xl border p-3.5 text-left text-xs transition-all ${
                    isSelected
                      ? 'border-[#183B32] bg-[#E2ECE9] font-semibold text-[#183B32] shadow-2xs'
                      : 'border-[#E5E5DE] bg-[#FBFBF9] text-[#33373B] hover:bg-[#F4F4F0]'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <span className="font-mono text-xs font-bold text-[#5A6065]">
                      {String.fromCharCode(65 + optIdx)}.
                    </span>
                    <span>{opt}</span>
                  </div>
                  {isSelected && <Check className="h-4 w-4 text-[#183B32] shrink-0 ml-2" />}
                </button>
              );
            })}
          </div>

          {/* Bottom Actions */}
          <div className="flex items-center justify-between border-t border-[#F4F4F0] pt-4">
            <span className="text-[11px] text-[#8C949D]">
              Choose one option to proceed
            </span>

            <button
              onClick={handleNextOrSubmit}
              disabled={selectedOptionIdx === null}
              className="inline-flex items-center gap-2 rounded-xl bg-[#183B32] px-5 py-2 text-xs font-bold text-white shadow-xs hover:bg-[#15342C] disabled:opacity-40 transition-all"
            >
              <span>{isLastQuestion ? 'Submit Assessment' : 'Next Question'}</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 3. Completed Assessment Result Card
  const result = latestAssessmentResult || assessmentSession.result;

  return (
    <div className="space-y-6 max-w-3xl mx-auto animate-in fade-in">
      <div className="rounded-2xl border border-[#183B32] bg-[#E2ECE9]/50 p-6 shadow-2xs text-center space-y-4">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#183B32] text-white">
          <Award className="h-7 w-7 text-[#A3E635]" />
        </div>

        <div>
          <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#183B32]">
            Assessment Completed
          </span>
          <h2 className="mt-1 text-2xl font-bold text-[#1E2022]">
            {result?.skill} Skill Depth: {result?.score}%
          </h2>
          <p className="mt-1 text-xs text-[#5A6065]">
            Verified Demonstrated Level • {result?.correctCount} of {result?.totalQuestions} questions correct
          </p>
        </div>

        {/* Scores & Feedback Grid */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 text-left pt-2">
          <div className="rounded-xl border border-[#E5E5DE] bg-white p-4">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#183B32]">
              <CheckCircle2 className="h-4 w-4" />
              <span>Strong Conceptual Areas</span>
            </div>
            <ul className="mt-2 list-disc list-inside text-xs text-[#33373B] space-y-1">
              {result?.strongAreas.map((area, i) => (
                <li key={i}>{area}</li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl border border-[#E5E5DE] bg-white p-4">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#D96B27]">
              <Zap className="h-4 w-4" />
              <span>Recommended Next Step</span>
            </div>
            <p className="mt-2 text-xs text-[#33373B] leading-relaxed">
              {result?.recommendedNextMilestone}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-3 border-t border-[#CBDAD5]">
          <button
            onClick={() => setActiveTab('roadmap')}
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#183B32] px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-[#15342C]"
          >
            <span>View Updated Roadmap</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>

          <button
            onClick={closeAssessment}
            className="rounded-xl border border-[#CCD0D5] bg-white px-4 py-2 text-xs font-semibold text-[#1E2022] hover:bg-[#FBFBF9]"
          >
            Take Another Assessment
          </button>
        </div>
      </div>
    </div>
  );
};
