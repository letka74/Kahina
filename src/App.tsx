import React, { useState, useEffect } from 'react';
import { Sparkles, Heart, FileText, Smartphone, Laptop, RefreshCw, Layers } from 'lucide-react';
import { TestResult } from './types';
import ChildMobileApp from './components/ChildMobileApp';
import SpecialistDashboard from './components/SpecialistDashboard';
import ReportViewer from './components/ReportViewer';
import { motion } from 'motion/react';

// Pre-loaded high-fidelity Arabic child records to make the workspace feel complete on startup
const INITIAL_DEMO_REPORTS: TestResult[] = [
  {
    childInfo: {
      name: "أيمن",
      surname: "الغامدي",
      classSection: "التمهيدي أ",
      age: 5,
      gradeLevel: "تمهيدي (Kg2)",
      diagnosisDate: "٢٥ / ٥ / ٢٠٢٦"
    },
    score: 6,
    totalQuestions: 10,
    timeSpentSeconds: 332,
    date: "٢٥ / ٥ / ٢٠٢٦",
    answers: [
      { questionId: 1, selectedOptionIndex: 1, isCorrect: true },
      { questionId: 2, selectedOptionIndex: 0, isCorrect: true },
      { questionId: 3, selectedOptionIndex: 2, isCorrect: true },
      { questionId: 4, selectedOptionIndex: 1, isCorrect: false },
      { questionId: 5, selectedOptionIndex: 1, isCorrect: true },
      { questionId: 6, selectedOptionIndex: 0, isCorrect: true },
      { questionId: 7, selectedOptionIndex: 1, isCorrect: false },
      { questionId: 8, selectedOptionIndex: 1, isCorrect: true },
      { questionId: 9, selectedOptionIndex: 1, isCorrect: false },
      { questionId: 10, selectedOptionIndex: 0, isCorrect: false }
    ],
    interpretation: "مستوى الوعي الفونولوجي لدى الطفل أيمن الغامدي متوسط ويحتاج لمتابعة. لديه تشتت طفيف وصعوبة ملموسة في تمييز الحروف الصوتية الأساسية ومخارجها المتشابهة (مثل س/ش، ب/ت). ننصح بشدة بالانتظام في مخارج الألعاب التعليمية وخاصة تمييز الأصوات الصباحي بشكل فردي."
  },
  {
    childInfo: {
      name: "أيمن",
      surname: "الغامدي",
      classSection: "التمهيدي أ",
      age: 5,
      gradeLevel: "تمهيدي (Kg2)",
      diagnosisDate: "١٣ / ٥ / ٢٠٢٦"
    },
    score: 5,
    totalQuestions: 10,
    timeSpentSeconds: 290,
    date: "١٣ / ٥ / ٢٠٢٦",
    answers: [],
    interpretation: "أظهر الطفل أيمن الغامدي تحسناً طفيفاً مقارنة بالاختبار الأول، لكنه لا يزال يحتاج إلى دعم مستمر في التفريق بين الأصوات وتركيب المقاطع البسيطة."
  },
  {
    childInfo: {
      name: "أيمن",
      surname: "الغامدي",
      classSection: "التمهيدي أ",
      age: 5,
      gradeLevel: "تمهيدي (Kg2)",
      diagnosisDate: "٠١ / ٥ / ٢٠٢٦"
    },
    score: 3,
    totalQuestions: 10,
    timeSpentSeconds: 380,
    date: "٠١ / ٥ / ٢٠٢٦",
    answers: [],
    interpretation: "الاختبار التشخيصي الأول للطفل أيمن الغامدي. يعاني من صعوبات جمة وتشتت كبير في الربط الصوتي، ويخلط بين معظم الحروف المتقاربة لفظياً وسماعياً."
  },
  {
    childInfo: {
      name: "سارة",
      surname: "الحربي",
      classSection: "التمهيدي ب",
      age: 5,
      gradeLevel: "تمهيدي (Kg2)",
      diagnosisDate: "٢٤ / ٥ / ٢٠٢٦"
    },
    score: 9,
    totalQuestions: 10,
    timeSpentSeconds: 198,
    date: "٢٤ / ٥ / ٢٠٢٦",
    answers: [],
    interpretation: "رائع جداً! مستوى الوعي الفونولوجي والصوتي لدى الطفل سارة الحربي ممتلئ ومثالي. يمتلك مهارات استثنائية في سماع وتمييز الأصوات تمكنه وتسهل عليه القراءة والكتابة السريعة بطلاقة تامة دقيقة. يُنصح بالاستمرار في القراءة الاستطلاعية لتغذية مهاراتها الإملائية."
  },
  {
    childInfo: {
      name: "سارة",
      surname: "الحربي",
      classSection: "التمهيدي ب",
      age: 5,
      gradeLevel: "تمهيدي (Kg2)",
      diagnosisDate: "١٠ / ٥ / ٢٠٢٦"
    },
    score: 7,
    totalQuestions: 10,
    timeSpentSeconds: 240,
    date: "١٠ / ٥ / ٢٠٢٦",
    answers: [],
    interpretation: "مستوى الوعي الصوتي للطفلة سارة الحربي في تقدم وتطور مستمر وممتاز، أبدت تجاوباً جيداً مع معظم المقاطع الصوتية في الفحص السابق."
  },
  {
    childInfo: {
      name: "عمر",
      surname: "الخطيب",
      classSection: "الأول الابتدائي ج",
      age: 6,
      gradeLevel: "الأول الابتدائي",
      diagnosisDate: "٢٣ / ٥ / ٢٠٢٦"
    },
    score: 4,
    totalQuestions: 10,
    timeSpentSeconds: 421,
    date: "٢٣ / ٥ / ٢٠٢٦",
    answers: [],
    interpretation: "يعاني الطفل عمر الخطيب من ضعف ملحوظ وتراجع في الوعي الصوتي والفونولوجي التمهيدي. يواجه صعوبة بالغة في الربط السمعي البصري للحروف وأصواتها الأولى. نوصي فوراً بخطة دعم علاجي فردية في المدرسة، واستخدام تمارين تركيب الكلمات والأصوات الأربعة بالتطبيق يومياً لدقيقتين لتصحيح التأسيس."
  },
  {
    childInfo: {
      name: "عمر",
      surname: "الخطيب",
      classSection: "الأول الابتدائي ج",
      age: 6,
      gradeLevel: "الأول الابتدائي",
      diagnosisDate: "١٢ / ٥ / ٢٠٢٦"
    },
    score: 2,
    totalQuestions: 10,
    timeSpentSeconds: 480,
    date: "١٢ / ٥ / ٢٠٢٦",
    answers: [],
    interpretation: "الفحص الأول للطفل عمر الخطيب، تعثر في أغلب مهام تجزئة الكلمة وتحديد الأصوات الأولى بشكل تام، ننصح بإلحاقه فوراً بجلسات التخاطب وعلاج الحروف."
  }
];

