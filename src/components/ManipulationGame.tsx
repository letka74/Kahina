import React, { useState, useEffect } from 'react';
import { Volume2, Trophy, ArrowRight, CheckCircle, XCircle, RefreshCw, Trash2, Plus, ArrowLeftRight, Sparkles } from 'lucide-react';
import { speakText } from '../utils/audio';
import { motion, AnimatePresence } from 'motion/react';

interface Question {
  id: number;
  type: 'POSITION' | 'DELETION' | 'ADDITION' | 'SUBSTITUTION';
  title: string;
  instruction: string;
  word: string;
  emoji: string;
  options: string[];
  correctAnswer: string;
  soundPhrase: string;
}

const MANIPULATION_QUESTIONS: Question[] = [
  {
    id: 1,
    type: 'POSITION',
    title: "موقع الصوت (البداية)",
    instruction: "أين يقع حرف (س) في كلمة سَمَكَة؟",
    word: "سَمَكَة",
    emoji: "🐟",
    options: ["البداية", "الوسط", "النهاية"],
    correctAnswer: "البداية",
    soundPhrase: "أين يقع حرف السين في كلمة سَمَكَة؟"
  },
  {
    id: 2,
    type: 'POSITION',
    title: "موقع الصوت (الوسط)",
    instruction: "أين يقع حرف (ي) في كلمة حَقِيبَة؟",
    word: "حَقِيبَة",
    emoji: "🎒",
    options: ["البداية", "الوسط", "النهاية"],
    correctAnswer: "الوسط",
    soundPhrase: "أين يقع حرف الياء في كلمة حَقِيبَة؟"
  },
  {
    id: 3,
    type: 'POSITION',
    title: "موقع الصوت (النهاية)",
    instruction: "أين يقع حرف (س) في كلمة شَمْس؟",
    word: "شَمْس",
    emoji: "☀️",
    options: ["البداية", "الوسط", "النهاية"],
    correctAnswer: "النهاية",
    soundPhrase: "أين يقع حرف السين في كلمة شَمْس؟"
  },
  {
    id: 4,
    type: 'DELETION',
    title: "حذف صوت من الكلمة",
    instruction: "إذا حذفنا الحرف الأول (ر) من كلمة رَمْل، ماذا تصبح؟",
    word: "رَمْل",
    emoji: "⏳",
    options: ["مَل", "لَم", "رَم"],
    correctAnswer: "مَل",
    soundPhrase: "إذا حذفنا الحرف الأول الراء من كلمة رَمْل، ماذا تصبح؟"
  },
  {
    id: 5,
    type: 'DELETION',
    title: "حذف صوت من الكلمة",
    instruction: "إذا حذفنا الحرف الأول (ب) من كلمة بَرْد، ماذا تصبح؟",
    word: "بَرْد",
    emoji: "❄️",
    options: ["رَد", "بَر", "دَر"],
    correctAnswer: "رَد",
    soundPhrase: "إذا حذفنا الحرف الأول الباء من كلمة بَرْد، ماذا تصبح؟"
  },
  {
    id: 6,
    type: 'DELETION',
    title: "حذف صوت من الكلمة",
    instruction: "إذا حذفنا الحرف الأول (ت) من كلمة تَمْر، ماذا تصبح؟",
    word: "تَمْر",
    emoji: "🌴",
    options: ["مُر", "تَر", "مَر"],
    correctAnswer: "مُر",
    soundPhrase: "إذا حذفنا الحرف الأول التاء من كلمة تَمْر، ماذا تصبح؟"
  },
  {
    id: 7,
    type: 'ADDITION',
    title: "إضافة صوت جديد",
    instruction: "إذا أضفنا الحرف (س) إلى بداية (بَكَة)، ماذا تصبح؟",
    word: "بَكَة",
    emoji: "🕋",
    options: ["سَمَكَة", "مَكْتَب", "شَبَكَة"],
    correctAnswer: "سَمَكَة",
    soundPhrase: "إذا أضفنا الحرف السين إلى بداية بَكَة، ماذا تصبح؟"
  },
  {
    id: 8,
    type: 'ADDITION',
    title: "إضافة صوت جديد",
    instruction: "إذا أضفنا الحرف (م) في بداية كلمة (لَح)، ماذا تصبح؟",
    word: "لَح",
    emoji: "🥩",
    options: ["مِلْح", "لَحْم", "فَلاَح"],
    correctAnswer: "مِلْح",
    soundPhrase: "إذا أضفنا الحرف الميم في بداية كلمة لَح، ماذا تصبح؟"
  },
  {
    id: 9,
    type: 'ADDITION',
    title: "إضافة صوت جديد",
    instruction: "إذا أضفنا حرف (م) في وسط (جَد) لتصبح (جـ مـ د)، ماذا تصبح؟",
    word: "جَد",
    emoji: "👴",
    options: ["مَسْجِد", "جَسَد", "جَمَد"],
    correctAnswer: "جَمَد",
    soundPhrase: "إذا أضفنا حرف الميم في وسط كلمة جَد لتصبح جيم ميم دال، ماذا تصبح؟"
  },
  {
    id: 10,
    type: 'SUBSTITUTION',
    title: "استبدال حرف من الكلمة",
    instruction: "إذا استبدلنا الأول (ق) بالحرف (ع) في كلمة قَلَم، ماذا تصبح؟",
    word: "قَلَم",
    emoji: "✏️",
    options: ["عَلَم", "قَدَم", "بَلَد"],
    correctAnswer: "عَلَم",
    soundPhrase: "إذا استبدلنا الحرف الأول القاف بالحرف العين في كلمة قَلَم، ماذا تصبح؟"
  },
  {
    id: 11,
    type: 'SUBSTITUTION',
    title: "استبدال حرف من الكلمة",
    instruction: "إذا استبدلنا الأول (ت) بالحرف (ص) في كلمة تِين، ماذا تصبح؟",
    word: "تِين",
    emoji: "🫒",
    options: ["صِين", "طِين", "عِين"],
    correctAnswer: "صِين",
    soundPhrase: "إذا استبدلنا الحرف الأول التاء بالحرف الصاد في كلمة تِين، ماذا تصبح؟"
  },
  {
    id: 12,
    type: 'SUBSTITUTION',
    title: "استبدال حرف من الكلمة",
    instruction: "إذا استبدلنا الأول (ف) بالحرف (ن) في كلمة فَار، ماذا تصبح؟",
    word: "فَار",
    emoji: "🐭",
    options: ["نَار", "دَار", "جَار"],
    correctAnswer: "نَار",
    soundPhrase: "إذا استبدلنا الحرف الأول الفاء بالحرف النون في كلمة فار، ماذا تصبح؟"
  },
  {
    id: 13,
    type: 'POSITION',
    title: "موقع الصوت (البداية)",
    instruction: "أين يقع حرف (ب) في كلمة بُرْتُقَال؟",
    word: "بُرْتُقَال",
    emoji: "🍊",
    options: ["البداية", "الوسط", "النهاية"],
    correctAnswer: "البداية",
    soundPhrase: "أين يقع حرف الباء في كلمة بُرْتُقَال؟"
  },
  {
    id: 14,
    type: 'DELETION',
    title: "حذف صوت من الكلمة",
    instruction: "إذا حذفنا الحرف الأول (ق) من كلمة قَطَر، ماذا يتبقى؟",
    word: "قَطَر",
    emoji: "🇶🇦",
    options: ["طَر", "قَط", "رَق"],
    correctAnswer: "طَر",
    soundPhrase: "إذا حذفنا الحرف الأول القاف من كلمة قَطَر، ماذا يتبقى؟"
  },
  {
    id: 15,
    type: 'SUBSTITUTION',
    title: "استبدال حرف من الكلمة",
    instruction: "إذا استبدلنا الأول (م) بالحرف (ل) في كلمة مَوْز، ماذا تصبح؟",
    word: "مَوْز",
    emoji: "🍌",
    options: ["لَوْز", "جَوْز", "كَوْز"],
    correctAnswer: "لَوْز",
    soundPhrase: "إذا استبدلنا الحرف الأول الميم بالحرف اللام في كلمة مَوْز، ماذا تصبح؟"
  }
];

