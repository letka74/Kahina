import React, { useState } from 'react';
import { RefreshCw, Trophy, ArrowRight, Check, X, HelpCircle, Volume2 } from 'lucide-react';
import { speakText } from '../utils/audio';
import { motion } from 'motion/react';

interface PuzzleItem {
  id: number;
  wordName: string; // "موز"
  clueText: string; // "_وز"
  correctLetter: string; // "م"
  distractors: string[]; // ["ب", "س"]
  emoji: string;
  hintSentence: string; // "موز مغذي ولذيذ"
}

const PUZZLES: PuzzleItem[] = [
  {
    id: 1,
    wordName: "مَوْز",
    clueText: "ـوْز",
    correctLetter: "م",
    distractors: ["ب", "س"],
    emoji: "🍌",
    hintSentence: "مَوْز"
  },
  {
    id: 2,
    wordName: "سَمَكَة",
    clueText: "ـمَكَة",
    correctLetter: "س",
    distractors: ["ش", "ت"],
    emoji: "🐟",
    hintSentence: "سَمَكَة تسبح بالماء"
  },
  {
    id: 3,
    wordName: "صُنْدُوق",
    clueText: "ـنْدُوق",
    correctLetter: "ص",
    distractors: ["س", "ق"],
    emoji: "📦",
    hintSentence: "صُنْدُوق ألعاب ملون"
  },
  {
    id: 4,
    wordName: "هَاتِف",
    clueText: "ـاتِف",
    correctLetter: "هـ",
    distractors: ["ف", "أ"],
    emoji: "📱",
    hintSentence: "هَاتِف ذكي"
  },
  {
    id: 5,
    wordName: "فَرَاشَة",
    clueText: "ـرَاشَة",
    correctLetter: "ف",
    distractors: ["ق", "ر"],
    emoji: "🦋",
    hintSentence: "فَرَاشَة جميلة تطير"
  },
  {
    id: 6,
    wordName: "أَسَد",
    clueText: "ـسَد",
    correctLetter: "أ",
    distractors: ["ب", "ت"],
    emoji: "🦁",
    hintSentence: "أَسَد ملك الغابة"
  },
  {
    id: 7,
    wordName: "بَطَّة",
    clueText: "ـطَّة",
    correctLetter: "ب",
    distractors: ["ت", "م"],
    emoji: "🦆",
    hintSentence: "بَطَّة صفراء جميلة"
  },
  {
    id: 8,
    wordName: "تُفَّاحَة",
    clueText: "ـفَّاحَة",
    correctLetter: "ت",
    distractors: ["ج", "ب"],
    emoji: "🍎",
    hintSentence: "تُفَّاحَة حمراء لذيذة"
  },
  {
    id: 9,
    wordName: "جَمَل",
    clueText: "ـمَل",
    correctLetter: "ج",
    distractors: ["ح", "خ"],
    emoji: "🐫",
    hintSentence: "جَمَل سفينة الصحراء"
  },
  {
    id: 10,
    wordName: "رُمَّان",
    clueText: "ـمَّان",
    correctLetter: "ر",
    distractors: ["ز", "د"],
    emoji: "🍓",
    hintSentence: "رُمَّان لذيذ ومغذي"
  },
  {
    id: 11,
    wordName: "كَلْب",
    clueText: "ـلْب",
    correctLetter: "ك",
    distractors: ["ق", "ل"],
    emoji: "🐶",
    hintSentence: "كَلْب صديق وفي"
  },
  {
    id: 12,
    wordName: "خَرُوف",
    clueText: "ـرُوف",
    correctLetter: "خ",
    distractors: ["ح", "ج"],
    emoji: "🐑",
    hintSentence: "خَرُوف العيد الصغير"
  },
  {
    id: 13,
    wordName: "طَائِرَة",
    clueText: "ـائِرَة",
    correctLetter: "ط",
    distractors: ["ت", "ص"],
    emoji: "✈️",
    hintSentence: "طَائِرَة تطير بالجو"
  },
  {
    id: 14,
    wordName: "قَمَر",
    clueText: "ـمَر",
    correctLetter: "ق",
    distractors: ["ك", "ف"],
    emoji: "🌙",
    hintSentence: "قَمَر ينير في الليل"
  },
  {
    id: 15,
    wordName: "شَمْس",
    clueText: "ـمْس",
    correctLetter: "ش",
    distractors: ["س", "ص"],
    emoji: "☀️",
    hintSentence: "شَمْس دافئة مشرقة"
  },
  {
    id: 16,
    wordName: "زَرَافَة",
    clueText: "ـرَافَة",
    correctLetter: "ز",
    distractors: ["ر", "د"],
    emoji: "🦒",
    hintSentence: "زَرَافَة رقبتها طويلة"
  },
  {
    id: 17,
    wordName: "لَيْمُون",
    clueText: "ـيْمُون",
    correctLetter: "ل",
    distractors: ["ن", "م"],
    emoji: "🍋",
    hintSentence: "لَيْمُون حامض ومفيد"
  },
  {
    id: 18,
    wordName: "نَجْمَة",
    clueText: "ـجْمَة",
    correctLetter: "ن",
    distractors: ["م", "ب"],
    emoji: "⭐",
    hintSentence: "نَجْمَة تلمع في السماء"
  },
  {
    id: 19,
    wordName: "بَيْت",
    clueText: "ـيْت",
    correctLetter: "ب",
    distractors: ["ت", "ن"],
    emoji: "🏠",
    hintSentence: "بَيْت دافئ وجميل"
  },
  {
    id: 20,
    wordName: "قَلَم",
    clueText: "ـلَم",
    correctLetter: "ق",
    distractors: ["ك", "ج"],
    emoji: "✏️",
    hintSentence: "قَلَم نكتب به الدروس"
  },
  {
    id: 21,
    wordName: "صُورَة",
    clueText: "ـورَة",
    correctLetter: "ص",
    distractors: ["س", "ش"],
    emoji: "🖼️",
    hintSentence: "صُورَة معلقة على الجدار"
  },
  {
    id: 22,
    wordName: "ضَفْدَع",
    clueText: "ـفْدَع",
    correctLetter: "ض",
    distractors: ["ص", "ط"],
    emoji: "🐸",
    hintSentence: "ضَفْدَع يقفز في البركة"
  },
  {
    id: 23,
    wordName: "غَزَال",
    clueText: "ـزَال",
    correctLetter: "غ",
    distractors: ["ع", "خ"],
    emoji: "🦌",
    hintSentence: "غَزَال سريع ولطيف"
  },
  {
    id: 24,
    wordName: "عَيْن",
    clueText: "ـيْن",
    correctLetter: "ع",
    distractors: ["غ", "ح"],
    emoji: "👁️",
    hintSentence: "عَيْن نرى بها الأشياء"
  },
  {
    id: 25,
    wordName: "حِصَان",
    clueText: "ـصَان",
    correctLetter: "ح",
    distractors: ["خ", "ج"],
    emoji: "🐎",
    hintSentence: "حِصَان عربي سريع"
  },
  {
    id: 26,
    wordName: "وَرْدَة",
    clueText: "ـرْدَة",
    correctLetter: "و",
    distractors: ["ي", "ر"],
    emoji: "🌹",
    hintSentence: "وَرْدَة حمراء عطرة"
  },
  {
    id: 27,
    wordName: "يَد",
    clueText: "ـد",
    correctLetter: "ي",
    distractors: ["و", "أ"],
    emoji: "🖐️",
    hintSentence: "يَد نلوح بها للأصدقاء"
  },
  {
    id: 28,
    wordName: "جَزَر",
    clueText: "ـزَر",
    correctLetter: "ج",
    distractors: ["خ", "ح"],
    emoji: "🥕",
    hintSentence: "جَزَر يقوي النظر"
  },
  {
    id: 29,
    wordName: "مِفْتَاح",
    clueText: "ـفْتَاح",
    correctLetter: "م",
    distractors: ["ب", "ف"],
    emoji: "🔑",
    hintSentence: "مِفْتَاح لفتح الأبواب"
  },
  {
    id: 30,
    wordName: "كُرْسِي",
    clueText: "ـرْسِي",
    correctLetter: "ك",
    distractors: ["ق", "ت"],
    emoji: "🪑",
    hintSentence: "كُرْسِي خشبي صغير"
  }
];

