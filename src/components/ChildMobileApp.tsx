import React, { useState } from 'react';
import { ArrowRight, Volume2, Award, FileText, ChevronRight, Sparkles, Heart } from 'lucide-react';
import { ChildInfo, AppScreen, TestResult } from '../types';
import { speakText } from '../utils/audio';
import DiagnosticTest from './DiagnosticTest';
import ReportViewer from './ReportViewer';
import SoundDiscriminationGame from './SoundDiscriminationGame';
import WordGame from './WordGame';
import CompleteWordGame from './CompleteWordGame';
import MemoryGame from './MemoryGame';
import ManipulationGame from './ManipulationGame';
import { motion, AnimatePresence } from 'motion/react';

// Cute CSS/SVG character illustrations
function CuteBoyIllustration() {
  return (
    <div className="relative w-40 h-40 mx-auto select-none animate-float">
      <svg viewBox="0 0 200 200" className="w-full h-full">
        {/* Sky glow */}
        <circle cx="100" cy="100" r="80" fill="#E0F2FE" opacity="0.6" />
        {/* Hair back */}
        <path d="M 60,110 C 40,65 160,65 140,110" fill="#78350F" />
        {/* Ears */}
        <circle cx="55" cy="105" r="15" fill="#FED7AA" />
        <circle cx="145" cy="105" r="15" fill="#FED7AA" />
        {/* Face */}
        <circle cx="100" cy="105" r="42" fill="#FDBA74" />
        {/* Cheeks */}
        <circle cx="75" cy="115" r="8" fill="#FCA5A5" opacity="0.6" />
        <circle cx="125" cy="115" r="8" fill="#FCA5A5" opacity="0.6" />
        {/* Hair front bang */}
        <path d="M 55,90 C 70,55 130,55 145,90 C 120,70 80,70 55,90" fill="#451A03" />
        {/* Eyes (happy) */}
        <path d="M 78,102 Q 85,94 92,102" fill="none" stroke="#1E293B" strokeWidth="4" strokeLinecap="round" />
        <path d="M 108,102 Q 115,94 122,102" fill="none" stroke="#1E293B" strokeWidth="4" strokeLinecap="round" />
        {/* Smile */}
        <path d="M 85,122 Q 100,136 115,122" fill="none" stroke="#EA580C" strokeWidth="4" strokeLinecap="round" />
        {/* Red Shirt */}
        <path d="M 70,147 C 70,147 62,185 62,200 L 138,200 C 138,185 130,147 130,147 Z" fill="#EF4444" />
        {/* Collar */}
        <path d="M 85,147 Q 100,157 115,147" fill="none" stroke="#FDBA74" strokeWidth="4" strokeLinecap="round" />
        {/* Wave Arm */}
        <path d="M 62,165 Q 40,145 25,160 C 20,165 35,185 50,175" fill="#FDBA74" />
        <animateTransform 
          attributeName="transform"
          type="rotate"
          values="0 100 150; 5 100 150; 0 100 150"
          dur="2s"
          repeatCount="indefinite"
        />
      </svg>
    </div>
  );
}

// Sparkle clouds decoration background
function CloudsBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-25">
      <div className="absolute -top-10 -left-10 w-44 h-24 bg-white rounded-full blur-xl" />
      <div className="absolute top-20 -right-20 w-52 h-28 bg-white rounded-full blur-xl" />
      <div className="absolute bottom-10 -left-16 w-48 h-24 bg-white rounded-full blur-xl" />
    </div>
  );
}

interface Props {
  onSaveReportToList: (report: any) => void;
}

