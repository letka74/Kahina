import React, { useState, useEffect, useRef } from 'react';
import { Volume2, ChevronLeft, Heart, Play, RefreshCw, Star } from 'lucide-react';
import { speakText } from '../utils/audio';
import { ChildInfo, Question } from '../types';
import { motion } from 'motion/react';

// Exactly 10 questions of phonological awareness
const DIAGNOSTIC_QUESTIONS: Question[] = [
  {
    id: 1,
    targetSound: "س",
    promptPhrase: "اختر الكلمة التي تبدأ بنفس الصوت (س)",
    soundWord: "س",
    correctOptionIndex: 1, // "ساعة"
    options: [
      { text: "شمس", emoji: "☀️", sound: "شمس" },
      { text: "ساعة", emoji: "⏰", sound: "ساعة" },
      { text: "ولد", emoji: "👦", sound: "ولد" }
    ]
  },
  {
    id: 2,
    targetSound: "م",
    promptPhrase: "اختر الكلمة التي تبدأ بصوت الـ (م)",
    soundWord: "م",
    correctOptionIndex: 0, // "موز"
    options: [
      { text: "مَوْز", emoji: "🍌", sound: "موز" },
      { text: "بيت", emoji: "🏠", sound: "بيت" },
      { text: "ولد", emoji: "👦", sound: "ولد" }
    ]
  },
  {
    id: 3,
    targetSound: "ب",
    promptPhrase: "اختر الكلمة التي تبدأ بصوت الـ (ب)",
    soundWord: "ب",
    correctOptionIndex: 2, // "بطة"
    options: [
      { text: "تفاحة", emoji: "🍎", sound: "تفاحة" },
      { text: "قلم", emoji: "✏️", sound: "قلم" },
      { text: "بَطَّة", emoji: "🦆", sound: "بطة" }
    ]
  },
  {
    id: 4,
    targetSound: "ت",
    promptPhrase: "اختر الكلمة التي تبدأ بصوت الـ (ت)",
    soundWord: "ت",
    correctOptionIndex: 0, // "تفاحة"
    options: [
      { text: "تفاحة", emoji: "🍎", sound: "تفاحة" },
      { text: "كلب", emoji: "🐶", sound: "كلب" },
      { text: "جمل", emoji: "🐫", sound: "جمل" }
    ]
  },
  {
    id: 5,
    targetSound: "ج",
    promptPhrase: "اختر الكلمة التي تبدأ بصوت الـ (ج)",
    soundWord: "ج",
    correctOptionIndex: 1, // "جمل"
    options: [
      { text: "رمان", emoji: "🍓", sound: "رمان" },
      { text: "جَمَل", emoji: "🐫", sound: "جمل" },
      { text: "شمس", emoji: "☀️", sound: "شمس" }
    ]
  },
  {
    id: 6,
    targetSound: "ر",
    promptPhrase: "اختر الكلمة التي تبدأ بصوت الـ (ر)",
    soundWord: "ر",
    correctOptionIndex: 0, // "رمان"
    options: [
      { text: "رُمَّان", emoji: "🍓", sound: "رمان" },
      { text: "سيارة", emoji: "🚗", sound: "سيارة" },
      { text: "كتاب", emoji: "📖", sound: "كتاب" }
    ]
  },
  {
    id: 7,
    targetSound: "ف",
    promptPhrase: "اختر الكلمة التي تبدأ بصوت الـ (ف)",
    soundWord: "ف",
    correctOptionIndex: 2, // "فراشة"
    options: [
      { text: "قطار", emoji: "🚂", sound: "قطار" },
      { text: "صندوق", emoji: "📦", sound: "صندوق" },
      { text: "فَرَاشَة", emoji: "🦋", sound: "فراشة" }
    ]
  },
  {
    id: 8,
    targetSound: "ك",
    promptPhrase: "اختر الكلمة التي تبدأ بصوت الـ (ك)",
    soundWord: "ك",
    correctOptionIndex: 1, // "كلب"
    options: [
      { text: "طائرة", emoji: "✈️", sound: "طائرة" },
      { text: "كَلْب", emoji: "🐶", sound: "كلب" },
      { text: "باب", emoji: "🚪", sound: "باب" }
    ]
  },
  {
    id: 9,
    targetSound: "ش",
    promptPhrase: "اختر الكلمة التي تبدأ بصوت الـ (ش)",
    soundWord: "ش",
    correctOptionIndex: 0, // "شمس"
    options: [
      { text: "شَمْس", emoji: "☀️", sound: "شمس" },
      { text: "هاتف", emoji: "📱", sound: "هاتف" },
      { text: "كرسي", emoji: "🪑", sound: "كرسي" }
    ]
  },
  {
    id: 10,
    targetSound: "هـ",
    promptPhrase: "اختر الكلمة التي تبدأ بصوت الـ (هـ)",
    soundWord: "هاء",
    correctOptionIndex: 1, // "هاتف"
    options: [
      { text: "شجرة", emoji: "🌳", sound: "شجرة" },
      { text: "هَاتِف", emoji: "📱", sound: "هاتف" },
      { text: "ولد", emoji: "👦", sound: "ولد" }
    ]
  },
  {
    id: 11,
    targetSound: "أ",
    promptPhrase: "اختر الكلمة التي تبدأ بصوت الـ (أ)",
    soundWord: "ألف",
    correctOptionIndex: 0,
    options: [
      { text: "أَسَد", emoji: "🦁", sound: "أسد" },
      { text: "جَمَل", emoji: "🐫", sound: "جمل" },
      { text: "كَرَز", emoji: "🍒", sound: "كرز" }
    ]
  },
  {
    id: 12,
    targetSound: "خ",
    promptPhrase: "اختر الكلمة التي تبدأ بصوت الـ (خ)",
    soundWord: "خاء",
    correctOptionIndex: 1,
    options: [
      { text: "فراشة", emoji: "🦋", sound: "فراشة" },
      { text: "خَرُوف", emoji: "🐑", sound: "خروف" },
      { text: "سيارة", emoji: "🚗", sound: "سيارة" }
    ]
  },
  {
    id: 13,
    targetSound: "د",
    promptPhrase: "اختر الكلمة التي تبدأ بصوت الـ (د)",
    soundWord: "دال",
    correctOptionIndex: 2,
    options: [
      { text: "شمس", emoji: "☀️", sound: "شمس" },
      { text: "بطة", emoji: "🦆", sound: "بطة" },
      { text: "دِيك", emoji: " Rooster 🐓", sound: "ديك" }
    ]
  },
  {
    id: 14,
    targetSound: "ز",
    promptPhrase: "اختر الكلمة التي تبدأ بصوت الـ (ز)",
    soundWord: "زاي",
    correctOptionIndex: 0,
    options: [
      { text: "زَرَافَة", emoji: "🦒", sound: "زرافة" },
      { text: "هاتف", emoji: "📱", sound: "هاتف" },
      { text: "مفتاح", emoji: "🔑", sound: "مفتاح" }
    ]
  },
  {
    id: 15,
    targetSound: "ط",
    promptPhrase: "اختر الكلمة التي تبدأ بصوت الـ (ط)",
    soundWord: "طاء",
    correctOptionIndex: 2,
    options: [
      { text: "قلم", emoji: "✏️", sound: "قلم" },
      { text: "كتاب", emoji: "📖", sound: "كتاب" },
      { text: "طَائِرَة", emoji: "✈️", sound: "طائرة" }
    ]
  },
  {
    id: 16,
    targetSound: "ق",
    promptPhrase: "اختر الكلمة التي تبدأ بصوت الـ (ق)",
    soundWord: "قاف",
    correctOptionIndex: 1,
    options: [
      { text: "موز", emoji: "🍌", sound: "موز" },
      { text: "قَمَر", emoji: "🌙", sound: "قمر" },
      { text: "بيت", emoji: "🏠", sound: "بيت" }
    ]
  },
  {
    id: 17,
    targetSound: "ع",
    promptPhrase: "اختر الكلمة التي تبدأ بصوت الـ (ع)",
    soundWord: "عين",
    correctOptionIndex: 0,
    options: [
      { text: "عَيْن", emoji: "👁️", sound: "عين" },
      { text: "سمكة", emoji: "🐟", sound: "سمكة" },
      { text: "هلال", emoji: "🌙", sound: "هلال" }
    ]
  },
  {
    id: 18,
    targetSound: "غ",
    promptPhrase: "اختر الكلمة التي تبدأ بصوت الـ (غ)",
    soundWord: "غين",
    correctOptionIndex: 2,
    options: [
      { text: "ولد", emoji: "👦", sound: "ولد" },
      { text: "تفاحة", emoji: "🍎", sound: "تفاحة" },
      { text: "غَزَال", emoji: "🦌", sound: "غزال" }
    ]
  },
  {
    id: 19,
    targetSound: "ح",
    promptPhrase: "اختر الكلمة التي تبدأ بصوت الـ (ح)",
    soundWord: "حاء",
    correctOptionIndex: 1,
    options: [
      { text: "كلب", emoji: "🐶", sound: "كلب" },
      { text: "حَمَامَة", emoji: "🕊️", sound: "حمامة" },
      { text: "شجرة", emoji: "🌳", sound: "شجرة" }
    ]
  },
  {
    id: 20,
    targetSound: "ص",
    promptPhrase: "اختر الكلمة التي تبدأ بصوت الـ (ص)",
    soundWord: "صاد",
    correctOptionIndex: 0,
    options: [
      { text: "صُنْدُوق", emoji: "📦", sound: "صندوق" },
      { text: "رمان", emoji: "🍓", sound: "رمان" },
      { text: "جمل", emoji: "🐫", sound: "جمل" }
    ]
  },
  {
    id: 21,
    targetSound: "ض",
    promptPhrase: "اختر الكلمة التي تبدأ بصوت الـ (ض)",
    soundWord: "ضاد",
    correctOptionIndex: 2,
    options: [
      { text: "بيت", emoji: "🏠", sound: "بيت" },
      { text: "سيارة", emoji: "🚗", sound: "سيارة" },
      { text: "ضِفْدَع", emoji: "🐸", sound: "ضفدع" }
    ]
  },
  {
    id: 22,
    targetSound: "ذ",
    promptPhrase: "اختر الكلمة التي تبدأ بصوت الـ (ذ)",
    soundWord: "ذال",
    correctOptionIndex: 1,
    options: [
      { text: "بطة", emoji: "🦆", sound: "بطة" },
      { text: "ذِئْب", emoji: "🐺", sound: "ذئب" },
      { text: "كرسي", emoji: "🪑", sound: "كرسي" }
    ]
  },
  {
    id: 23,
    targetSound: "ث",
    promptPhrase: "اختر الكلمة التي تبدأ بصوت الـ (ث)",
    soundWord: "ثاء",
    correctOptionIndex: 0,
    options: [
      { text: "ثَعْلَب", emoji: "🦊", sound: "ثعلب" },
      { text: "قمر", emoji: "🌙", sound: "قمر" },
      { text: "مفتاح", emoji: "🔑", sound: "مفتاح" }
    ]
  },
  {
    id: 24,
    targetSound: "ظ",
    promptPhrase: "اختر الكلمة التي تبدأ بصوت الـ (ظ)",
    soundWord: "ظاء",
    correctOptionIndex: 2,
    options: [
      { text: "كتاب", emoji: "📖", sound: "كتاب" },
      { text: "هاتف", emoji: "📱", sound: "هاتف" },
      { text: "ظَرْف", emoji: "✉️", sound: "ظرف" }
    ]
  },
  {
    id: 25,
    targetSound: "ل",
    promptPhrase: "اختر الكلمة التي تبدأ بصوت الـ (ل)",
    soundWord: "لام",
    correctOptionIndex: 1,
    options: [
      { text: "موز", emoji: "🍌", sound: "موز" },
      { text: "لَيْمُون", emoji: "🍋", sound: "ليمون" },
      { text: "تفاحة", emoji: "🍎", sound: "تفاحة" }
    ]
  },
  {
    id: 26,
    targetSound: "و",
    promptPhrase: "اختر الكلمة التي تبدأ بصوت الـ (و)",
    soundWord: "واو",
    correctOptionIndex: 0,
    options: [
      { text: "وَرْدَة", emoji: "🌹", sound: "وردة" },
      { text: "سيارة", emoji: "🚗", sound: "سيارة" },
      { text: "جمل", emoji: "🐫", sound: "جمل" }
    ]
  },
  {
    id: 27,
    targetSound: "ي",
    promptPhrase: "اختر الكلمة التي تبدأ بصوت الـ (ي)",
    soundWord: "ياء",
    correctOptionIndex: 2,
    options: [
      { text: "قلم", emoji: "✏️", sound: "قلم" },
      { text: "فراشة", emoji: "🦋", sound: "فراشة" },
      { text: "يَد", emoji: "🖐️", sound: "يد" }
    ]
  },
  {
    id: 28,
    targetSound: "ن",
    promptPhrase: "اختر الكلمة التي تبدأ بصوت الـ (ن)",
    soundWord: "نون",
    correctOptionIndex: 1,
    options: [
      { text: "أسد", emoji: "🦁", sound: "أسد" },
      { text: "نَحْلَة", emoji: "🐝", sound: "نحلة" },
      { text: "بيت", emoji: "🏠", sound: "بيت" }
    ]
  },
  {
    id: 29,
    targetSound: "س",
    promptPhrase: "اختر الكلمة التي تبدأ بصوت الـ (س)",
    soundWord: "سين",
    correctOptionIndex: 0,
    options: [
      { text: "سَمَكَة", emoji: "🐟", sound: "سمكة" },
      { text: "شجرة", emoji: "🌳", sound: "شجرة" },
      { text: "رمان", emoji: "🍓", sound: "رمان" }
    ]
  },
  {
    id: 30,
    targetSound: "ق",
    promptPhrase: "اختر الكلمة التي تبدأ بصوت الـ (ق)",
    soundWord: "قاف",
    correctOptionIndex: 2,
    options: [
      { text: "ولد", emoji: "👦", sound: "ولد" },
      { text: "كرز", emoji: "🍒", sound: "كرز" },
      { text: "قَلَم", emoji: "✏️", sound: "قلم" }
    ]
  }
];