interface Props {
  onBack: () => void;
}

export default function WordGame({ onBack }: Props) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const currentPuzzle = PUZZLES[currentIdx];

  // Merge correct and distractors
  const rawChoices = currentPuzzle ? [currentPuzzle.correctLetter, ...currentPuzzle.distractors] : [];
  // Stable deterministic sorting
  const choices = currentIdx % 2 === 0 ? rawChoices : [...rawChoices].reverse();

  const handleLetterClick = async (letter: string) => {
    if (selectedLetter) return;
    setSelectedLetter(letter);

    const isCorrect = letter === currentPuzzle.correctLetter;
    if (isCorrect) {
      setScore(s => s + 1);
      await speakText(`رائع! حرف ال ${letter} يكمل الكلمة لتصبح ${currentPuzzle.wordName}`);
    } else {
      await speakText(`حاول ثانية! ابحث عن الحرف الصحيح`);
    }
  };

  const handleNext = () => {
    setSelectedLetter(null);
    if (currentIdx + 1 < PUZZLES.length) {
      setCurrentIdx(currentIdx + 1);
    } else {
      setIsFinished(true);
    }
  };

  const handleSpeakWord = () => {
    speakText(currentPuzzle.wordName);
  };

  const handleReset = () => {
    setCurrentIdx(0);
    setSelectedLetter(null);
    setScore(0);
    setIsFinished(false);
  };

  return (
    <div id="word-game-container" className="flex flex-col h-full bg-[#FFFBEB] rounded-3xl overflow-hidden relative">
      {/* Top Header */}
      <div className="bg-amber-500 text-white py-4 px-6 flex items-center justify-between shadow-md">
        <button 
          id="btn-word-game-back"
          onClick={onBack} 
          className="text-white hover:bg-amber-600 font-bold px-3 py-1.5 rounded-xl border border-white/20 text-sm transition"
        >
          عودة للتمارين
        </button>
        <span className="font-bold text-lg">أكمل الحرف الناقص</span>
        <div className="text-sm bg-amber-600/50 px-3 py-1 rounded-full font-mono">
          {isFinished ? `${PUZZLES.length}/${PUZZLES.length}` : `${currentIdx + 1} / ${PUZZLES.length}`}
        </div>
      </div>

      {!isFinished ? (
        <div className="flex-1 p-6 flex flex-col justify-between items-center overflow-y-auto">
          {/* Main Card View */}
          <div className="w-full text-center space-y-4">
            <h3 className="text-amber-800 font-bold text-sm">اختر الحرف الأول الصحيح ليكتمل اسم الشكل</h3>
            
            <div className="bg-white rounded-3xl p-6 border-3 border-amber-200 shadow-lg flex flex-col items-center gap-4 relative">
              <span className="text-7xl animate-float">{currentPuzzle.emoji}</span>
              
              {/* Word with blank slot */}
              <div className="flex items-center gap-1 mt-2">
                <span className="text-4xl font-extrabold text-amber-500 border-b-4 border-dashed border-amber-300 w-12 pb-1 inline-block text-center bg-amber-50 rounded-xl">
                  {selectedLetter ? selectedLetter : "?"}
                </span>
                <span className="text-4xl font-black text-slate-800">
                  {currentPuzzle.clueText}
                </span>
              </div>

              <button
                id="btn-play-sound-word"
                onClick={handleSpeakWord}
                className="text-slate-500 hover:text-amber-500 hover:bg-amber-50 p-2 rounded-full transition"
                title="استمع للكلمة"
              >
                <Volume2 size={24} />
              </button>
            </div>
          </div>

          {/* Letter Choices grid */}
          <div className="w-full flex justify-center gap-4 justify-items-center my-6">
            {choices.map((letter, i) => {
              const matchesCorrect = letter === currentPuzzle.correctLetter;
              const isChosen = selectedLetter === letter;
              const modeAnswered = selectedLetter !== null;

              let btnStyle = "bg-white border-amber-200 text-amber-600 hover:border-amber-400";
              if (modeAnswered) {
                if (matchesCorrect) {
                  btnStyle = "bg-emerald-500 border-emerald-600 text-white shadow-emerald-200";
                } else if (isChosen) {
                  btnStyle = "bg-rose-500 border-rose-600 text-white shadow-rose-200";
                } else {
                  btnStyle = "bg-slate-100 border-slate-200 text-slate-400 opacity-50";
                }
              }

              return (
                <motion.button
                  key={i}
                  id={`btn-letter-choice-${i}`}
                  disabled={modeAnswered}
                  onClick={() => handleLetterClick(letter)}
                  whileHover={!modeAnswered ? { scale: 1.1, y: -4 } : {}}
                  whileTap={!modeAnswered ? { scale: 0.95 } : {}}
                  className={`w-16 h-16 rounded-full border-3 text-3xl font-black flex items-center justify-center shadow-md transition-all ${btnStyle}`}
                >
                  {letter}
                </motion.button>
              );
            })}
          </div>

          {/* Next Button Container */}
          <div className="w-full">
            {selectedLetter && (
              <motion.button
                id="btn-next-puzzle"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={handleNext}
                className="w-full bg-amber-500 text-white hover:bg-amber-600 font-bold py-3 px-6 rounded-2xl flex items-center justify-center gap-2 shadow-md shadow-amber-500/20"
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
            className="w-24 h-24 bg-amber-100 text-amber-500 rounded-full flex items-center justify-center shadow-inner"
          >
            <Trophy size={48} />
          </motion.div>
          
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-slate-800">مبارك النجاح!</h2>
            <p className="text-slate-600">أنهيت تمرين إكمال الكلمات باحترافية</p>
          </div>

          <div className="bg-amber-100/60 p-4 rounded-2xl w-full max-w-xs space-y-2">
            <div className="flex justify-between text-slate-700 font-bold">
              <span>معدل الدقة:</span>
              <span className="text-amber-700">{score} من {PUZZLES.length}</span>
            </div>
            <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
              <div 
                className="bg-amber-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${(score / PUZZLES.length) * 100}%` }}
              />
            </div>
          </div>

          <div className="flex flex-col gap-2 w-full max-w-xs">
            <button
              id="btn-restart-word-game"
              onClick={handleReset}
              className="bg-amber-500 text-white hover:bg-amber-600 font-bold py-3 rounded-2xl flex items-center justify-center gap-2 transition"
            >
              <RefreshCw size={18} />
              ألعب مجدداً
            </button>
            <button
              id="btn-back-to-exercises-from-word-game"
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
