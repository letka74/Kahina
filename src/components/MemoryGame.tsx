import React, { useState, useEffect } from 'react';
import { RefreshCw, Trophy, HelpCircle, Star } from 'lucide-react';
import { speakText } from '../utils/audio';
import { motion } from 'motion/react';

interface CardItem {
  id: number;
  matchId: number; // Cards with same matchId match
  content: string; // "ب" or "🦆"
  isLetter: boolean;
  isFlipped: boolean;
  isMatched: boolean;
  description: string; // For pronunciation
}

const INITIAL_PAIRS = [
  { letter: "ب", emoji: "🦆", text: "بطة", matchId: 1 },
  { letter: "س", emoji: "⏰", text: "ساعة", matchId: 2 },
  { letter: "م", emoji: "🍌", text: "موز", matchId: 3 },
  { letter: "ف", emoji: "🦋", text: "فراشة", matchId: 4 },
  { letter: "ك", emoji: "🐶", text: "كلب", matchId: 5 },
  { letter: "ت", emoji: "🍎", text: "تفاحة", matchId: 6 },
  { letter: "أ", emoji: "🦁", text: "أسد", matchId: 7 },
  { letter: "ج", emoji: "🐫", text: "جمل", matchId: 8 },
  { letter: "ر", emoji: "🍓", text: "رمان", matchId: 9 },
  { letter: "ش", emoji: "☀️", text: "شمس", matchId: 10 },
  { letter: "خ", emoji: "🐑", text: "خروف", matchId: 11 },
  { letter: "ط", emoji: "✈️", text: "طائرة", matchId: 12 },
  { letter: "ق", emoji: "🌙", text: "قمر", matchId: 13 },
  { letter: "ز", emoji: "🦒", text: "زرافة", matchId: 14 },
  { letter: "ل", emoji: "🍋", text: "ليمون", matchId: 15 },
  { letter: "ن", emoji: "⭐", text: "نجمة", matchId: 16 },
  { letter: "و", emoji: "🌹", text: "وردة", matchId: 17 },
  { letter: "ي", emoji: "🖐️", text: "يد", matchId: 18 },
  { letter: "ع", emoji: "👁️", text: "عين", matchId: 19 },
  { letter: "ح", emoji: "🐎", text: "حصان", matchId: 20 },
  { letter: "ض", emoji: "🐸", text: "ضفدع", matchId: 21 },
  { letter: "ذ", emoji: "🐺", text: "ذئب", matchId: 22 },
  { letter: "ث", emoji: "🦊", text: "ثعلب", matchId: 23 },
  { letter: "ظ", emoji: "✉️", text: "ظرف", matchId: 24 },
  { letter: "ج", emoji: "🥕", text: "جزر", matchId: 25 },
  { letter: "م", emoji: "🔑", text: "مفتاح", matchId: 26 },
  { letter: "ك", emoji: "🪑", text: "كرسي", matchId: 27 },
  { letter: "ص", emoji: "📦", text: "صندوق", matchId: 28 },
  { letter: "ط", emoji: "🥁", text: "طبلة", matchId: 29 },
  { letter: "ب", emoji: "🏠", text: "بيت", matchId: 30 },
];

interface Props {
  onBack: () => void;
}

