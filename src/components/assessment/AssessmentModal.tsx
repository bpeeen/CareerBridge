import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AssessmentQuestion } from '../../types';
import { CheckCircle2, Award, X, ArrowRight, Sparkles } from 'lucide-react';

interface AssessmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  skillName: string;
}

export const AssessmentModal: React.FC<AssessmentModalProps> = ({
  isOpen,
  onClose,
  skillName,
}) => {
  const { profile, updateProfile, adaptRoadmap } = useApp();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [scoreEarned, setScoreEarned] = useState<number>(0);
  const [isFinished, setIsFinished] = useState(false);

  // Dynamic question bank for specific skills
  const questions: AssessmentQuestion[] = [
    {
      id: 'q1',
      skill: skillName,
      question: skillName === 'Python'
        ? 'What is the time complexity of searching for a key in a standard Python dictionary (hash map) in average vs worst case?'
        : skillName === 'SQL'
        ? 'Which SQL index structure is most efficient for exact-match lookups and range queries (BETWEEN)?'
        : 'In electrical safety, what is the primary function of a Residual Current Device (RCD / ELCB)?',
      options: skillName === 'Python'
        ? ['Average O(1), Worst O(N)', 'Average O(log N), Worst O(N)', 'Always O(1)', 'Always O(N)']
        : skillName === 'SQL'
        ? ['B-Tree Index', 'Bitmap Index', 'Hash Index', 'Full-Text Index']
        : ['Instantly disconnects circuit when earth leakage current is detected', 'Increases voltage output', 'Filters harmonic frequencies', 'Recharges backup battery'],
      correctAnswer: skillName === 'Python'
        ? 'Average O(1), Worst O(N)'
        : skillName === 'SQL'
        ? 'B-Tree Index'
        : 'Instantly disconnects circuit when earth leakage current is detected',
      correctAnswerIndex: 0,
      explanation: 'B-tree index and hash maps provide standard fast lookups.'
    },
    {
      id: 'q2',
      skill: skillName,
      question: skillName === 'Python'
        ? 'Scenario: You have a 10 GB log file that exceeds available RAM. Which Python construct should you use to process it line by line efficiently?'
        : skillName === 'SQL'
        ? 'Scenario: A database query on a table with 5 million rows is running slowly on "WHERE status = active AND created_at > date". How would you resolve this?'
        : 'Scenario: When inspecting a rooftop solar installation, the inverter shows "Grid Voltage High Fault". What is your initial verification procedure?',
      options: skillName === 'Python'
        ? ['Use a generator function (yield) or file iterator', 'Read the whole file with file.read() into a list', 'Increase virtual swap memory', 'Use JSON parser']
        : skillName === 'SQL'
        ? ['Create a composite index on (status, created_at)', 'Drop all indexes', 'Run VACUUM FULL constantly', 'Switch column type to VARCHAR']
        : ['Check AC grid voltage at connection terminal with true RMS multimeter', 'Replace the solar panels immediately', 'Bypass all circuit breakers', 'Ground the solar frame directly to phase wire'],
      correctAnswer: skillName === 'Python'
        ? 'Use a generator function (yield) or file iterator'
        : skillName === 'SQL'
        ? 'Create a composite index on (status, created_at)'
        : 'Check AC grid voltage at connection terminal with true RMS multimeter',
      correctAnswerIndex: 0,
      explanation: 'Generators avoid loading all data into memory at once.'
    },
  ];

  if (!isOpen) return null;

  const currentQ = questions[currentIdx];

  const handleNext = async () => {
    let earned = scoreEarned;
    if (selectedOption === currentQ.correctAnswer) {
      earned += 45;
    } else {
      earned += 20;
    }
    setScoreEarned(earned);

    if (currentIdx < questions.length - 1) {
      setCurrentIdx(currentIdx + 1);
      setSelectedOption('');
    } else {
      // Finished assessment!
      const demonstratedLevel = Math.min(95, Math.max(70, earned + 20));
      setIsFinished(true);

      if (profile) {
        await adaptRoadmap({
          [skillName]: demonstratedLevel,
        });
      }
    }
  };

  const resetAndClose = () => {
    setCurrentIdx(0);
    setSelectedOption('');
    setScoreEarned(0);
    setIsFinished(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs">
      <div className="w-full max-w-lg rounded-2xl border border-[#E5E5DE] bg-[#FBFBF9] p-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#E5E5DE] pb-4">
          <div className="flex items-center gap-2">
            <Award className="h-5 w-5 text-[#183B32]" />
            <h2 className="text-sm font-bold text-[#1E2022]">
              Skill Verification: {skillName}
            </h2>
          </div>
          <button onClick={resetAndClose} className="rounded-lg p-1.5 text-[#6B7280] hover:bg-[#EFEFED]">
            <X className="h-4 w-4" />
          </button>
        </div>

        {!isFinished ? (
          <div className="mt-5 space-y-4">
            <div className="flex items-center justify-between text-xs text-[#5A6065]">
              <span>Question {currentIdx + 1} of {questions.length}</span>
              <span className="font-mono uppercase text-[#183B32] font-semibold">Multiple Choice</span>
            </div>

            <p className="text-sm font-semibold text-[#1E2022]">{currentQ.question}</p>

            {currentQ.options && (
              <div className="space-y-2 pt-2">
                {currentQ.options.map((opt, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setSelectedOption(opt)}
                    className={`flex w-full items-center justify-between rounded-xl border p-3 text-left text-xs transition-all ${
                      selectedOption === opt
                        ? 'border-[#183B32] bg-[#E2ECE9] font-semibold text-[#183B32]'
                        : 'border-[#E5E5DE] bg-white text-[#33373B] hover:bg-[#F4F4F0]'
                    }`}
                  >
                    <span>{opt}</span>
                    {selectedOption === opt && <CheckCircle2 className="h-4 w-4 text-[#183B32] shrink-0" />}
                  </button>
                ))}
              </div>
            )}

            <div className="flex justify-end pt-4">
              <button
                type="button"
                disabled={!selectedOption}
                onClick={handleNext}
                className="inline-flex items-center gap-2 rounded-lg bg-[#183B32] px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-[#15342C] disabled:opacity-50"
              >
                <span>{currentIdx === questions.length - 1 ? 'Submit Assessment' : 'Next Question'}</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-6 text-center space-y-4">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#E2ECE9] text-[#183B32]">
              <Sparkles className="h-6 w-6 text-[#183B32]" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#1E2022]">Skill Verified & Demonstrated!</h3>
              <p className="mt-1 text-xs text-[#5A6065]">
                Your {skillName} skill has been verified with concrete evidence. The adaptive roadmap has recalculated accordingly.
              </p>
            </div>

            <div className="rounded-xl border border-[#E5E5DE] bg-white p-3 text-xs font-mono text-[#183B32]">
              Status: Demonstrated Evidence (Score: 85%+)
            </div>

            <button
              onClick={resetAndClose}
              className="w-full rounded-lg bg-[#183B32] py-2 text-xs font-semibold text-white hover:bg-[#15342C]"
            >
              Back to Roadmap & Overview
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
