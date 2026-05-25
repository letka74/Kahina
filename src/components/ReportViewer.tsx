import React, { useRef } from 'react';
import { Download, FileText, CheckCircle, AlertTriangle, Clock, Calendar, ShieldCheck, Printer, ArrowLeft } from 'lucide-react';
import { ChildInfo, TestResult } from '../types';
import { motion } from 'motion/react';

interface Props {
  result: TestResult;
  onBackToMain: () => void;
  onGoToGames: () => void;
}

export default function ReportViewer({ result, onBackToMain, onGoToGames }: Props) {
  const printRef = useRef<HTMLDivElement>(null);

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handlePrint = () => {
    const printContent = printRef.current?.innerHTML;
    const originalContent = document.body.innerHTML;

    if (printContent) {
      // Create printable window element cleanly
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <html dir="rtl">
            <head>
              <title>تقرير التشخيص الفونولوجي - ${result.childInfo.name} ${result.childInfo.surname}</title>
              <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800&display=swap" rel="stylesheet">
              <script src="https://cdn.tailwindcss.com"></script>
              <style>
                body {
                  font-family: 'Tajawal', sans-serif;
                  background-color: white;
                  padding: 40px;
                }
                @media print {
                  body { padding: 0; }
                  .no-print { display: none !important; }
                }
              </style>
            </head>
            <body>
              ${printContent}
              <script>
                window.onload = function() {
                  window.print();
                  setTimeout(() => window.close(), 500);
                }
              </script>
            </body>
          </html>
        `);
        printWindow.document.close();
      }
    }
  };

  // Score metrics
  const scorePercent = (result.score / result.totalQuestions) * 100;
  const isWeak = result.score < 6;
  const isGood = result.score >= 8;

  return (
    <div id="report-viewer-root" className="flex flex-col h-full bg-slate-50 rounded-3xl overflow-hidden relative">
      
      {/* Top action header */}
      <div className="bg-slate-800 text-white py-4 px-6 flex items-center justify-between shadow-md">
        <button 
          id="btn-report-back"
          onClick={onBackToMain}
          className="text-slate-200 hover:text-white flex items-center gap-1 bg-slate-700/50 hover:bg-slate-700/85 px-3 py-1.5 rounded-xl transition"
        >
          <ArrowLeft size={16} className="rotate-180" />
          الرئيسية
        </button>
        <span className="font-bold text-base md:text-lg">تقرير تشخيص الوعي الصوتي</span>
        <button
          id="btn-print-direct"
          onClick={handlePrint}
          className="bg-sky-500 hover:bg-sky-600 text-white px-3 py-1.5 rounded-xl flex items-center gap-1.5 text-xs font-bold transition shadow-sm"
        >
          <Printer size={14} />
          طباعة التقرير
        </button>
      </div>

      <div className="flex-1 p-6 overflow-y-auto space-y-6">
        
        {/* PRINTABLE CONTAINER */}
        <div ref={printRef} className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-sm space-y-6 text-slate-800">
          
          {/* Diagnostic Header (RTL styling) */}
          <div className="border-b-2 border-dashed border-slate-100 pb-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-right space-y-1">
              <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                <span className="p-2 bg-sky-50 text-sky-600 rounded-xl">🧩</span>
                منصة تشخيص وتقييم الوعي الفونولوجي
              </h1>
              <p className="text-slate-400 text-xs font-medium">التقرير التشخيصي الشامل والأكاديمي للأطفال</p>
            </div>
            <div className="bg-slate-50 border border-slate-100 rounded-2xl py-2 px-4 text-center">
              <span className="text-slate-500 text-xs font-bold block">تاريخ الفحص</span>
              <span className="text-slate-800 font-mono text-xs font-extrabold flex items-center gap-1">
                <Calendar size={12} className="text-slate-400" />
                {result.date}
              </span>
            </div>
          </div>

          {/* Child Metadata Form details grid */}
          <div className="bg-sky-50/60 border border-sky-100 rounded-2xl p-4 grid grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-6">
            <div className="text-right">
              <span className="text-slate-400 text-xs font-bold block">الاسم واللقب</span>
              <span className="text-slate-800 font-extrabold text-sm md:text-base">{result.childInfo.name} {result.childInfo.surname}</span>
            </div>
            <div className="text-right">
              <span className="text-slate-400 text-xs font-bold block">القسم والفرع</span>
              <span className="text-slate-800 font-extrabold text-sm md:text-base">{result.childInfo.classSection || "غير محدد"}</span>
            </div>
            <div className="text-right">
              <span className="text-slate-400 text-xs font-bold block">العمر الزمني</span>
              <span className="text-slate-800 font-extrabold text-sm md:text-base">{result.childInfo.age} سنوات</span>
            </div>
            <div className="text-right">
              <span className="text-slate-400 text-xs font-bold block">المستوى الدراسي</span>
              <span className="text-slate-800 font-extrabold text-sm md:text-base">{result.childInfo.gradeLevel || "تمهيدي"}</span>
            </div>
            <div className="text-right">
              <span className="text-slate-400 text-xs font-bold block">زمن الاختبار المستغرق</span>
              <span className="text-slate-800 font-extrabold text-sm md:text-base flex items-center gap-1 font-mono">
                <Clock size={14} className="text-slate-400" />
                {formatTime(result.timeSpentSeconds)} دقائق
              </span>
            </div>
            <div className="text-right">
              <span className="text-slate-400 text-xs font-bold block">حالة التقييم</span>
              <span className="text-emerald-600 font-extrabold text-sm md:text-base flex items-center gap-1">
                <ShieldCheck size={14} />
                مكتمل بصورة موثقة
              </span>
            </div>
          </div>

          {/* Main Scoring metric display */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center border-t border-slate-100 pt-6">
            
            {/* Score Ring */}
            <div className="md:col-span-4 flex flex-col items-center justify-center p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="text-slate-400 text-xs font-bold mb-3">النتيجة الإجمالية</span>
              <div className="relative w-32 h-32 flex items-center justify-center">
                {/* SVG Radial progress bar */}
                <svg className="w-full h-full -rotate-90">
                  <circle cx="64" cy="64" r="54" className="stroke-slate-200 fill-none" strokeWidth="10" />
                  <circle 
                    cx="64" 
                    cy="64" 
                    r="54" 
                    className={`fill-none transition-all duration-1000 ${
                      isGood ? "stroke-emerald-500" : isWeak ? "stroke-rose-500" : "stroke-amber-500"
                    }`} 
                    strokeWidth="10" 
                    strokeDasharray="339.29" 
                    strokeDashoffset={339.29 - (339.29 * scorePercent) / 100}
                    strokeLinecap="round" 
                  />
                </svg>
                <div className="absolute text-center">
                  <span className="text-4xl font-extrabold text-slate-800 font-mono">{result.score}</span>
                  <span className="text-slate-400 text-lg font-mono"> / {result.totalQuestions}</span>
                </div>
              </div>
              <span className={`mt-3 py-1 px-3 text-xs font-black rounded-lg ${
                isGood ? "bg-emerald-100 text-emerald-800" : isWeak ? "bg-rose-100 text-rose-800" : "bg-amber-100 text-amber-800"
              }`}>
                {isGood ? "وعي مميز" : isWeak ? "بحاجة لتدريب علاجي" : "وعي متوسط ومقبول"}
              </span>
            </div>

            {/* Clinician Diagnosis Text Interpretation exactly requested in mockup */}
            <div className="md:col-span-8 text-right space-y-4">
              <div className="flex items-center gap-2">
                <FileText className="text-sky-500" size={20} />
                <h3 className="text-lg font-extrabold text-slate-800">التفسير الأخصائي والتحليل</h3>
              </div>
              <p className="text-slate-600 text-sm leading-relaxed bg-slate-50 border-r-3 border-sky-500 p-4 rounded-l-xl">
                {result.interpretation}
              </p>

              <div className="space-y-2">
                <span className="text-slate-500 text-xs font-bold block">ملاحظات التقييم:</span>
                <ul className="text-xs text-slate-500 space-y-1 list-disc list-inside">
                  <li>تم تقييم مستويات الوعي الصوتي الأولي (تمييز الحرف الأول المطابق).</li>
                  <li>تجاوب الطفل مع النبر الصوتي والمخارج اللغوية المسموعة.</li>
                  <li>درجة الفحص تشير مباشرة لصعوبات وعي فونولوجي خفيفة أو مهارات مكتسبة كاملة.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Remedial Exercise Advice plan (الخطة العلاجية) */}
          <div className="border-t border-slate-100 pt-6 space-y-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="text-amber-500" size={20} />
              <h3 className="text-lg font-extrabold text-slate-800">الخطة التوصيات والتدريبات لـ {result.childInfo.name}</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-slate-100 rounded-xl p-3.5 bg-slate-50/50">
                <h4 className="font-bold text-xs text-slate-700 mb-2">🏫 دور المدرسة والمعلم</h4>
                <p className="text-slate-500 text-xs leading-relaxed">
                  التركيز على القراءة الجهرية المنغمة ومخارج الحروف بطريقة ليريكال، وتقسيم الوحدات الصوتية (المقاطع) جماعياً بالصف، وربط الكلمة بالرمز البصري.
                </p>
              </div>
              <div className="border border-slate-100 rounded-xl p-3.5 bg-slate-50/50">
                <h4 className="font-bold text-xs text-slate-700 mb-2">🏡 دور الأسرة والمنزل</h4>
                <p className="text-slate-500 text-xs leading-relaxed">
                  تكرار القافية اللغوية البسيطة، استخدام الألعاب العلاجية الأربعة المتاحة بالتطبيق محاورة الطفل بصوت هادئ مع تفصيل مخارج الحروف.
                </p>
              </div>
            </div>
          </div>

          {/* Footer signature line */}
          <div className="border-t border-slate-100 pt-6 flex justify-between text-slate-400 text-xs select-none">
            <span>توقيع الأخصائي الفاحص: _________________</span>
            <span>ختم الإدارة المدرسية: _________________</span>
          </div>

        </div>

        {/* Buttons to let therapist navigate back or child play remedial games */}
        <div className="flex flex-col md:flex-row gap-3 pt-4">
          <button
            id="btn-goto-games"
            onClick={onGoToGames}
            className="flex-1 bg-amber-500 hover:bg-amber-600 text-white font-extrabold py-3.5 rounded-2xl text-center shadow-lg shadow-amber-400/25 transition-all text-sm"
          >
            🎮 الانتقال للتمارين العلاجية الموصى بها
          </button>
          
          <button
            id="btn-return-school"
            onClick={onBackToMain}
            className="md:w-44 bg-slate-200 hover:bg-slate-300 text-slate-700 font-extrabold py-3.5 rounded-2xl text-center transition-all text-sm"
          >
            الرجوع للرئيسية
          </button>
        </div>

      </div>
    </div>
  );
}