export default function App() {
  const [reports, setReports] = useState<TestResult[]>([]);
  const [selectedReport, setSelectedReport] = useState<TestResult | null>(null);
  
  // App views layout: 'DASHBOARD' | 'REPORT'
  const [workspaceMode, setWorkspaceMode] = useState<'DASHBOARD' | 'REPORT'>('DASHBOARD');

  // Load and store reports locally
  useEffect(() => {
    try {
      const stored = localStorage.getItem('child_diagnostic_reports');
      if (stored) {
        let parsed = JSON.parse(stored);
        // Upgrade legacy 3-report storage to show rich historic trends 
        if (parsed.length === 3 && parsed[0].childInfo.name === "أيمن" && !parsed.some((r: any) => r.childInfo.diagnosisDate === "٠١ / ٥ / ٢٠٢٦")) {
          localStorage.setItem('child_diagnostic_reports', JSON.stringify(INITIAL_DEMO_REPORTS));
          parsed = INITIAL_DEMO_REPORTS;
        }
        setReports(parsed);
        if (parsed.length > 0) {
          setSelectedReport(parsed[0]);
        }
      } else {
        // Init with mock reports for stellar initial loading view!
        localStorage.setItem('child_diagnostic_reports', JSON.stringify(INITIAL_DEMO_REPORTS));
        setReports(INITIAL_DEMO_REPORTS);
        setSelectedReport(INITIAL_DEMO_REPORTS[0]);
      }
    } catch {
      setReports(INITIAL_DEMO_REPORTS);
      setSelectedReport(INITIAL_DEMO_REPORTS[0]);
    }
  }, []);

  const handleSaveNewReport = (newReport: TestResult) => {
    const updated = [newReport, ...reports];
    setReports(updated);
    setSelectedReport(newReport);
    try {
      localStorage.setItem('child_diagnostic_reports', JSON.stringify(updated));
    } catch {}
  };

  const handleClearAll = () => {
    if (confirm("هل أنت متأكد من رغبتك في حذف جميع السجلات والتقارير؟ لا يمكن استعادتها.")) {
      setReports([]);
      setSelectedReport(null);
      try {
        localStorage.removeItem('child_diagnostic_reports');
      } catch {}
    }
  };

  const handleDeleteReport = (index: number) => {
    const kidName = `${reports[index].childInfo.name} ${reports[index].childInfo.surname}`;
    if (confirm(`هل أنت متأكد من رغبتك في حذف تقرير الطفل: ${kidName}؟`)) {
      const updated = reports.filter((_, idx) => idx !== index);
      setReports(updated);
      if (selectedReport && reports[index] && selectedReport.childInfo.name === reports[index].childInfo.name) {
        setSelectedReport(updated.length > 0 ? updated[0] : null);
      }
      try {
        localStorage.setItem('child_diagnostic_reports', JSON.stringify(updated));
      } catch {}
    }
  };

  const handleSelectReport = (report: TestResult) => {
    setSelectedReport(report);
    // Open dynamic PDF report layout style of main workspace view
    setWorkspaceMode('REPORT');
  };

  const handleLaunchNewTest = () => {
    // Scroll smoothly directly to child simulation viewport
    const container = document.getElementById('emulator-viewport');
    if (container) {
      container.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    // Launch voice guidance instruction in background
    const actionBtn = document.getElementById('btn-start-diagnosis-large');
    if (actionBtn) {
      actionBtn.click();
    }
  };

  return (
    <div id="app-root-wrapper" className="min-h-screen bg-slate-100 flex flex-col justify-between font-sans">
      
      {/* Dynamic top brand navbar */}
      <header className="bg-white border-b border-slate-200 py-4.5 px-6 md:px-12 flex items-center justify-between shadow-xs select-none">
        
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 bg-gradient-to-tr from-sky-400 to-sky-500 rounded-xl flex items-center justify-center text-white text-xl shadow-md font-bold">
            🧩
          </div>
          <div className="text-right">
            <h1 className="text-base md:text-lg font-black text-slate-900 leading-none">
              منصة تشخيص الوعي الفونولوجي والقرائي للأطفال
            </h1>
            <span className="text-[10px] text-slate-400 font-bold block mt-1.5">
              بيئة تشخيصية لمديري الفصول، معالجي النطق والأسرة
            </span>
          </div>
        </div>

        {/* Top status pills */}
        <div className="hidden sm:flex items-center gap-3">
          <div className="bg-sky-50 py-1.5 px-4 rounded-xl border border-sky-100 text-[10px] font-black text-sky-700 flex items-center gap-1">
            <Smartphone size={12} />
            هاتف محاكاة تفاعلي للأطفال
          </div>
          <div className="bg-slate-50 py-1.5 px-4 rounded-xl border border-slate-200 text-[10px] font-black text-slate-700 flex items-center gap-1">
            <Laptop size={12} />
            لوحة قيادة وتحليل الأخصائيين
          </div>
        </div>

      </header>

      {/* Main Core split screen content layout */}
      <main className="flex-1 grid grid-cols-1 xl:grid-cols-12 gap-6 p-4 md:p-8 max-w-7xl w-full mx-auto items-stretch">
        
        {/* PANEL A: CHild interactive emulator viewport (5 columns span) */}
        <div className="xl:col-span-5 flex flex-col items-center justify-center p-2">
          
          {/* Label instructions */}
          <div className="text-center mb-4 space-y-1 select-none">
            <span className="bg-sky-500 text-white font-black py-1 px-4 text-xs rounded-full shadow-sm shadow-sky-500/25">
              📱 هاتف المحاكاة التفاعلي (الألعاب والتقييم)
            </span>
            <p className="text-slate-400 text-[10px] font-bold">
              استخدم الهاتف أدناه لتسجيل بيانات الطفل، تشغيل الأسئلة وممارسة الألعاب!
            </p>
          </div>

          <ChildMobileApp onSaveReportToList={handleSaveNewReport} />

        </div>

        {/* PANEL B: Specialist dashboard workbench workspace (7 columns span) */}
        <div className="xl:col-span-7 bg-white rounded-3xl border border-slate-200 shadow-md flex flex-col justify-between overflow-hidden min-h-[500px] items-stretch">
          
          {/* Workspace navigation selectors */}
          <div className="bg-slate-50 border-b border-slate-200 py-3.5 px-6 flex items-center justify-between select-none">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-400">وضع العرض الحالي:</span>
              <div className="bg-white rounded-xl p-1 border border-slate-200 flex gap-1">
                <button
                  id="tab-dashboard"
                  onClick={() => setWorkspaceMode('DASHBOARD')}
                  className={`py-1 px-3.5 text-xs font-black rounded-lg transition ${
                    workspaceMode === 'DASHBOARD' 
                    ? "bg-slate-900 text-white" 
                    : "text-slate-500 hover:bg-slate-100"
                  }`}
                >
                  لوحة المتابعة العامة
                </button>
                {selectedReport && (
                  <button
                    id="tab-report"
                    onClick={() => setWorkspaceMode('REPORT')}
                    className={`py-1 px-3.5 text-xs font-black rounded-lg transition ${
                      workspaceMode === 'REPORT' 
                      ? "bg-slate-900 text-white" 
                      : "text-slate-500 hover:bg-slate-100"
                    }`}
                  >
                    عرض التقرير النشط 📑
                  </button>
                )}
              </div>
            </div>

            <div className="text-[10px] text-slate-400 font-bold">
              مزامنة فورية مع الهاتف 🔄
            </div>
          </div>

          {/* Active Workspace display panel */}
          <div className="flex-1 overflow-hidden h-full">
            {workspaceMode === 'DASHBOARD' ? (
              <SpecialistDashboard 
                reports={reports}
                selectedReport={selectedReport}
                onSelectReport={handleSelectReport}
                onLaunchNewTest={handleLaunchNewTest}
                onClearAllReports={handleClearAll}
                onDeleteReport={handleDeleteReport}
              />
            ) : (
              selectedReport && (
                <ReportViewer 
                  result={selectedReport}
                  onBackToMain={() => setWorkspaceMode('DASHBOARD')}
                  onGoToGames={() => {
                    // Navigate kid emulator view directly to screen 5
                    setWorkspaceMode('DASHBOARD');
                    const exercisesTrigger = document.getElementById('btn-go-to-exercises');
                    if (exercisesTrigger) {
                      exercisesTrigger.click();
                      const keyframe = document.getElementById('emulator-viewport');
                      if (keyframe) keyframe.scrollIntoView({ behavior: "smooth", block: "center" });
                    }
                  }}
                />
              )
            )}
          </div>

        </div>

      </main>

      {/* Standard responsive high-craft footer */}
      <footer className="bg-slate-950 text-slate-500 border-t border-slate-900 py-6 text-center select-none space-y-2 mt-8">
        <p className="text-xs font-bold text-slate-400">
          تطبيق الوعي الفونولوجي المتقدم للأطفال • مخرجات تشخيص وصعوبات تعلم 🎓
        </p>
        <p className="text-[10px] text-slate-600 font-medium">
          جميع حقوق التقييم الأكاديمي والبرمجي محفوظة © ٢٠٢٦. مدعوم بقوالب واجهة عزل وتحليل الحروف التفاعلية.
        </p>
      </footer>

    </div>
  );
}