export default function ChildMobileApp({ onSaveReportToList }: Props) {
  const [screen, setScreen] = useState<AppScreen>('WELCOME');
  
  // Child information form state
  const [childInfo, setChildInfo] = useState<ChildInfo>({
    name: '',
    surname: '',
    classSection: '',
    age: 0,
    gradeLevel: 'تمهيدي (Kg)',
    diagnosisDate: new Date().toISOString().split('T')[0]
  });

  // active game inner state
  const [activeGame, setActiveGame] = useState<'NONE' | 'SOUND' | 'WORD' | 'SYLLABLE' | 'MEMORY' | 'MANIPULATION'>('NONE');

  // Test diagnostic results state
  const [testResult, setTestResult] = useState<TestResult | null>(null);

  const [spokenText, setSpokenText] = useState<string | null>(null);

  React.useEffect(() => {
    const handleSpeech = (e: Event) => {
      const customEvent = e as CustomEvent<{ text: string | null }>;
      setSpokenText(customEvent.detail.text);
    };
    window.addEventListener('app-speech-text', handleSpeech);
    return () => {
      window.removeEventListener('app-speech-text', handleSpeech);
    };
  }, []);

  const startDiagnosis = () => {
    // Navigate to Child Form Screen 2
    setScreen('CHILD_INFO');
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!childInfo.name.trim() || !childInfo.surname.trim()) {
      alert("الرجاء إدخال الاسم واللقب!");
      return;
    }
    if (childInfo.age <= 0) {
      alert("الرجاء إدخال عمر الطفل بشكل صحيح!");
      return;
    }
    // Navigate to Assessment Screen 3
    setScreen('ASSESSMENT');
  };

  const handleTestComplete = (score: number, answers: any[], timeSpentSeconds: number) => {
    // Generate dynamic assessment interpretation based on accuracy percentages
    const totalQuestionsCount = answers.length || 30;
    const scorePercent = (score / totalQuestionsCount) * 100;
    let interpretation = "";
    
    if (scorePercent >= 90) {
      interpretation = `رائع جداً! مستوى الوعي الفونولوجي والصوتي لدى الطفل ${childInfo.name} ممتلئ ومثالي. يمتلك مهارات استثنائية في سماع وتمييز الأصوات تمكنه وتسهل عليه القراءة والكتابة السريعة بطلاقة تامة دقيقة. يُنصح بالاستمرار في القراءة الاستطلاعية الحرة لتنمية حصيلته.`;
    } else if (scorePercent >= 70) {
      interpretation = `مستوى الوعي الفونولوجي لدى الطفل ${childInfo.name} جيد جداً ومتوازن. يستطيع تمييز وتقسيم الحروف الصوتية بشكل سليم، ويواجه بعض الصعوبات الطفيفة في مقاربات الحروف المتشابهة في النطق والسمع. نقترح بعض ألعاب الذاكرة الصوتية البسيطة.`;
    } else if (scorePercent >= 50) {
      interpretation = `مستوى الوعي الفونولوجي لدى الطفل ${childInfo.name} متوسط ويحتاج لمتابعة. لديه تشتت طفيف وصعوبة ملموسة في تمييز الحروف الصوتية الأساسية ومخارجها المتشابهة (مثل س/ش، ب/ت). ننصح بشدة بالانتظام في مخارج الألعاب التعليمية وخاصة تمييز الأصوات الصباحي.`;
    } else {
      interpretation = `يعاني الطفل من ضعف ملحوظ وتراجع في الوعي الصوتي والفونولوجي التمهيدي. يواجه صعوبة بالغة في الربط السمعي البصري للحروف وأصواتها الأولى. نوصي فوراً بخطة دعم علاجي فردية في المدرسة، واستخدام تمارين تركيب الكلمات والأصوات الأربعة بالتطبيق يومياً لدقيقتين لتصحيح التأسيس.`;
    }

    const reportObj: TestResult = {
      childInfo,
      score,
      totalQuestions: totalQuestionsCount,
      timeSpentSeconds,
      answers,
      date: new Date().toLocaleDateString('ar-EG'),
      interpretation
    };

    setTestResult(reportObj);
    onSaveReportToList(reportObj);
    
    // Switch to Screen 4 (Results)
    setScreen('RESULTS');
  };

  // Sound play of headers for beautiful preschool app behavior
  const handlePlayVoiceIntro = () => {
    speakText("أهلاً بك في تطبيق تشخيص وصعوبات التعلم التفاعلي. اختر إجراء التشخيص لتجيب عن الأسئلة أو العب بالتمارين العلاجية");
  };

  return (
    <div id="emulator-viewport" className="w-[380px] h-[750px] bg-sky-200 rounded-[48px] border-14 border-slate-800 shadow-2xl relative flex flex-col overflow-hidden max-w-full mx-auto select-none">
      
      {/* Phone notches and status mock */}
      <div className="absolute top-0 inset-x-0 h-7 bg-slate-800 flex items-center justify-between px-8 text-[11px] text-white/90 z-45 font-mono select-none pointer-events-none">
        <span>16:42</span>
        <div className="w-16 h-4 bg-slate-800 rounded-b-xl absolute top-0 left-1/2 -translate-x-1/2" />
        <div className="flex items-center gap-1.5">
          <span>5G</span>
          <div className="w-5 h-2.5 border border-white/80 rounded-sm p-0.5 flex">
            <div className="bg-white h-full w-full rounded-2xs" />
          </div>
        </div>
      </div>

      {/* Screen area - start below status notch */}
      <div className="flex-1 mt-7 relative bg-[#F0F9FF] flex flex-col font-sans transition-all duration-300">
        
        <AnimatePresence mode="wait">
          
          {/* SCREEN 1: WELCOME SCREEN */}
          {screen === 'WELCOME' && (
            <motion.div 
              key="welcome"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="absolute inset-0 flex flex-col justify-between p-6 overflow-hidden bg-gradient-to-b from-[#BAE6FD] to-[#F0F9FF]"
            >
              <CloudsBackground />

              {/* Top title bar */}
              <div className="flex items-center justify-between mt-3 gap-2">
                <button
                  id="btn-voice-greeting"
                  onClick={handlePlayVoiceIntro}
                  className="bg-white/80 hover:bg-white text-sky-500 font-bold p-3 rounded-2xl shadow-sm transition flex items-center justify-center border border-white"
                  title="استماع للترحيب"
                >
                  <Volume2 size={20} className="animate-pulse" />
                </button>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-black text-sky-900 tracking-tight">تَشْخِيص</h1>
                  <span className="text-2xl">🧩</span>
                </div>
              </div>

              {/* Cute animation */}
              <div className="my-2 space-y-2">
                <CuteBoyIllustration />
                <div className="text-center">
                  <span className="inline-block bg-white/70 backdrop-blur-md py-1 px-4 rounded-full text-xs font-bold text-sky-800 shadow-sm border border-white/40">
                    أهلاً بك يا بطل! 👋
                  </span>
                </div>
              </div>

              {/* Main functional launch buttons exactly as shown in mockup screen 1 */}
              <div className="space-y-4 my-2 z-10">
                {/* Button 1: إجراء التشخيص */}
                <motion.button
                  id="btn-start-diagnosis-large"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={startDiagnosis}
                  className="w-full bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white font-black py-4.5 px-6 rounded-2xl flex flex-col items-center justify-center gap-1 shadow-lg shadow-sky-400/35 border-2 border-white/20 transition-all cursor-pointer relative group overflow-hidden"
                >
                  <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                  <span className="text-xl">إجراء التشخيص</span>
                  <span className="text-xs font-normal text-sky-100 italic">تقييم مهارات الوعي الفونولوجي والقرائي للطفل</span>
                </motion.button>

                {/* Button 2: تمارين علاجية */}
                <motion.button
                  id="btn-go-to-exercises"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setScreen('EXERCISES')}
                  className="w-full bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-white font-black py-4.5 px-6 rounded-2xl flex flex-col items-center justify-center gap-1 shadow-lg shadow-amber-400/35 border-2 border-white/20 transition-all cursor-pointer relative group overflow-hidden"
                >
                  <span className="text-xl">تَمَارِين عِلاجِيَّة</span>
                  <span className="text-xs font-normal text-amber-500 italic bg-white py-0.5 px-3 rounded-full mt-1 font-bold">
                    4 ألعاب مسلية لتنمية المهارات! 🎮
                  </span>
                </motion.button>
              </div>

              {/* Decoration alphabet floating badge */}
              <div className="flex justify-around text-slate-400/50 text-3xl font-black mt-2">
                <span className="animate-float">أ</span>
                <span className="animate-float" style={{ animationDelay: '1s' }}>ب</span>
                <span className="animate-float" style={{ animationDelay: '1.5s' }}>ت</span>
                <span className="animate-float" style={{ animationDelay: '2s' }}>ج</span>
              </div>
            </motion.div>
          )}

          {/* SCREEN 2: CHILD DATA INPUT FORM */}
          {screen === 'CHILD_INFO' && (
            <motion.div 
              key="child_info"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              className="absolute inset-0 flex flex-col bg-gradient-to-b from-sky-50 to-white p-6"
            >
              {/* Back navigation */}
              <div className="flex items-center gap-2 mb-4">
                <button 
                  id="btn-back-from-form"
                  onClick={() => setScreen('WELCOME')}
                  className="text-slate-500 hover:text-slate-800 p-1 rounded-full transition"
                >
                  <ArrowRight className="rotate-0" />
                </button>
                <h2 className="text-lg font-black text-slate-800">بيانات الطفل الفاحص</h2>
              </div>

              <form onSubmit={handleFormSubmit} className="flex-1 flex flex-col justify-between">
                
                <div className="space-y-4">
                  <p className="text-xs text-slate-400">الرجاء ملء حقول بيانات تلميذك بدقة لتوليد التقرير السليم:</p>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="text-right space-y-1">
                      <label className="text-xs font-bold text-slate-500">الاسـم</label>
                      <input 
                        id="input-child-name"
                        type="text" 
                        required
                        className="w-full bg-white border-2 border-slate-200 focus:border-sky-500 rounded-xl py-2.5 px-3 text-sm focus:outline-none"
                        placeholder="حسن"
                        value={childInfo.name}
                        onChange={(e) => setChildInfo({...childInfo, name: e.target.value})}
                      />
                    </div>
                    <div className="text-right space-y-1">
                      <label className="text-xs font-bold text-slate-500">الـقـب</label>
                      <input 
                        id="input-child-surname"
                        type="text" 
                        required
                        className="w-full bg-white border-2 border-slate-200 focus:border-sky-500 rounded-xl py-2.5 px-3 text-sm focus:outline-none"
                        placeholder="العمري"
                        value={childInfo.surname}
                        onChange={(e) => setChildInfo({...childInfo, surname: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="text-right space-y-1">
                    <label className="text-xs font-bold text-slate-500">القسم / الصف الدراسي</label>
                    <input 
                      id="input-child-section"
                      type="text" 
                      className="w-full bg-white border-2 border-slate-200 focus:border-sky-500 rounded-xl py-2.5 px-3 text-sm focus:outline-none"
                      placeholder="الصف التمهيدي أ"
                      value={childInfo.classSection}
                      onChange={(e) => setChildInfo({...childInfo, classSection: e.target.value})}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="text-right space-y-1">
                      <label className="text-xs font-bold text-slate-500">الـعُـمر بالسنوات</label>
                      <input 
                        id="input-child-age"
                        type="number" 
                        min="2"
                        max="14"
                        required
                        className="w-full bg-white border-2 border-slate-200 focus:border-sky-500 rounded-xl py-2.5 px-3 text-sm focus:outline-none"
                        placeholder="5"
                        value={childInfo.age || ''}
                        onChange={(e) => setChildInfo({...childInfo, age: parseInt(e.target.value) || 0})}
                      />
                    </div>
                    <div className="text-right space-y-1">
                      <label className="text-xs font-bold text-slate-500">مستوى المرحلة</label>
                      <select 
                        id="select-child-grade"
                        className="w-full bg-white border-2 border-slate-200 focus:border-sky-500 rounded-xl py-2.5 px-3 text-sm focus:outline-none"
                        value={childInfo.gradeLevel}
                        onChange={(e) => setChildInfo({...childInfo, gradeLevel: e.target.value})}
                      >
                        <option value="روضة (Kg1)">روضة (Kg1)</option>
                        <option value="تمهيدي (Kg2)">تمهيدي (Kg2)</option>
                        <option value="الاول الابتدائي">الأول الابتدائي</option>
                        <option value="الثاني الابتدائي">الثاني الابتدائي</option>
                      </select>
                    </div>
                  </div>

                  <div className="text-right space-y-1">
                    <label className="text-xs font-bold text-slate-500">تاريخ التشخيص</label>
                    <input 
                      id="input-child-date"
                      type="date" 
                      className="w-full bg-white border-2 border-slate-200 focus:border-sky-500 rounded-xl py-2.5 px-3 text-sm focus:outline-none font-mono"
                      value={childInfo.diagnosisDate}
                      onChange={(e) => setChildInfo({...childInfo, diagnosisDate: e.target.value})}
                    />
                  </div>
                </div>

                {/* Submit button */}
                <motion.button
                  id="btn-submit-form"
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full mt-6 bg-sky-500 hover:bg-sky-600 text-white font-black py-4 rounded-2xl shadow-lg transition"
                >
                  التالي - ابدأ الاختبار 🚀
                </motion.button>

              </form>
            </motion.div>
          )}

          {/* SCREEN 3: TEST SCREEN */}
          {screen === 'ASSESSMENT' && (
            <motion.div 
              key="assessment"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col"
            >
              <DiagnosticTest 
                childInfo={childInfo}
                onBack={() => setScreen('CHILD_INFO')}
                onTestComplete={handleTestComplete}
              />
            </motion.div>
          )}

          {/* SCREEN 4: RESULTS SCREEN */}
          {screen === 'RESULTS' && testResult && (
            <motion.div 
              key="results"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col bg-sky-50 p-6 overflow-y-auto"
            >
              <div className="text-center space-y-4 my-auto">
                {/* Result graphics */}
                <div className="w-20 h-20 bg-amber-400 text-white rounded-full flex items-center justify-center mx-auto shadow-lg animate-float">
                  <Award size={44} />
                </div>
                
                <h2 className="text-2xl font-black text-slate-800">نتيجة الفحص</h2>
                
                {/* Circle Score board */}
                <div className="bg-white p-6 rounded-3xl border-3 border-sky-100 shadow-md flex flex-col items-center">
                  <span className="text-xs text-slate-400 font-bold block mb-1">نقاط الوعي الفونولوجي للطفل</span>
                  <div className="text-5xl font-black text-sky-600 font-mono">
                    {testResult.score} <span className="text-slate-300 text-2xl">/ {testResult.totalQuestions}</span>
                  </div>
                  
                  <div className="mt-4 bg-sky-50 rounded-xl p-3 text-xs text-sky-800 text-center font-bold leading-relaxed">
                    {testResult.score >= 8 ? "تمكن وتميز رائع!" : testResult.score >= 5 ? "متوسط، ومتقارب المجهود" : "يحتاج خطة تدريبات مركزة"}
                  </div>
                </div>

                {/* Display interpretation report snippet */}
                <div className="text-right space-y-1 bg-white p-4 rounded-2xl border border-slate-100 text-slate-700 text-xs shadow-sm">
                  <span className="font-bold text-slate-800 flex items-center gap-1.5 mb-1.5">
                    <FileText size={14} className="text-sky-500" />
                    التفسير الأخصائي المرفق:
                  </span>
                  <p className="leading-relaxed leading-medium">{testResult.interpretation}</p>
                </div>

                {/* Functional Report buttons */}
                <div className="space-y-2 pt-2">
                  <button
                    id="btn-view-detailed-report"
                    onClick={() => {
                      speakText("جاري عرض تفاصيل تقرير التشخيص الفني الكامل");
                      const printableSection = document.getElementById('btn-report-back');
                      if (printableSection) printableSection.click();
                      setScreen('WELCOME');
                    }}
                    className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold py-3.5 rounded-2xl text-sm transition shadow-sm cursor-pointer"
                  >
                    📄 معاينة التقرير الرسمي الشامل
                  </button>

                  <button
                    id="btn-goto-games-remedial"
                    onClick={() => {
                      setScreen('EXERCISES');
                    }}
                    className="w-full bg-amber-400 hover:bg-amber-500 text-white font-extrabold py-3.5 rounded-2xl text-sm transition cursor-pointer"
                  >
                    🎮 الانتقال للتمارين العلاجية الموصى بها
                  </button>

                  <button
                    id="btn-results-reset"
                    onClick={() => setScreen('WELCOME')}
                    className="w-full bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold py-3.5 rounded-2xl text-xs transition cursor-pointer"
                  >
                    العودة للقائمة الرئيسية
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* SCREEN 5: REMEDIAL EXERCISES GRID MENU */}
          {screen === 'EXERCISES' && (
            <motion.div 
              key="exercises"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col bg-gradient-to-b from-[#FEF08A] to-white"
            >
              {/* If game is actively opened, render the respective game inside */}
              {activeGame === 'SOUND' && <SoundDiscriminationGame onBack={() => setActiveGame('NONE')} />}
              {activeGame === 'WORD' && <WordGame onBack={() => setActiveGame('NONE')} />}
              {activeGame === 'SYLLABLE' && <CompleteWordGame onBack={() => setActiveGame('NONE')} />}
              {activeGame === 'MEMORY' && <MemoryGame onBack={() => setActiveGame('NONE')} />}
              {activeGame === 'MANIPULATION' && <ManipulationGame onBack={() => setActiveGame('NONE')} />}

              {activeGame === 'NONE' && (
                <div className="flex-1 flex flex-col justify-between p-6 overflow-y-auto w-full">
                  
                  {/* Title Header */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <button 
                        id="btn-back-exercises"
                        onClick={() => setScreen('WELCOME')}
                        className="text-amber-800 hover:text-amber-950 p-1 bg-amber-200/50 rounded-full transition cursor-pointer"
                      >
                        <ArrowRight size={20} />
                      </button>
                      <h2 className="text-xl font-black text-amber-900">تَمَارين علاجيّة تفاعلية</h2>
                    </div>
                    <p className="text-xs text-amber-800/70 font-bold">طوّر مخارج حروف الطفل ووعيه الفونولوجي بالتسلية والألوان</p>
                  </div>

                  {/* 5 Cards Grid - Beautiful kid interface */}
                  <div className="grid grid-cols-2 gap-3.5 my-4">
                    {/* Game 1 */}
                    <motion.button 
                      id="btn-launch-game-sound"
                      onClick={() => {
                        speakText("تمييز الأصوات وحروفها");
                        setActiveGame('SOUND');
                      }}
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.96 }}
                      className="bg-white hover:bg-sky-50 border-3 border-sky-100 rounded-2xl p-4 flex flex-col items-center justify-center text-center gap-2 aspect-[1/1.05] shadow-sm transition cursor-pointer"
                    >
                      <span className="text-4xl bg-sky-100/50 p-2.5 rounded-full">🎧</span>
                      <h3 className="font-extrabold text-[#0D9488] text-sm leading-tight">تمييز الأصوات</h3>
                      <span className="text-[10px] text-slate-400 font-bold">صوت الحرف المطابق</span>
                    </motion.button>

                    {/* Game 2 */}
                    <motion.button 
                      id="btn-launch-game-word"
                      onClick={() => {
                        speakText("أكمل الحرف الناقص");
                        setActiveGame('WORD');
                      }}
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.96 }}
                      className="bg-white hover:bg-amber-50 border-3 border-amber-100 rounded-2xl p-4 flex flex-col items-center justify-center text-center gap-2 aspect-[1/1.05] shadow-sm transition cursor-pointer"
                    >
                      <span className="text-4xl bg-amber-100/50 p-2.5 rounded-full">🍌</span>
                      <h3 className="font-extrabold text-[#D97706] text-sm leading-tight">إكمال الكلمات</h3>
                      <span className="text-[10px] text-slate-400 font-bold">الحرف الأول المفقود</span>
                    </motion.button>

                    {/* Game 3 */}
                    <motion.button 
                      id="btn-launch-game-syllable"
                      onClick={() => {
                        speakText("تركيب ومقاطع الكلمات");
                        setActiveGame('SYLLABLE');
                      }}
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.96 }}
                      className="bg-white hover:bg-emerald-50 border-3 border-emerald-100 rounded-2xl p-4 flex flex-col items-center justify-center text-center gap-2 aspect-[1/1.05] shadow-sm transition cursor-pointer"
                    >
                      <span className="text-4xl bg-emerald-100/50 p-2.5 rounded-full">🧱</span>
                      <h3 className="font-extrabold text-[#059669] text-sm leading-tight">مقاطع الكلمة</h3>
                      <span className="text-[10px] text-slate-400 font-bold">دمج الحروف والتهجئة</span>
                    </motion.button>

                    {/* Game 4 */}
                    <motion.button 
                      id="btn-launch-game-memory"
                      onClick={() => {
                        speakText("تدريب الذاكرة الصوتية");
                        setActiveGame('MEMORY');
                      }}
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.96 }}
                      className="bg-white hover:bg-indigo-50 border-3 border-indigo-100 rounded-2xl p-4 flex flex-col items-center justify-center text-center gap-2 aspect-[1/1.05] shadow-sm transition cursor-pointer"
                    >
                      <span className="text-4xl bg-indigo-100/50 p-2.5 rounded-full">🎴</span>
                      <h3 className="font-extrabold text-[#4F46E5] text-sm leading-tight">ذاكرة وحروف</h3>
                      <span className="text-[10px] text-slate-400 font-bold">مطابقة الحرف بالصورة</span>
                    </motion.button>

                    {/* Game 5 */}
                    <motion.button 
                      id="btn-launch-game-manipulation"
                      onClick={() => {
                        speakText("ورشة التلاعب وموضع الأصوات");
                        setActiveGame('MANIPULATION');
                      }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="col-span-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-2xl p-4 flex items-center justify-between text-right gap-4 shadow-sm hover:from-amber-600 hover:to-orange-600 transition cursor-pointer border-3 border-amber-300"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-4xl bg-white/20 p-2 rounded-xl">🤹</span>
                        <div>
                          <h3 className="font-extrabold text-sm leading-tight text-white flex items-center gap-1.5">
                            <span>ورشة التلاعب وموضع الأصوات</span>
                            <span className="bg-yellow-300 text-amber-950 font-black text-[8px] py-0.5 px-1.5 rounded-full animate-pulse border border-yellow-200">جديد 🌟</span>
                          </h3>
                          <p className="text-[10px] text-amber-100/90 font-bold mt-0.5 leading-normal">بداية، وسط، نهاية، حذف وإضافة واستبدال الأصوات لتمكين القراءة</p>
                        </div>
                      </div>
                      <ChevronRight size={18} className="text-amber-100 rotate-180 shrink-0" />
                    </motion.button>
                  </div>

                  {/* Fun floating micro-text */}
                  <div className="bg-white/60 text-center py-2 px-4 rounded-xl text-[10px] text-slate-500 font-bold leading-normal border border-white/40">
                    💡 شجّع الطفل على محاولة لفظ الحروف بصوت جلي أثناء ممارسة الألعاب!
                  </div>

                </div>
              )}

            </motion.div>
          )}

        </AnimatePresence>

      </div>

      {/* Visual Subtitle Assistive Bubble */}
      <AnimatePresence>
        {spokenText && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
            className="absolute bottom-8 left-4 right-4 bg-slate-950/95 text-white p-3.5 rounded-2xl shadow-xl border border-white/10 z-50 flex items-start gap-3 text-right"
            style={{ direction: 'rtl' }}
          >
            <div className="bg-sky-500 text-white p-1.5 rounded-xl shrink-0 flex items-center justify-center animate-bounce shadow-md">
              <Volume2 size={16} />
            </div>
            <div className="flex-1 leading-normal font-bold text-xs pt-0.5">
              <span className="text-[10px] text-sky-400 block font-black mb-1">المساعد الصوتي والبصري 🔊</span>
              <div>{spokenText}</div>
            </div>
            <button 
              onClick={() => setSpokenText(null)}
              className="text-slate-300 hover:text-white bg-white/10 hover:bg-white/20 text-[10px] px-2 py-1 rounded-lg font-bold shrink-0 self-center transition border border-white/10 cursor-pointer"
            >
              إغلاق
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Decorative Phone Home Bar */}
      <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-32 h-1.5 bg-slate-900 rounded-full z-40" />

    </div>
  );
}
