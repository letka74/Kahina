import React, { useState, useEffect } from 'react';
import { RefreshCw, Trophy, ArrowRight, Volume2, HelpCircle } from 'lucide-react';
import { speakText } from '../utils/audio';
import { motion } from 'motion/react';

interface SyllablePuzzle {
  id: number;
  wordName: string; // "بَيْت"
  syllables: string[]; // ["بَـ", "يْـ", "ت"]
  correctSequence: string[]; // ["بَـ", "يْـ", "ت"]
  emoji: string;
}

const SYLLABLE_PUZZLES: SyllablePuzzle[] = [
  {
    id: 1,
    wordName: "بَيْت",
    syllables: ["يْـ", "بَـ", "ت"],
    correctSequence: ["بَـ", "يْـ", "ت"],
    emoji: "🏠"
  },
  {
    id: 2,
    wordName: "قَلَم",
    syllables: ["لَـ", "قَـ", "مْ"],
    correctSequence: ["قَـ", "لَـ", "مْ"],
    emoji: "✏️"
  },
  {
    id: 3,
    wordName: "بَطَّة",
    syllables: ["طَـ", "بَـ", "ة"],
    correctSequence: ["بَـ", "طَـ", "ة"],
    emoji: "🦆"
  },
  {
    id: 4,
    wordName: "جَمَل",
    syllables: ["مَـ", "لْ", "جَـ"],
    correctSequence: ["جَـ", "مَـ", "لْ"],
    emoji: "🐫"
  },
  {
    id: 5,
    wordName: "مَوْز",
    syllables: ["وْ", "مَـ", "زْ"],
    correctSequence: ["مَـ", "وْ", "زْ"],
    emoji: "🍌"
  },
  {
    id: 6,
    wordName: "أَسَد",
    syllables: ["سَـ", "أَ", "دْ"],
    correctSequence: ["أَ", "سَـ", "دْ"],
    emoji: "🦁"
  },
  {
    id: 7,
    wordName: "رُمَّان",
    syllables: ["مَّا", "رُ", "نْ"],
    correctSequence: ["رُ", "مَّا", "نْ"],
    emoji: "🍓"
  },
  {
    id: 8,
    wordName: "كَلْب",
    syllables: ["لْـ", "كَـ", "بْ"],
    correctSequence: ["كَـ", "لْـ", "بْ"],
    emoji: "🐶"
  },
  {
    id: 9,
    wordName: "جَزَر",
    syllables: ["زَ", "جَـ", "رْ"],
    correctSequence: ["جَـ", "زَ", "رْ"],
    emoji: "🥕"
  },
  {
    id: 10,
    wordName: "فَرَس",
    syllables: ["رَ", "فَـ", "سْ"],
    correctSequence: ["فَـ", "رَ", "سْ"],
    emoji: "🐎"
  },
  {
    id: 11,
    wordName: "شَمْس",
    syllables: ["مْـ", "شَـ", "سْ"],
    correctSequence: ["شَـ", "مْـ", "سْ"],
    emoji: "☀️"
  },
  {
    id: 12,
    wordName: "قَمَر",
    syllables: ["مَـ", "قَـ", "رْ"],
    correctSequence: ["قَـ", "مَـ", "رْ"],
    emoji: "🌙"
  },
  {
    id: 13,
    wordName: "وَرَد",
    syllables: ["رَ", "وَ", "دْ"],
    correctSequence: ["وَ", "رَ", "دْ"],
    emoji: "🌹"
  },
  {
    id: 14,
    wordName: "لَبَن",
    syllables: ["بَـ", "لَـ", "نْ"],
    correctSequence: ["لَـ", "بَـ", "نْ"],
    emoji: "🥛"
  },
  {
    id: 15,
    wordName: "بَلَد",
    syllables: ["لَـ", "بَـ", "دْ"],
    correctSequence: ["بَـ", "لَـ", "دْ"],
    emoji: "🗺️"
  },
  {
    id: 16,
    wordName: "جَبَل",
    syllables: ["بَـ", "جَـ", "لْ"],
    correctSequence: ["جَـ", "بَـ", "لْ"],
    emoji: "⛰️"
  },
  {
    id: 17,
    wordName: "عَسَل",
    syllables: ["سَـ", "عَـ", "لْ"],
    correctSequence: ["عَـ", "سَـ", "لْ"],
    emoji: "🍯"
  },
  {
    id: 18,
    wordName: "بَصَل",
    syllables: ["صَـ", "بَـ", "لْ"],
    correctSequence: ["بَـ", "صَـ", "لْ"],
    emoji: "🧅"
  },
  {
    id: 19,
    wordName: "جَسَد",
    syllables: ["سَـ", "جَـ", "دْ"],
    correctSequence: ["جَـ", "سَـ", "دْ"],
    emoji: "🧍"
  },
  {
    id: 20,
    wordName: "صَمَد",
    syllables: ["مَـ", "صَـ", "دْ"],
    correctSequence: ["صَـ", "مَـ", "دْ"],
    emoji: "🧱"
  },
  {
    id: 21,
    wordName: "سَمَن",
    syllables: ["مَـ", "سَـ", "نْ"],
    correctSequence: ["سَـ", "مَـ", "نْ"],
    emoji: "🧈"
  },
  {
    id: 22,
    wordName: "زَمَن",
    syllables: ["مَـ", "زَ", "نْ"],
    correctSequence: ["زَ", "مَـ", "نْ"],
    emoji: "⏳"
  },
  {
    id: 23,
    wordName: "قَدَم",
    syllables: ["دَ", "قَـ", "مْ"],
    correctSequence: ["قَـ", "دَ", "مْ"],
    emoji: "🦶"
  },
  {
    id: 24,
    wordName: "هَرَم",
    syllables: ["رَ", "هَـ", "مْ"],
    correctSequence: ["هَـ", "رَ", "مْ"],
    emoji: "🔺"
  },
  {
    id: 25,
    wordName: "كَرَم",
    syllables: ["رَ", "كَـ", "مْ"],
    correctSequence: ["كَـ", "رَ", "مْ"],
    emoji: "🤝"
  },
  {
    id: 26,
    wordName: "فَرَش",
    syllables: ["رَ", "فَـ", "شْ"],
    correctSequence: ["فَـ", "رَ", "شْ"],
    emoji: "🧹"
  },
  {
    id: 27,
    wordName: "مَرَج",
    syllables: ["رَ", "مَـ", "جْ"],
    correctSequence: ["مَـ", "رَ", "جْ"],
    emoji: "🌊"
  },
  {
    id: 28,
    wordName: "مَرَض",
    syllables: ["رَ", "مَـ", "ضْ"],
    correctSequence: ["مَـ", "رَ", "ضْ"],
    emoji: "🤒"
  },
  {
    id: 29,
    wordName: "غَرَض",
    syllables: ["رَ", "غَـ", "ضْ"],
    correctSequence: ["غَـ", "رَ", "ضْ"],
    emoji: "🎯"
  },
  {
    id: 30,
    wordName: "جَرَس",
    syllables: ["رَ", "جَـ", "سْ"],
    correctSequence: ["جَـ", "رَ", "سْ"],
    emoji: "🔔"
  }
];

