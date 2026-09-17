import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AudioPlayer } from '../ui/AudioPlayer';
import { VoiceButton } from '../ui/VoiceButton';
import { 
  Mic2, 
  Sparkles, 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  Award, 
  Loader2,
  BookOpen,
  Zap,
  Target,
  GitBranch,
  X
} from 'lucide-react';

export const InterviewView: React.FC = () => {
  const {
    interviewSession,
    startInterview,
    submitInterviewAnswer,
    nextInterviewQuestion,
    endInterview,
    isEvaluatingInterview,
    language,
    profile,
    setActiveTab,
  } = useApp();

  const [currentAnswer, setCurrentAnswer] = useState('');
  const [targetRole, setTargetRole] = useState(profile?.targetRole || 'Backend Developer');

  // Initial State: Start Interview Callout
  if (!interviewSession) {
    return (
      <div className="space-y-6 max-w-3xl mx-auto">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#1E2022]">
            AI Mock Technical & Role Interview
          </h1>
          <p className="mt-1 text-xs text-[#5A6065]">
            Target: <strong className="text-[#183B32]">{targetRole}</strong> • Calibrated to your demonstrated skills & role requirements
          </p>
        </div>

        {/* Start Interview Card */}
        <div className="rounded-2xl border border-[#E5E5DE] bg-white p-6 shadow-xs space-y-5">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E2ECE9] text-[#183B32] shrink-0">
              <Mic2 className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#1E2022]">
                Interactive AI Practice Coach
              </h2>
              <p className="mt-1 text-xs text-[#5A6065] leading-relaxed">
                Experience dynamic technical and behavioral interview questions generated on-demand by Groq AI. Answer via text or speech, and receive structured rubric feedback with actionable improvements.
              </p>
            </div>
          </div>

          <div className="border-t border-[#F4F4F0] pt-4">
            <label className="block text-xs font-semibold text-[#5A6065]">Target Role to Practice</label>
            <div className="mt-1.5 flex gap-2">
              <input
                type="text"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                placeholder="e.g. Backend Developer"
                className="flex-1 rounded-xl border border-[#CCD0D5] bg-[#FBFBF9] px-3.5 py-2 text-xs font-semibold text-[#1E2022] focus:border-[#183B32] focus:bg-white focus:outline-hidden"
              />
              <button
                onClick={() => startInterview(targetRole)}
                disabled={isEvaluatingInterview}
                className="inline-flex items-center gap-2 rounded-xl bg-[#183B32] px-6 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-[#15342C] transition-all disabled:opacity-75"
              >
                <Sparkles className="h-4 w-4 text-[#A3E635]" />
                <span>{isEvaluatingInterview ? 'Generating Question...' : 'Start Mock Interview'}</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 pt-2 text-[11px] text-[#5A6065]">
            <div className="flex items-center gap-2 rounded-lg bg-[#F8FAF9] p-2.5 border border-[#E5E5DE]">
              <Target className="h-4 w-4 text-[#183B32]" />
              <span>Real Architecture & Scenario Prompts</span>
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-[#F8FAF9] p-2.5 border border-[#E5E5DE]">
              <Zap className="h-4 w-4 text-[#D96B27]" />
              <span>Instant Scoring & Gap Identification</span>
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-[#F8FAF9] p-2.5 border border-[#E5E5DE]">
              <Award className="h-4 w-4 text-[#183B32]" />
              <span>Exemplar Model Answers</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentQ = interviewSession.questions[interviewSession.currentQuestionIndex];
  const evalResult = currentQ?.evaluation;
  const isFinished = interviewSession.status === 'completed';

  const handleSubmit = async () => {
    if (!currentAnswer.trim()) return;
    await submitInterviewAnswer(currentAnswer);
  };

  const handleNext = async () => {
    setCurrentAnswer('');
    await nextInterviewQuestion();
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Top Session Status */}
      <div className="flex items-center justify-between border-b border-[#E5E5DE] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded bg-[#E2ECE9] px-2 py-0.5 font-mono text-xs font-bold text-[#183B32]">
              {interviewSession.role}
            </span>
            <span className="text-xs text-[#6B7280]">
              Question {(interviewSession.currentQuestionIndex || 0) + 1} of {Math.max(interviewSession.questions.length, 3)}
            </span>
          </div>
        </div>

        <button
          onClick={endInterview}
          className="flex items-center gap-1 text-xs font-medium text-[#5A6065] hover:text-[#1E2022]"
        >
          <X className="h-3.5 w-3.5" />
          <span>Exit Session</span>
        </button>
      </div>

      {!isFinished ? (
        <div className="space-y-5">
          {/* Question Card */}
          <div className="rounded-2xl border border-[#E5E5DE] bg-white p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#D96B27]">
                Interviewer Question
              </span>
              <AudioPlayer
                textToRead={language === 'hi' && currentQ.questionHi ? currentQ.questionHi : currentQ.question}
              />
            </div>

            <h2 className="text-base font-bold text-[#1E2022] leading-snug">
              {language === 'hi' && currentQ.questionHi ? currentQ.questionHi : currentQ.question}
            </h2>

            {currentQ.expectedKeyPoints && (
              <div className="rounded-lg bg-[#FBFBF9] p-3 text-xs text-[#5A6065] border border-[#E5E5DE]">
                <div className="font-semibold text-[#1E2022]">Key concept areas expected:</div>
                <div className="mt-1 flex flex-wrap gap-1.5">
                  {currentQ.expectedKeyPoints.map((pt, i) => (
                    <span key={i} className="rounded bg-white px-2 py-0.5 text-[11px] border border-[#CCD0D5]">
                      {pt}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User Answer Input or Result */}
          {!evalResult ? (
            <div className="rounded-2xl border border-[#E5E5DE] bg-white p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-[#1E2022]">Your Response</label>
                <VoiceButton
                  label="Dictate Answer"
                  onTranscript={(text) => setCurrentAnswer((prev) => (prev ? `${prev} ${text}` : text))}
                />
              </div>

              <textarea
                rows={5}
                value={currentAnswer}
                onChange={(e) => setCurrentAnswer(e.target.value)}
                placeholder="Type your response or click Dictate Answer to speak..."
                className="w-full rounded-xl border border-[#CCD0D5] bg-[#FBFBF9] p-3.5 text-xs text-[#1E2022] placeholder:text-[#8C949D] focus:border-[#183B32] focus:bg-white focus:outline-hidden leading-relaxed"
              />

              <div className="flex items-center justify-between">
                <span className="text-[11px] text-[#6B7280]">
                  {currentAnswer.length} characters
                </span>

                <button
                  onClick={handleSubmit}
                  disabled={isEvaluatingInterview || !currentAnswer.trim()}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-[#183B32] px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-[#15342C] disabled:opacity-50 transition-all"
                >
                  {isEvaluatingInterview ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Evaluating with Groq AI...</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      <span>Submit Answer for Evaluation</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            /* Detailed Rubric Evaluation Report */
            <div className="space-y-4 animate-in fade-in duration-300">
              {/* Score breakdown metrics */}
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <div className="rounded-xl border border-[#E5E5DE] bg-white p-3 text-center">
                  <div className="text-[10px] font-bold text-[#5A6065] uppercase">Technical Accuracy</div>
                  <div className="mt-1 font-mono text-xl font-bold text-[#183B32]">
                    {evalResult.technicalAccuracyScore}%
                  </div>
                </div>

                <div className="rounded-xl border border-[#E5E5DE] bg-white p-3 text-center">
                  <div className="text-[10px] font-bold text-[#5A6065] uppercase">Communication</div>
                  <div className="mt-1 font-mono text-xl font-bold text-[#183B32]">
                    {evalResult.communicationScore}%
                  </div>
                </div>

                <div className="rounded-xl border border-[#E5E5DE] bg-white p-3 text-center">
                  <div className="text-[10px] font-bold text-[#5A6065] uppercase">Structure</div>
                  <div className="mt-1 font-mono text-xl font-bold text-[#183B32]">
                    {evalResult.structureScore}%
                  </div>
                </div>

                <div className="rounded-xl border border-[#E5E5DE] bg-white p-3 text-center">
                  <div className="text-[10px] font-bold text-[#5A6065] uppercase">Confidence</div>
                  <div className="mt-1 font-mono text-xl font-bold text-[#183B32]">
                    {evalResult.confidenceScore}%
                  </div>
                </div>
              </div>

              {/* Strong Points & Missing Points */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-[#E2ECE9] bg-[#F8FAF9] p-4 text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-[#183B32]">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Strong Points Demonstrated</span>
                  </div>
                  <ul className="mt-2 space-y-1.5 text-[#1F4D42]">
                    {evalResult.whatWentWell.map((w, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span>✓</span>
                        <span>{w}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-xl border border-[#FED7AA] bg-[#FFF4EC] p-4 text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-[#D96B27]">
                    <AlertCircle className="h-4 w-4" />
                    <span>Missing Concepts / Improvements</span>
                  </div>
                  <ul className="mt-2 space-y-1.5 text-[#9A3412]">
                    {evalResult.whatWasMissing.map((m, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span>△</span>
                        <span>{m}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Better Structure & Improvement */}
              {evalResult.howToImprove && (
                <div className="rounded-xl border border-[#E5E5DE] bg-white p-4 text-xs space-y-2">
                  <div className="font-bold text-[#1E2022] flex items-center gap-1.5">
                    <Zap className="h-4 w-4 text-[#183B32]" />
                    <span>How to Structure Better:</span>
                  </div>
                  <p className="text-[#5A6065] leading-relaxed">
                    {evalResult.howToImprove}
                  </p>
                </div>
              )}

              {/* Exemplar Model Answer */}
              <div className="rounded-xl border border-[#E5E5DE] bg-white p-4 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-bold text-[#1E2022]">
                    <BookOpen className="h-4 w-4 text-[#183B32]" />
                    <span>Ideal Model Answer</span>
                  </div>
                  <AudioPlayer textToRead={evalResult.idealAnswer} />
                </div>
                <p className="text-[#5A6065] leading-relaxed whitespace-pre-line">
                  {evalResult.idealAnswer}
                </p>
              </div>

              {/* Actionable Next Step */}
              <div className="flex items-center justify-between border-t border-[#E5E5DE] pt-4">
                <span className="text-xs text-[#5A6065]">
                  Question evaluation complete.
                </span>

                <button
                  onClick={handleNext}
                  disabled={isEvaluatingInterview}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-[#183B32] px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-[#15342C] transition-all disabled:opacity-75"
                >
                  <span>{isEvaluatingInterview ? 'Loading...' : (interviewSession.currentQuestionIndex || 0) >= 2 ? 'Finish Interview' : 'Next Question'}</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Final Interview Report per Requirement 7 */
        <div className="rounded-2xl border border-[#E5E5DE] bg-white p-6 shadow-xs space-y-6 animate-in fade-in">
          <div className="text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#E2ECE9] text-[#183B32]">
              <Award className="h-7 w-7" />
            </div>
            <h2 className="mt-3 text-xl font-bold text-[#1E2022]">Interview Completed</h2>
            <p className="mt-1 text-xs text-[#5A6065]">
              Performance breakdown for {interviewSession.role}
            </p>
          </div>

          {/* 1. Overall Score */}
          <div className="mx-auto max-w-xs rounded-2xl border border-[#E2ECE9] bg-[#F8FAF9] p-4 text-center">
            <span className="text-[10px] font-bold uppercase text-[#5A6065]">Overall Score</span>
            <div className="mt-1 font-mono text-4xl font-bold text-[#183B32]">
              {interviewSession.finalReport?.overallReadiness || 78}%
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 text-xs">
            {/* 2. Key Strengths */}
            <div className="rounded-xl border border-[#E2ECE9] bg-[#F8FAF9] p-4 space-y-2">
              <div className="font-bold text-[#183B32] flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4" />
                <span>Key Strengths</span>
              </div>
              <ul className="space-y-1 text-[#1F4D42]">
                {(interviewSession.finalReport?.strengths || ['Clear communication of concepts', 'Solid foundational understanding']).map((s, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span>✓</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 3. Priority Areas to Study */}
            <div className="rounded-xl border border-[#FED7AA] bg-[#FFF4EC] p-4 space-y-2">
              <div className="font-bold text-[#D96B27] flex items-center gap-1.5">
                <AlertCircle className="h-4 w-4" />
                <span>Priority Areas to Study</span>
              </div>
              <ul className="space-y-1 text-[#9A3412]">
                {(interviewSession.finalReport?.areasToImprove || ['Edge case handling in distributed scenarios', 'Quantitative performance trade-offs']).map((a, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span>△</span>
                    <span>{a}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* 4. Recommended Roadmap Submodules to Revisit */}
          <div className="rounded-xl border border-[#E5E5DE] bg-[#FBFBF9] p-4 text-xs space-y-2 text-left">
            <div className="font-bold text-[#1E2022] flex items-center gap-1.5">
              <GitBranch className="h-4 w-4 text-[#183B32]" />
              <span>Recommended Roadmap Submodules to Revisit</span>
            </div>
            <ul className="space-y-1.5 text-[#5A6065]">
              {(interviewSession.finalReport?.recommendedSubmodules || ['PostgreSQL Schema Design & Constraints', 'SQL Indexing & Query Plan Optimization']).map((sub, i) => (
                <li key={i} className="flex items-center justify-between gap-2 border-b border-[#E5E5DE] pb-1 last:border-b-0">
                  <span>• {sub}</span>
                  <button
                    onClick={() => setActiveTab('roadmap')}
                    className="font-semibold text-[#183B32] hover:underline"
                  >
                    Open in Roadmap →
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex justify-center gap-3 pt-2">
            <button
              onClick={endInterview}
              className="rounded-xl bg-[#183B32] px-6 py-2.5 text-xs font-bold text-white hover:bg-[#15342C] transition-colors"
            >
              Back to Interview Dashboard
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
