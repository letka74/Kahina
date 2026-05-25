import React, { useState } from 'react';
import { Volume2, Trophy, ArrowRight, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import { speakText } from '../utils/audio';
import { motion } from 'motion/react';

interface GameItem {
  letter: string;
  instruction: string;
  correctWord: string;
  correctEmoji: string;
  wrongWord: string;
  wrongEmoji: string;
  soundCheck: string;
}

const GAME_QUESTIONS: GameItem[] = [
  {
    letter: "ب",
    instruction: "اختر الكلمة التي تبدأ بصوت الـ ب",
    correctWord: "بَطَّة",
    correctEmoji: "🦆",
    wrongWord: "تُفَّاحَة",
    wrongEmoji: "🍎",
    soundCheck: "باء"
  },
  {
    letter: "س",
    instruction: "اختر الكلمة التي تبدأ بصوت الـ س",
    correctWord: "سَيَّارَة",
    correctEmoji: "🚗",
    wrongWord: "قَمَر",
    wrongEmoji: "🌙",
    soundCheck: "سين"
  },
  {
    letter: "م",
    instruction: "اختر الكلمة التي تبدأ بصوت الـ م",
    correctWord: "مَوْز",
    correctEmoji: "🍌",
    wrongWord: "وَلَد",
    wrongEmoji: "👦",
    soundCheck: "ميم"
  },
  {
    letter: "ف",
    instruction: "اختر الكلمة التي تبدأ بصوت الـ ف",
    correctWord: "فَرَاشَة",
    correctEmoji: "🦋",
    wrongWord: "كِتَاب",
    wrongEmoji: "📖",
    soundCheck: "فاء"
  },
  {
    letter: "ك",
    instruction: "اختر الكلمة التي تبدأ بصوت الـ ك",
    correctWord: "كَلْب",
    correctEmoji: "🐶",
    wrongWord: "دَجَاجَة",
    wrongEmoji: "🐔",
    soundCheck: "كاف"
  },
  {
    letter: "أ",
    instruction: "اختر الكلمة التي تبدأ بصوت الـ أ",
    correctWord: "أَسَد",
    correctEmoji: "🦁",
    wrongWord: "سَمَكَة",
    wrongEmoji: "🐟",
    soundCheck: "ألف"
  },
  {
    letter: "ت",
    instruction: "اختر الكلمة التي تبدأ بصوت الـ ت",
    correctWord: "تُفَّاحَة",
    correctEmoji: "🍎",
    wrongWord: "خَرُوف",
    wrongEmoji: "🐑",
    soundCheck: "تاء"
  },
  {
    letter: "ج",
    instruction: "اختر الكلمة التي تبدأ بصوت الـ ج",
    correctWord: "جَمَل",
    correctEmoji: "🐫",
    wrongWord: "هَاتِف",
    wrongEmoji: "📱",
    soundCheck: "جيم"
  },
  {
    letter: "ح",
    instruction: "اختر الكلمة التي تبدأ بصوت الـ ح",
    correctWord: "حِصَان",
    correctEmoji: "🐎",
    wrongWord: "مِفْتَاح",
    wrongEmoji: "🔑",
    soundCheck: "حاء"
  },
  {
    letter: "خ",
    instruction: "اختر الكلمة التي تبدأ بصوت الـ خ",
    correctWord: "خَرُوف",
    correctEmoji: "🐑",
    wrongWord: "بَنَات",
    wrongEmoji: "👧",
    soundCheck: "خاء"
  },
  {
    letter: "د",
    instruction: "اختر الكلمة التي تبدأ بصوت الـ د",
    correctWord: "دَار",
    correctEmoji: "🏠",
    wrongWord: "شَمْس",
    wrongEmoji: "☀️",
    soundCheck: "دال"
  },
  {
    letter: "ز",
    instruction: "اختر الكلمة التي تبدأ بصوت الـ ز",
    correctWord: "زَرَافَة",
    correctEmoji: "🦒",
    wrongWord: "قَلَم",
    wrongEmoji: "✏️",
    soundCheck: "زاي"
  },
  {
    letter: "ش",
    instruction: "اختر الكلمة التي تبدأ بصوت الـ ش",
    correctWord: "شَجَرَة",
    correctEmoji: "🌳",
    wrongWord: "عَيْن",
    wrongEmoji: "👁️",
    soundCheck: "شين"
  },
  {
    letter: "ص",
    instruction: "اختر الكلمة التي تبدأ بصوت الـ ص",
    correctWord: "صُنْدُوق",
    correctEmoji: "📦",
    wrongWord: "بَاب",
    wrongEmoji: "🚪",
    soundCheck: "صاد"
  },
  {
    letter: "ض",
    instruction: "اختر الكلمة التي تبدأ بصوت الـ ض",
    correctWord: "ضَفْدَع",
    correctEmoji: "🐸",
    wrongWord: "جَزَر",
    wrongEmoji: "🥕",
    soundCheck: "ضاد"
  },
  {
    letter: "ط",
    instruction: "اختر الكلمة التي تبدأ بصوت الـ ط",
    correctWord: "طَائِرَة",
    correctEmoji: "✈️",
    wrongWord: "رُمَّان",
    wrongEmoji: "🍓",
    soundCheck: "طاء"
  },
  {
    letter: "ع",
    instruction: "اختر الكلمة التي تبدأ بصوت الـ ع",
    correctWord: "عَيْن",
    correctEmoji: "👁️",
    wrongWord: "كُرْسِي",
    wrongEmoji: "🪑",
    soundCheck: "عين"
  },
  {
    letter: "غ",
    instruction: "اختر الكلمة التي تبدأ بصوت الـ غ",
    correctWord: "غَزَال",
    correctEmoji: "🦌",
    wrongWord: "وَرَقَة",
    wrongEmoji: "🍃",
    soundCheck: "غين"
  },
  {
    letter: "ق",
    instruction: "اختر الكلمة التي تبدأ بصوت الـ ق",
    correctWord: "قَمَر",
    correctEmoji: "🌙",
    wrongWord: "وَلَد",
    wrongEmoji: "👦",
    soundCheck: "قاف"
  },
  {
    letter: "ل",
    instruction: "اختر الكلمة التي تبدأ بصوت الـ ل",
    correctWord: "لَيْمُون",
    correctEmoji: "🍋",
    wrongWord: "حَلْوَى",
    wrongEmoji: "🍬",
    soundCheck: "لام"
  },
  {
    letter: "ن",
    instruction: "اختر الكلمة التي تبدأ بصوت الـ ن",
    correctWord: "نَجْمَة",
    correctEmoji: "⭐",
    wrongWord: "كَلْب",
    wrongEmoji: "🐶",
    soundCheck: "نون"
  },
  {
    letter: "هـ",
    instruction: "اختر الكلمة التي تبدأ بصوت الـ هـ",
    correctWord: "هَاتِف",
    correctEmoji: "📱",
    wrongWord: "فَرَاشَة",
    wrongEmoji: "🦋",
    soundCheck: "هاء"
  },
  {
    letter: "و",
    instruction: "اختر الكلمة التي تبدأ بصوت الـ و",
    correctWord: "وَرْدَة",
    correctEmoji: "🌹",
    wrongWord: "كِتَاب",
    wrongEmoji: "📖",
    soundCheck: "واو"
  },
  {
    letter: "ي",
    instruction: "اختر الكلمة التي تبدأ بصوت الـ ي",
    correctWord: "يَد",
    correctEmoji: "🖐️",
    wrongWord: "بَيْت",
    wrongEmoji: "🏠",
    soundCheck: "ياء"
  },
  {
    letter: "خ",
    instruction: "اختر الكلمة التي تبدأ بصوت الـ خ",
    correctWord: "خَرُوف",
    correctEmoji: "🐑",
    wrongWord: "سَيَّارَة",
    wrongEmoji: "🚗",
    soundCheck: "خاء"
  },
  {
    letter: "س",
    instruction: "اختر الكلمة التي تبدأ بصوت الـ س",
    correctWord: "سَمَكَة",
    correctEmoji: "🐟",
    wrongWord: "مَوْز",
    wrongEmoji: "🍌",
    soundCheck: "سين"
  },
  {
    letter: "ق",
    instruction: "اختر الكلمة التي تبدأ بصوت الـ ق",
    correctWord: "قَلَم",
    correctEmoji: "✏️",
    wrongWord: "كَلْب",
    wrongEmoji: "🐶",
    soundCheck: "قاف"
  },
  {
    letter: "ج",
    instruction: "اختر الكلمة التي تبدأ بصوت الـ ج",
    correctWord: "جَزَر",
    correctEmoji: "🥕",
    wrongWord: "طَائِرَة",
    wrongEmoji: "✈️",
    soundCheck: "جيم"
  },
  {
    letter: "ط",
    instruction: "اختر الكلمة التي تبدأ بصوت الـ ط",
    correctWord: "طَبْلَة",
    correctEmoji: "🥁",
    wrongWord: "بَالُون",
    wrongEmoji: "🎈",
    soundCheck: "طاء"
  },
  {
    letter: "ث",
    instruction: "اختر الكلمة التي تبدأ بصوت الـ ث",
    correctWord: "ثَعْلَب",
    correctEmoji: "🦊",
    wrongWord: "قِطَار",
    wrongEmoji: "🚂",
    soundCheck: "ثاء"
  }
];

interface Props {
  onBack: () => void;
}

export default function SoundDiscriminationGame({ onBack }: Props) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const currentQuestion = GAME_QUESTIONS[currentIdx];

  const handleSpeak = async () => {
    if (isSpeaking) return;
    setIsSpeaking(true);
    // e.g. "اختر الكلمة التي تبدأ بصوت م"
    await speakText(currentQuestion.instruction);
    setIsSpeaking(false);
  };

  const handleOptionClick = async (word: string, isCorrect: boolean) => {
    if (selectedWord) return; // Prevent double select
    setSelectedWord(word);
    
    if (isCorrect) {
      setScore(s => s + 1);
      await speakText("أحسنت! إجابة صحيحة");
    } else {
      await speakText(`حاول ثانية! الكلمة هي ${currentQuestion.correctWord}`);
    }
  };

  const handleNext = () => {
    setSelectedWord(null);
    if (currentIdx + 1 < GAME_QUESTIONS.length) {
      setCurrentIdx(currentIdx + 1);
    } else {
      setIsFinished(true);
    }
  };

  const handleReset = () => {
    setCurrentIdx(0);
    setSelectedWord(null);
    setScore(0);
    setIsFinished(false);
  };

  // Shuffle options so correct isn't always on the same side
  const options = currentQuestion ? [
    { word: currentQuestion.correctWord, emoji: currentQuestion.correctEmoji, isCorrect: true },
    { word: currentQuestion.wrongWord, emoji: currentQuestion.wrongEmoji, isCorrect: false }
  ] : [];

  // Deterministic layout ordering based on the sum of characters to keep it consistent on re-renders
  const sortedOptions = currentIdx % 2 === 0 ? options : [...options].reverse();

  return (
    <div id="sound-game-container" className="flex flex-col h-full bg-sky-50 rounded-3xl overflow-hidden relative">
      {/* Top Header */}
      <div className="bg-sky-500 text-white py-4 px-6 flex items-center justify-between shadow-md">
        <button 
          id="btn-back-from-game"
          onClick={onBack} 
          className="text-white hover:bg-sky-600 font-bold px-3 py-1.5 rounded-xl border border-white/20 text-sm transition"
        >
          عودة للتمارين
        </button>
        <span className="font-bold text-lg">تمييز الأصوات وحروفها</span>
        <div className="text-sm bg-sky-600/50 px-3 py-1 rounded-full font-mono">
          {isFinished ? `${GAME_QUESTIONS.length}/${GAME_QUESTIONS.length}` : `${currentIdx + 1} / ${GAME_QUESTIONS.length}`}
        </div>
      </div>

      {!isFinished ? (
        <div className="flex-1 p-6 flex flex-col justify-between items-center overflow-y-auto">
          {/* Instructions and Sound Target Big */}
          <div className="w-full text-center space-y-4">
            <h3 className="text-slate-700 font-bold text-sm">استمع للحرف وحدد الصورة الصحيحة</h3>
            
            <div className="flex justify-center items-center gap-4">
              <motion.div 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="w-24 h-24 bg-amber-400 text-white text-5xl font-black rounded-3xl flex items-center justify-center shadow-lg relative animate-float cursor-pointer"
                onClick={handleSpeak}
              >
                {currentQuestion.letter}
                <span className="absolute bottom-1 right-1 bg-white text-amber-500 p-1 rounded-full shadow">
                  <Volume2 size={12} className={isSpeaking ? "animate-pulse" : ""} />
                </span>
                {isSpeaking && (
                  <div className="absolute inset-0 border-4 border-white/35 rounded-3xl animate-ping" />
                )}
              </motion.div>
            </div>

            <button
              id="btn-play-sound-prompt"
              onClick={handleSpeak}
              className="mt-2 text-sky-600 bg-sky-100 hover:bg-sky-200 py-1.5 px-4 rounded-xl text-sm font-bold inline-flex items-center gap-2 transition"
            >
              <Volume2 size={16} />
              استمع للسؤال
            </button>
          </div>

          {/* Cards Choices */}
          <div className="w-full grid grid-cols-2 gap-4 my-6">
            {sortedOptions.map((opt, i) => {
              const isSelected = selectedWord === opt.word;
              const hasAnswered = selectedWord !== null;
              
              let cardBg = "bg-white border-sky-100";
              let textStyle = "text-slate-700";
              
              if (hasAnswered) {
                if (opt.isCorrect) {
                  cardBg = "bg-emerald-50 border-emerald-400 ring-2 ring-emerald-300";
                  textStyle = "text-emerald-700";
                } else if (isSelected) {
                  cardBg = "bg-rose-50 border-rose-400 ring-2 ring-rose-300";
                  textStyle = "text-rose-700";
                } else {
                  cardBg = "bg-gray-50 border-gray-200 opacity-60";
                }
              }

              return (
                <motion.button
                  key={i}
                  id={`btn-game-option-${i}`}
                  disabled={hasAnswered}
                  onClick={() => handleOptionClick(opt.word, opt.isCorrect)}
                  whileHover={!hasAnswered ? { scale: 1.05 } : {}}
                  whileTap={!hasAnswered ? { scale: 0.95 } : {}}
                  className={`border-3 py-6 rounded-3xl flex flex-col items-center justify-center gap-3 transition shadow-md relative ${cardBg}`}
                >
                  <span className="text-5xl">{opt.emoji}</span>
                  <span className={`text-xl font-extrabold ${textStyle}`}>{opt.word}</span>
                  
                  {hasAnswered && opt.isCorrect && (
                    <span className="absolute top-2 left-2 text-emerald-500">
                      <CheckCircle size={20} className="fill-emerald-100" />
                    </span>
                  )}
                  {hasAnswered && isSelected && !opt.isCorrect && (
                    <span className="absolute top-2 left-2 text-rose-500">
                      <XCircle size={20} className="fill-rose-100" />
                    </span>
                  )}
                </motion.button>
              );
            })}
          </div>

          {/* Action Footer */}
          <div className="w-full flex justify-end">
            {selectedWord && (
              <motion.button
                id="btn-next-game-question"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={handleNext}
                className="bg-sky-500 text-white hover:bg-sky-600 font-bold py-3 px-8 rounded-2xl w-full flex items-center justify-center gap-2 transition shadow-md shadow-sky-400/20"
              >
                السؤال التالي
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
            <h2 className="text-2xl font-black text-slate-800">عمل رائع يا بطل!</h2>
            <p className="text-slate-600">لقد أنهيت لعبة تمييز الحروف والأصوات بنجاح</p>
          </div>

          <div className="bg-sky-100/60 p-4 rounded-2xl w-full max-w-xs space-y-2">
            <div className="flex justify-between text-slate-700 font-bold">
              <span>الإجابات الصحيحة:</span>
              <span className="text-sky-600">{score} من {GAME_QUESTIONS.length}</span>
            </div>
            <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
              <div 
                className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${(score / GAME_QUESTIONS.length) * 100}%` }}
              />
            </div>
          </div>

          <div className="flex flex-col gap-2 w-full max-w-xs">
            <button
              id="btn-restart-game"
              onClick={handleReset}
              className="bg-sky-500 text-white hover:bg-sky-600 font-bold py-3 rounded-2xl flex items-center justify-center gap-2 transition"
            >
              <RefreshCw size={18} />
              ألعب مجدداً
            </button>
            <button
              id="btn-finish-game-sound"
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