interface Props {
  childInfo: ChildInfo;
  onTestComplete: (score: number, answers: any[], timeSpentSeconds: number) => void;
  onBack: () => void;
}

export default function DiagnosticTest({ childInfo, onTestComplete, onBack }: Props) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [answers, setAnswers] = useState<{ questionId: number; selectedOptionIndex: number; isCorrect: boolean }[]>([]);
  const [score, setScore] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const startTime = useRef<number>(Date.now());

  const currentQuestion = DIAGNOSTIC_QUESTIONS[currentIdx];

  const playAudioPrompt = async () => {
    if (isSpeaking) return;
    setIsSpeaking(true);
    // Voice guidance: Speaks the question out beautifully in Arabic!
    await speakText(currentQuestion.promptPhrase);
    setIsSpeaking(false);
  };

  // Play instruction automatically once when question changes
  useEffect(() => {
    setSelectedOption(null);
    playAudioPrompt();
  }, [currentIdx]);

  const handleOptionSelect = async (optionIndex: number) => {
    if (selectedOption !== null) return; // Prevent clicking multiple times
    
    setSelectedOption(optionIndex);
    const isCorrect = optionIndex === currentQuestion.correctOptionIndex;
    
    // Add to score
    if (isCorrect) {
      setScore(s => s + 1);
    }

    // Keep answer record
    const newAnswer = {
      questionId: currentQuestion.id,
      selectedOptionIndex: optionIndex,
      isCorrect
    };
    setAnswers(prev => [...prev, newAnswer]);

    if (isCorrect) {
      await speakText("صحيح! أحسنت.");
    } else {
      await speakText("حسناً، سيظهر هذا في تقريرك.");
    }

    // Delayed transition to next or complete
    setTimeout(() => {
      if (currentIdx + 1 < DIAGNOSTIC_QUESTIONS.length) {
        setCurrentIdx(prev => prev + 1);
      } else {
        const timeSpentSeconds = Math.round((Date.now() - startTime.current) / 1000);
        onTestComplete(score + (isCorrect ? 1 : 0), [...answers, newAnswer], timeSpentSeconds);
      }
    }, 1200);
  };

  return (
    <div id="diagnostic-test-wrapper" className="flex flex-col h-full bg-sky-50 rounded-3xl overflow-hidden relative">
      {/* Test App Top Header (Screen 3) */}
      <div className="bg-sky-500 text-white py-4 px-6 flex items-center justify-between shadow-md select-none rounded-t-3xl">
        <button 
          id="btn-back-test"
          onClick={onBack} 
          className="text-white hover:bg-sky-600 p-1.5 rounded-full transition"
          title="رجوع"
        >
          <ChevronLeft size={24} className="rotate-180" />
        </button>
        <span className="font-bold text-lg">الوعي الفونولوجي</span>
        <div className="flex items-center gap-1.5 bg-sky-600/50 px-3 py-1 rounded-full text-sm font-mono font-bold">
          <Heart size={14} className="fill-rose-400 text-rose-400 animate-pulse" />
          <span>{currentIdx + 1} / {DIAGNOSTIC_QUESTIONS.length}</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-sky-200 h-1.5 overflow-hidden">
        <div 
          className="bg-amber-400 h-full transition-all duration-300"
          style={{ width: `${((currentIdx + 1) / DIAGNOSTIC_QUESTIONS.length) * 100}%` }}
        />
      </div>

      {/* Question Content */}
      <div className="flex-1 p-6 flex flex-col justify-between items-center overflow-y-auto w-full">
        
        {/* Title / Question context */}
        <div className="w-full text-center space-y-4">
          <div className="flex justify-center">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              id="speaker-prompt-btn"
              onClick={playAudioPrompt}
              className={`w-14 h-14 rounded-full bg-sky-600 text-white flex items-center justify-center shadow-lg transition duration-200 cursor-pointer ${isSpeaking ? 'animate-pulse bg-sky-700' : ''}`}
            >
              <Volume2 size={28} className={isSpeaking ? "animate-bounce" : ""} />
            </motion.div>
          </div>

          <h2 className="text-xl font-bold text-slate-800 leading-relaxed px-2">
            {currentQuestion.promptPhrase}
          </h2>
        </div>

        {/* 3 Options Blocks exactly as in mockup */}
        <div className="grid grid-cols-3 gap-3 w-full my-6 max-w-sm">
          {currentQuestion.options.map((option, index) => {
            const isSelected = selectedOption === index;
            const hasAnswered = selectedOption !== null;
            const isCorrectOption = index === currentQuestion.correctOptionIndex;

            let cardBorderColor = "border-sky-200 hover:border-sky-400 hover:shadow-sky-100";
            let cardBgColor = "bg-white";
            let labelBorderColor = "border-sky-100";
            let labelBgColor = "bg-sky-50 text-sky-700";

            if (hasAnswered) {
              if (isCorrectOption) {
                cardBorderColor = "border-emerald-500 ring-2 ring-emerald-300";
                cardBgColor = "bg-emerald-50";
                labelBorderColor = "border-emerald-200";
                labelBgColor = "bg-emerald-500 text-white";
              } else if (isSelected) {
                cardBorderColor = "border-rose-400 ring-2 ring-rose-300 shadow-none";
                cardBgColor = "bg-rose-50";
                labelBorderColor = "border-rose-200";
                labelBgColor = "bg-rose-500 text-white";
              } else {
                cardBorderColor = "border-slate-100 opacity-50";
                cardBgColor = "bg-slate-50";
                labelBorderColor = "border-slate-100";
                labelBgColor = "bg-slate-50 text-slate-400";
              }
            }

            return (
              <motion.button
                key={index}
                disabled={hasAnswered}
                id={`btn-option-${index}`}
                onClick={() => handleOptionSelect(index)}
                whileHover={!hasAnswered ? { scale: 1.05, y: -4 } : {}}
                whileTap={!hasAnswered ? { scale: 0.95 } : {}}
                className={`border-3 p-3.5 pb-2 rounded-3xl flex flex-col justify-between items-center h-44 shadow-md transition-all ${cardBgColor} ${cardBorderColor}`}
              >
                {/* Emoji Graphic Display */}
                <div className="flex-1 flex justify-center items-center">
                  <span className="text-5xl select-none animate-float leading-none">{option.emoji}</span>
                </div>

                {/* Bottom Label exactly matching design */}
                <div className={`w-full py-1.5 px-1 border rounded-2xl text-center text-sm font-extrabold select-none truncate ${labelBorderColor} ${labelBgColor}`}>
                  {option.text}
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Diagnostic footer badge representation */}
        <div className="text-center">
          <p className="text-xs text-slate-400 font-bold">
            مستكشف الوعي اللفظي • طبيب الأطفال الصغير
          </p>
        </div>

      </div>
    </div>
  );
}