interface Props {
  onBack: () => void;
}

export default function ManipulationGame({ onBack }: Props) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [gameCompleted, setGameCompleted] = useState<boolean>(false);
  const [playingAudio, setPlayingAudio] = useState<boolean>(false);

  useEffect(() => {
    // Generate a randomized sample of 10 questions from the 15 available questions
    const shuffled = [...MANIPULATION_QUESTIONS].sort(() => Math.random() - 0.5).slice(0, 10);
    setQuestions(shuffled);
    setCurrentIndex(0);
    setScore(0);
    setGameCompleted(false);
    setSelectedAnswer(null);
    setIsAnswered(false);
  }, []);

  const currentQuestion = questions[currentIndex];

  useEffect(() => {
    if (currentQuestion) {
      playInstruction();
    }
  }, [currentQuestion]);

  const playInstruction = async () => {
    if (!currentQuestion) return;
    setPlayingAudio(true);
    // Combines the custom therapeutic speech phrase
    await speakText(currentQuestion.soundPhrase);
    setPlayingAudio(false);
  };

  const handleSelectOption = async (option: string) => {
    if (isAnswered) return;
    
    setSelectedAnswer(option);
    setIsAnswered(true);
    
    const correct = option === currentQuestion.correctAnswer;
    setIsCorrect(correct);

    if (correct) {
      setScore((prev) => prev + 1);
      await speakText("أحسنت! إجابة صحيحة وبطلة");
    } else {
      await speakText(`حاول ثانية! الإجابة الصحيحة هي: ${currentQuestion.correctAnswer}`);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    } else {
      setGameCompleted(true);
      speakText(`رائع جداً! لقد أكملت ورشة الوعي والتلاعب الصوتي بنجاح وحصلت على ${score} من أصل ${questions.length}`);
    }
  };

  const restartGame = () => {
    const shuffled = [...MANIPULATION_QUESTIONS].sort(() => Math.random() - 0.5).slice(0, 10);
    setQuestions(shuffled);
    setCurrentIndex(0);
    setScore(0);
    setGameCompleted(false);
    setSelectedAnswer(null);
    setIsAnswered(false);
  };

  const getIconForType = (type: string) => {
    switch (type) {
      case 'POSITION':
        return <Sparkles className="text-amber-500 w-5 h-5 animate-pulse" />;
      case 'DELETION':
        return <Trash2 className="text-rose-500 w-5 h-5" />;
      case 'ADDITION':
        return <Plus className="text-emerald-500 w-5 h-5" />;
      case 'SUBSTITUTION':
        return <ArrowLeftRight className="text-blue-500 w-5 h-5" />;
      default:
        return <Sparkles className="text-amber-500 w-5 h-5 pointer-events-none" />;
    }
  };

  const getThemeColorsForType = (type: string) => {
    switch (type) {
      case 'POSITION':
        return { bg: 'bg-amber-50 border-amber-200 text-amber-800', badge: 'bg-amber-100 text-amber-900 border-amber-300' };
      case 'DELETION':
        return { bg: 'bg-rose-50 border-rose-200 text-rose-800', badge: 'bg-rose-100 text-rose-900 border-rose-200 shadow-sm' };
      case 'ADDITION':
        return { bg: 'bg-emerald-50 border-emerald-200 text-emerald-800', badge: 'bg-emerald-100 text-emerald-950 border-emerald-200' };
      case 'SUBSTITUTION':
        return { bg: 'bg-blue-50 border-blue-200 text-blue-800', badge: 'bg-blue-100 text-blue-900 border-blue-200' };
      default:
        return { bg: 'bg-slate-50 border-slate-200 text-slate-800', badge: 'bg-slate-100 text-slate-900 border-slate-200' };
    }
  };

  if (questions.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <RefreshCw className="w-8 h-8 animate-spin text-slate-400" />
        <p className="mt-2 text-slate-600 font-bold">جاري تحميل تمرين التلاعب بالأصوات...</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col justify-between p-5 overflow-y-auto" style={{ direction: 'rtl' }}>
      
      {/* Header */}
      <div className="flex items-center justify-between border-b pb-3 border-amber-100/40">
        <button
          id="btn-manipulation-back"
          onClick={onBack}
          className="text-amber-800 hover:text-amber-950 p-2 hover:bg-amber-200/50 rounded-full transition cursor-pointer"
        >
          <ArrowRight size={22} className="rotate-0" />
        </button>
        <span className="font-extrabold text-amber-900 text-sm">ورشة التلاعب بالأصوات 🤹</span>
        <div className="bg-amber-100 px-3 py-1.5 rounded-full text-[10px] font-black text-amber-950 border border-amber-200 flex items-center gap-1 shadow-xs">
          <span>النقاط: {score} / {questions.length}</span>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {!gameCompleted ? (
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 30 }}
            className="flex-1 flex flex-col justify-between py-4"
          >
            {/* Type badge & progress bar */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-black border ${getThemeColorsForType(currentQuestion.type).badge}`}>
                  {getIconForType(currentQuestion.type)}
                  <span>{currentQuestion.title}</span>
                </span>
                <span className="text-[10px] text-amber-900/60 font-black">المستوى {currentIndex + 1} من {questions.length}</span>
              </div>
              
              {/* Progress Line */}
              <div className="w-full h-2 bg-slate-200/60 rounded-full overflow-hidden mb-4">
                <div 
                  className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full transition-all duration-300"
                  style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Core Card with word and emoji */}
            <div className="bg-white border-3 border-amber-100 rounded-3xl p-5 shadow-xs flex flex-col items-center my-3 relative overflow-hidden">
              <div className="absolute top-2 left-2 bg-amber-50 p-1 rounded-lg">
                <span className="text-[9px] text-amber-800/60 font-bold block max-w-[80px] break-all">تمثيل فونولوجي</span>
              </div>
              <span className="text-6xl animate-bounce mb-2 select-none">{currentQuestion.emoji}</span>
              <span className="text-2xl font-black text-slate-800 tracking-wide select-none bg-slate-100/50 px-4 py-1.5 rounded-2xl border-2 border-slate-100">
                {currentQuestion.word}
              </span>

              {/* Speaker sound triggers */}
              <button
                onClick={playInstruction}
                className={`mt-4 flex items-center gap-2 px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-yellow-950 text-xs font-black rounded-2xl shadow-sm transition transform active:scale-95 cursor-pointer ${playingAudio ? 'animate-pulse ring-4 ring-yellow-200' : ''}`}
              >
                <Volume2 size={16} />
                <span>اسمع السؤال</span>
              </button>
            </div>

            {/* Question Text Prompt */}
            <div className="text-center my-3 px-2">
              <h4 className="text-base font-black text-[#5C2108] leading-normal">
                {currentQuestion.instruction}
              </h4>
            </div>

            {/* Interactive Options Choice Grid */}
            <div className="space-y-2.5 my-3">
              {currentQuestion.options.map((option, idx) => {
                const isSelected = selectedAnswer === option;
                const isOptionCorrect = option === currentQuestion.correctAnswer;
                
                let btnStyles = "bg-white text-slate-800 border-2 border-slate-100 hover:border-amber-200 active:bg-amber-50";
                
                if (isAnswered) {
                  if (isOptionCorrect) {
                    btnStyles = "bg-emerald-50 text-emerald-950 border-emerald-400 shadow-emerald-100 ring-2 ring-emerald-300";
                  } else if (isSelected) {
                    btnStyles = "bg-rose-50 text-rose-950 border-rose-400 shadow-rose-100 ring-2 ring-rose-300";
                  } else {
                    btnStyles = "bg-slate-50 text-slate-400 border-slate-100 opacity-60";
                  }
                }

                return (
                  <button
                    key={idx}
                    disabled={isAnswered}
                    onClick={() => handleSelectOption(option)}
                    className={`w-full text-right py-3.5 px-4 rounded-2xl font-black text-sm transition-all duration-150 flex items-center justify-between shadow-xs cursor-pointer ${btnStyles}`}
                  >
                    <span className="truncate">{option}</span>
                    {isAnswered && (
                      isOptionCorrect ? <CheckCircle className="text-emerald-500 shrink-0 w-5 h-5" /> : 
                      isSelected ? <XCircle className="text-rose-500 shrink-0 w-5 h-5" /> : null
                    )}
                  </button>
                );
              })}
            </div>

            {/* Action Bar */}
            <div className="h-12 flex items-center justify-end mt-2">
              {isAnswered && (
                <button
                  onClick={handleNext}
                  className="w-full py-3.5 bg-sky-500 hover:bg-sky-600 text-white font-black text-xs rounded-2xl shadow-md transition transform active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>{currentIndex < questions.length - 1 ? "التالي" : "إنهاء اللعبة وكشف الكنز 🎁"}</span>
                  <ArrowRight size={16} className="rotate-180" />
                </button>
              )}
            </div>

          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex-grow flex flex-col items-center justify-center py-10 px-4 text-center"
          >
            {/* Finished State Screen */}
            <div className="bg-amber-100/50 p-6 rounded-full mb-4 animate-bounce">
              <Trophy className="w-16 h-16 text-amber-500" />
            </div>
            
            <h2 className="text-2xl font-black text-amber-900 mb-1 select-none">رائع جداً يا بطل! 🎖️</h2>
            <p className="text-xs text-amber-800 font-bold mb-6">لقد دمجت، حذفت، غيّرت، وحددت مواضع الأصوات مثل الأخصائيين تماماً!</p>

            {/* Score circle */}
            <div className="bg-white border-4 border-amber-200 rounded-3xl p-6 shadow-md mb-8 w-full max-w-xs relative overflow-hidden">
              <div className="text-[#5C2108] text-xs font-black mb-1 select-none">نسبة الإتقان والوعي الفونولوجي</div>
              <div className="text-4xl font-black text-amber-500 select-none">
                {score} <span className="text-slate-400 text-lg">/ {questions.length}</span>
              </div>
              <p className="text-[10px] text-slate-500 font-bold mt-2">
                {score >= 9 ? "مهارات استثنائية وجاهزية تامة للقراءة السريعة والتهجئة" :
                 score >= 7 ? "مستوى ممتاز ومتزن في تقسيم وتعديل تراكيب الكلمات" :
                 score >= 5 ? "جيد ويُنصح بالمزيد من التطبيق التفاعلي لتقليل تشتت مخارج الحروف" :
                 "تحتاج تكرار ممتع لتدريب أذنك اللطيفة على مخارج الأصوات والتقطيع"}
              </p>
            </div>

            <div className="flex gap-3 w-full max-w-xs">
              <button
                onClick={restartGame}
                className="flex-1 py-3 bg-white border-2 border-amber-200 hover:bg-amber-50 text-amber-900 font-bold text-xs rounded-2xl transition shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <RefreshCw size={14} />
                <span>العب مجدداً</span>
              </button>
              <button
                onClick={onBack}
                className="flex-1 py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-2xl transition shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>العودة للتمارين</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