interface Props {
  onBack: () => void;
}

export default function CompleteWordGame({ onBack }: Props) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedSequence, setSelectedSequence] = useState<string[]>([]);
  const [correctCount, setCorrectCount] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [message, setMessage] = useState<string>("رتب مقاطع الكلمة بشكل صحيح:");
  
  const currentPuzzle = SYLLABLE_PUZZLES[currentIdx];

  // Reset sequence when puzzle index changes
  useEffect(() => {
    setSelectedSequence([]);
    setMessage("رتب مقاطع الكلمة بشكل صحيح:");
  }, [currentIdx]);

  const handleSyllableClick = async (syllable: string) => {
    if (selectedSequence.includes(syllable)) return; // Already clicked
    
    const newSeq = [...selectedSequence, syllable];
    setSelectedSequence(newSeq);

    // Play clicked syllable voice sound
    await speakText(syllable.replace('ـ', ''));

    // If fully selected, verify sequence
    if (newSeq.length === currentPuzzle.syllables.length) {
      const isCorrect = newSeq.every((val, index) => val === currentPuzzle.correctSequence[index]);
      
      if (isCorrect) {
        setCorrectCount(c => c + 1);
        setMessage("أحسنت! ترتيب ممتاز للكلمة ✨");
        await speakText(`أحسنت! الكلمة هي ${currentPuzzle.wordName}`);
      } else {
        setMessage("لم تترتب الكلمة بشكل صحيح، حاول مجدداً!");
        await speakText(`حاول مرة أخرى لتجميع كلمة ${currentPuzzle.wordName}`);
        // Reset sequence after a second
        setTimeout(() => {
          setSelectedSequence([]);
          setMessage("رتب مقاطع الكلمة بشكل صحيح:");
        }, 1500);
      }
    }
  };

  const handleNext = () => {
    if (currentIdx + 1 < SYLLABLE_PUZZLES.length) {
      setCurrentIdx(currentIdx + 1);
    } else {
      setIsFinished(true);
    }
  };

  const handleReset = () => {
    setCurrentIdx(0);
    setSelectedSequence([]);
    setCorrectCount(0);
    setIsFinished(false);
  };

  const isWordCompleteAndCorrect = selectedSequence.length === currentPuzzle?.syllables.length &&
    selectedSequence.every((val, index) => val === currentPuzzle.correctSequence[index]);

  return (
    <div id="syllables-game" className="flex flex-col h-full bg-[#ECFDF5] rounded-3xl overflow-hidden relative">
      {/* Top Header */}
      <div className="bg-emerald-500 text-white py-4 px-6 flex items-center justify-between shadow-md">
        <button 
          id="btn-complete-word-back"
          onClick={onBack} 
          className="text-white hover:bg-emerald-600 font-bold px-3 py-1.5 rounded-xl border border-white/20 text-sm transition"
        >
          عودة للتمارين
        </button>
        <span className="font-bold text-lg">تركيب ومقاطع الكلمات</span>
        <div className="text-sm bg-emerald-600/50 px-3 py-1 rounded-full font-mono">
          {isFinished ? `${SYLLABLE_PUZZLES.length}/${SYLLABLE_PUZZLES.length}` : `${currentIdx + 1} / ${SYLLABLE_PUZZLES.length}`}
        </div>
      </div>

      {!isFinished ? (
        <div className="flex-1 p-6 flex flex-col justify-between items-center overflow-y-auto">
          {/* Picture and prompt */}
          <div className="w-full text-center space-y-3">
            <h4 className="text-emerald-800 font-bold text-sm">{message}</h4>

            {/* Main Picture illustration */}
            <div className="bg-white py-5 px-6 rounded-3xl border-3 border-emerald-200 shadow-md inline-flex flex-col items-center gap-3">
              <span className="text-7xl animate-float">{currentPuzzle.emoji}</span>
              <span className="text-xs text-slate-400 font-bold">اسم الشكل: {currentPuzzle.wordName}</span>
            </div>
          </div>

          {/* Construction slots */}
          <div className="w-full max-w-xs py-4 flex justify-center items-center gap-2 border-b-3 border-dashed border-emerald-200 min-h-16">
            {selectedSequence.map((syllable, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="bg-emerald-500 text-white text-3xl font-extrabold w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg"
              >
                {syllable}
              </motion.div>
            ))}
            {selectedSequence.length === 0 && (
              <span className="text-slate-400 text-sm">اضغط على المقاطع بالترتيب الصحيح ادناه</span>
            )}
          </div>

          {/* Scrambled puzzle Syllables */}
          <div className="w-full flex justify-center gap-4 my-6">
            {currentPuzzle.syllables.map((syllable, i) => {
              const isUsed = selectedSequence.includes(syllable);
              
              return (
                <motion.button
                  key={i}
                  id={`btn-syllable-${i}`}
                  disabled={isUsed}
                  onClick={() => handleSyllableClick(syllable)}
                  whileHover={!isUsed ? { scale: 1.1, y: -2 } : {}}
                  whileTap={!isUsed ? { scale: 0.95 } : {}}
                  className={`w-16 h-16 rounded-2xl border-3 text-2xl font-black flex items-center justify-center shadow-md transition-all ${
                    isUsed 
                    ? "bg-slate-100 border-slate-200 text-slate-300 pointer-events-none opacity-40 shadow-none" 
                    : "bg-white border-emerald-300 text-emerald-600 hover:border-emerald-500 hover:bg-emerald-50 cursor-pointer"
                  }`}
                >
                  {syllable}
                </motion.button>
              );
            })}
          </div>

          {/* Footer controls */}
          <div className="w-full">
            {isWordCompleteAndCorrect && (
              <motion.button
                id="btn-next-syllable-puzzle"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={handleNext}
                className="w-full bg-emerald-500 text-white hover:bg-emerald-600 font-bold py-3.5 px-6 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all font-sans"
              >
                المرحلة التالية
                <ArrowRight size={18} className="rotate-180" />
              </motion.button>
            )}
          </div>
        </div>
      ) : (
        <div className="flex-1 p-6 flex flex-col items-center justify-center text-center space-y-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1, type: 'spring' }}
            className="w-24 h-24 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center shadow-inner"
          >
            <Trophy size={48} />
          </motion.div>
          
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-slate-800">جبار يا بطل!</h2>
            <p className="text-slate-600">أتقنت تجميع المقاطع الصوتية للكلمات بالكامل!</p>
          </div>

          <div className="bg-emerald-100/65 p-4 rounded-2xl w-full max-w-xs space-y-2">
            <div className="flex justify-between text-slate-700 font-bold text-sm">
              <span>تقييم الدقة:</span>
              <span className="text-emerald-700">{correctCount} من {SYLLABLE_PUZZLES.length}</span>
            </div>
            <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
              <div 
                className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${(correctCount / SYLLABLE_PUZZLES.length) * 100}%` }}
              />
            </div>
          </div>

          <div className="flex flex-col gap-2 w-full max-w-xs">
            <button
              id="btn-restart-syllable-game"
              onClick={handleReset}
              className="bg-emerald-500 text-white hover:bg-emerald-600 font-bold py-3 rounded-2xl flex items-center justify-center gap-2 transition"
            >
              <RefreshCw size={18} />
              ألعب مجدداً
            </button>
            <button
              id="btn-back-to-exercises-from-syllable-game"
              onClick={onBack}
              className="bg-slate-200 text-slate-700 hover:bg-slate-300 font-bold py-3 rounded-2xl transition"
            >
              الرجوع للتمارين
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