export default function MemoryGame({ onBack }: Props) {
  const [cards, setCards] = useState<CardItem[]>([]);
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matchesCount, setMatchesCount] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  // Initialize and shuffle cards
  useEffect(() => {
    initializeGame();
  }, []);

  const initializeGame = () => {
    // Select 6 random pairs from the 30 available
    const selectedPairs = [...INITIAL_PAIRS]
      .sort(() => Math.random() - 0.5)
      .slice(0, 6);

    const list: CardItem[] = [];
    let idCounter = 1;

    selectedPairs.forEach((p) => {
      // Add Letter Card
      list.push({
        id: idCounter++,
        matchId: p.matchId,
        content: p.letter,
        isLetter: true,
        isFlipped: false,
        isMatched: false,
        description: `حرف الـ ${p.letter}`
      });
      // Add Emoji/Picture Card
      list.push({
        id: idCounter++,
        matchId: p.matchId,
        content: p.emoji,
        isLetter: false,
        isFlipped: false,
        isMatched: false,
        description: p.text
      });
    });

    // Simple robust shuffle
    const shuffled = list.sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setSelectedIndices([]);
    setMoves(0);
    setMatchesCount(0);
    setIsFinished(false);
  };

  const handleCardClick = async (clickedIndex: number) => {
    if (selectedIndices.length >= 2) return; // Ignore clicks if waiting
    if (cards[clickedIndex].isFlipped || cards[clickedIndex].isMatched) return; // Already opened

    // Flip the clicked card
    const updated = [...cards];
    updated[clickedIndex].isFlipped = true;
    setCards(updated);

    // Speak card content description
    speakText(updated[clickedIndex].description);

    const newSelected = [...selectedIndices, clickedIndex];
    setSelectedIndices(newSelected);

    // If two cards are now selected, evaluate
    if (newSelected.length === 2) {
      setMoves(m => m + 1);
      const [firstIdx, secondIdx] = newSelected;
      const card1 = cards[firstIdx];
      const card2 = cards[secondIdx];

      if (card1.matchId === card2.matchId) {
        // MATCH found!
        setTimeout(() => {
          const matchedList = updated.map((card, idx) => {
            if (idx === firstIdx || idx === secondIdx) {
              return { ...card, isMatched: true };
            }
            return card;
          });
          setCards(matchedList);
          setMatchesCount(m => m + 1);
          setSelectedIndices([]);
          
          speakText("رائع! تطابق صحيح");

          // Check if all cards matched
          if (matchedList.every(c => c.isMatched)) {
            setIsFinished(true);
          }
        }, 600);
      } else {
        // NO MATCH! Flip back over
        setTimeout(() => {
          const resetList = [...cards];
          resetList[firstIdx].isFlipped = false;
          resetList[secondIdx].isFlipped = false;
          setCards(resetList);
          setSelectedIndices([]);
        }, 1200);
      }
    }
  };

  return (
    <div id="memory-game" className="flex flex-col h-full bg-[#EEF2F6] rounded-3xl overflow-hidden relative">
      {/* Top Header */}
      <div className="bg-indigo-600 text-white py-4 px-6 flex items-center justify-between shadow-md">
        <button 
          id="btn-memory-game-back"
          onClick={onBack} 
          className="text-white hover:bg-indigo-700 font-bold px-3 py-1.5 rounded-xl border border-white/20 text-sm transition"
        >
          عودة للتمارين
        </button>
        <span className="font-bold text-lg">تدريب الذاكرة الصوتية</span>
        <div className="text-sm bg-indigo-700/50 px-3 py-1 rounded-full font-mono">
          حركات: {moves}
        </div>
      </div>

      {!isFinished ? (
        <div className="flex-1 p-5 flex flex-col justify-between items-center overflow-y-auto">
          <div className="w-full text-center space-y-1">
            <h4 className="text-indigo-800 font-bold text-sm">طابق الحرف بصورته المناسبة:</h4>
            <p className="text-xs text-slate-400">مثال: حرف الـ س يطابق ⏰ (ساعة)</p>
          </div>

          {/* Cards Grid: 3 columns x 4 rows */}
          <div className="grid grid-cols-3 gap-3 w-full max-w-sm my-4">
            {cards.map((card, idx) => {
              const flipped = card.isFlipped || card.isMatched;
              
              return (
                <motion.div
                  key={card.id}
                  id={`btn-memory-card-${idx}`}
                  whileHover={!flipped ? { scale: 1.05 } : {}}
                  whileTap={!flipped ? { scale: 0.95 } : {}}
                  onClick={() => handleCardClick(idx)}
                  className={`h-20 rounded-2xl flex items-center justify-center cursor-pointer transition-all shadow border-2 relative duration-300 ${
                    card.isMatched 
                    ? "bg-emerald-50 border-emerald-300 text-emerald-600 shadow-none opacity-80"
                    : flipped 
                    ? "bg-white border-indigo-400 text-indigo-700 font-black text-3xl"
                    : "bg-indigo-500 border-indigo-600 text-white text-3xl font-bold"
                  }`}
                >
                  {flipped ? (
                    <motion.span 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                    >
                      {card.content}
                    </motion.span>
                  ) : (
                    <HelpCircle size={28} className="opacity-40 text-indigo-200" />
                  )}

                  {card.isMatched && (
                    <span className="absolute top-1 right-1 bg-emerald-500 rounded-full p-0.5 text-white">
                      <Star size={10} className="fill-white" />
                    </span>
                  )}
                </motion.div>
              );
            })}
          </div>

          <button
            id="btn-re-shuffle"
            onClick={initializeGame}
            className="text-xs text-indigo-600 font-bold bg-indigo-50 hover:bg-indigo-100 py-1.5 px-4 rounded-xl border border-indigo-200 flex items-center gap-1.5 transition"
          >
            <RefreshCw size={12} />
            إعادة توزيع البطاقات
          </button>
        </div>
      ) : (
        <div className="flex-1 p-6 flex flex-col items-center justify-center text-center space-y-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1, type: 'spring' }}
            className="w-24 h-24 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center shadow-inner"
          >
            <Trophy size={48} />
          </motion.div>
          
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-slate-800">ذكاء خارق!</h2>
            <p className="text-slate-600">تهانينا! لقد نجحت في مطابقة جميع الرموز الصوتية</p>
          </div>

          <div className="bg-indigo-50 p-4 rounded-2xl w-full max-w-xs space-y-2 text-slate-700">
            <div className="flex justify-between font-bold">
              <span>عدد الحركات الكلية:</span>
              <span className="text-indigo-600">{moves} محاولة</span>
            </div>
            <p className="text-xs text-slate-400">كلما قل عدد محاولاتك، زادت قوة ذاكرتك يا بطل!</p>
          </div>

          <div className="flex flex-col gap-2 w-full max-w-xs">
            <button
              id="btn-restart-memory-game"
              onClick={initializeGame}
              className="bg-indigo-600 text-white hover:bg-indigo-700 font-bold py-3 rounded-2xl flex items-center justify-center gap-2 transition"
            >
              <RefreshCw size={18} />
              ألعب مجدداً
            </button>
            <button
              id="btn-back-to-exercises-from-memory-game"
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
