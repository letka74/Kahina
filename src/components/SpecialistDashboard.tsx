import React, { useState } from 'react';
import { 
  Users, Award, TrendingUp, Search, PlusCircle, Trash2, Calendar, FileText, 
  ChevronLeft, Award as Trophy, BookOpen, Clock, Heart, ClipboardCheck, ArrowLeft, Brain
} from 'lucide-react';
import { TestResult, ChildInfo } from '../types';
import { motion } from 'motion/react';
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip 
} from 'recharts';

function parseArabicDate(dateStr: string): Date {
  // Convert Eastern Arabic numerals (٠-٩) to standard digits (0-9)
  const arabicNumerals = [/٠/g, /١/g, /٢/g, /٣/g, /٤/g, /٥/g, /٦/g, /٧/g, /٨/g, /٩/g];
  let normalized = dateStr || "";
  for (let i = 0; i < 10; i++) {
    normalized = normalized.replace(arabicNumerals[i], i.toString());
  }
  // Trim and split by "/", "-", or space
  const parts = normalized.split(/[\/\-\s]+/).map(p => p.trim()).filter(Boolean);
  if (parts.length === 3) {
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1; // 0-indexed month
    const year = parseInt(parts[2], 10);
    if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
      if (year > 1000) {
        return new Date(year, month, day);
      } else {
        const yearFirst = parseInt(parts[0], 10);
        const dayLast = parseInt(parts[2], 10);
        return new Date(yearFirst, month, dayLast);
      }
    }
  }
  return new Date();
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-slate-900 border border-slate-800 p-3 rounded-2xl shadow-lg text-right font-sans text-[11px] space-y-1">
        <p className="font-extrabold text-slate-200">{data.date}</p>
        <p className="font-semibold text-sky-400">
          <span>الدرجة: </span>
          <span className="font-mono font-black">{data.score}</span>
          <span> من ١٠</span>
        </p>
        <p className="text-[9px] text-slate-400 font-semibold">
          {data.score >= 8 ? "مستوى ممتاز ✨" : data.score >= 5 ? "مستوى متوسط 📈" : "بحاجة لدعم علاج مكثف ⚠️"}
        </p>
      </div>
    );
  }
  return null;
};

interface Props {
  reports: TestResult[];
  onSelectReport: (report: TestResult) => void;
  onLaunchNewTest: () => void;
  onClearAllReports: () => void;
  onDeleteReport: (index: number) => void;
  selectedReport: TestResult | null;
}

export default function SpecialistDashboard({ 
  reports, 
  onSelectReport, 
  onLaunchNewTest, 
  onClearAllReports, 
  onDeleteReport,
  selectedReport 
}: Props) {
  const [searchTerm, setSearchTerm] = useState('');

  // Filter reports
  const filteredReports = reports.filter(r => 
    `${r.childInfo.name} ${r.childInfo.surname}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (r.childInfo.classSection && r.childInfo.classSection.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Compute stats
  const totalKids = reports.length;
  const averageScore = totalKids > 0 
    ? (reports.reduce((sum, r) => sum + r.score, 0) / totalKids).toFixed(1) 
    : '0';

  const weakKidsCount = reports.filter(r => r.score < 6).length;
  const excellentKidsCount = reports.filter(r => r.score >= 9).length;

  // Get history for selected child
  const selectedChildHistory = selectedReport
    ? reports.filter(r => 
        r.childInfo.name === selectedReport.childInfo.name && 
        r.childInfo.surname === selectedReport.childInfo.surname
      )
    : [];

  // Sort history from oldest to newest chronologically
  const sortedHistory = [...selectedChildHistory].sort((a, b) => {
    return parseArabicDate(a.date).getTime() - parseArabicDate(b.date).getTime();
  });

  // Prepare chart data
  const chartData = sortedHistory.map((r, index) => ({
    date: r.date,
    score: r.score,
    index: index + 1
  }));

  return (
    <div id="dashboard-container" className="h-full flex flex-col bg-slate-50 text-slate-800 text-right select-none">
      
      {/* Top Welcome Title */}
      <div className="bg-white border-b border-slate-200 py-5 px-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <span>لوحة الأخصائي ومتابعة الأطفال 🏫</span>
          </h2>
          <p className="text-slate-400 text-xs font-semibold">تتبع تقدم الوعي الفونولوجي ومراجعة خطط التدريب اللغوي لطلابك</p>
        </div>
        
        <div className="flex gap-2.5">
          <button
            id="btn-trigger-new-test"
            onClick={onLaunchNewTest}
            className="bg-sky-500 hover:bg-sky-600 text-white py-2 px-4 rounded-xl text-xs font-black flex items-center gap-2 transition cursor-pointer shadow-sm shadow-sky-500/20"
          >
            <PlusCircle size={15} />
            إجراء فحص جديد
          </button>
          
          {reports.length > 0 && (
            <button
              id="btn-clear-reports"
              onClick={onClearAllReports}
              className="bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 py-2 px-3 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
            >
              <Trash2 size={13} />
              مسح جميع السجلات
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 overflow-y-auto">
        
        {/* LEFT/RIGHT side blocks */}
        {/* Grid Left: Controls and Records list (7 span) */}
        <div className="lg:col-span-12 xl:col-span-7 space-y-6 flex flex-col">
          
          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            
            {/* Stat Card 1 */}
            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs flex flex-col justify-between">
              <span className="text-slate-400 text-xs font-bold block mb-1">إجمالي الفحوصات</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-extrabold text-slate-800 font-mono">{totalKids}</span>
                <span className="text-slate-400 text-xs">أطفال</span>
              </div>
              <div className="mt-2 bg-sky-50 text-sky-700 py-0.5 px-2 rounded text-[10px] font-bold inline-block w-fit">
                مسجلة محلياً
              </div>
            </div>

            {/* Stat Card 2 */}
            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs flex flex-col justify-between">
              <span className="text-slate-400 text-xs font-bold block mb-1">متوسط الوعي</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-extrabold text-sky-600 font-mono">{averageScore}</span>
                <span className="text-slate-400 text-xs">/ 10</span>
              </div>
              <div className="mt-2 bg-sky-50 text-sky-700 py-0.5 px-2 rounded text-[10px] font-bold inline-block w-fit">
                معدل الصف الكلي
              </div>
            </div>

            {/* Stat Card 3 */}
            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs flex flex-col justify-between">
              <span className="text-slate-400 text-xs font-bold block mb-1">بحاجة لدعم</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-extrabold text-rose-500 font-mono">{weakKidsCount}</span>
                <span className="text-slate-400 text-xs">طلاب</span>
              </div>
              <div className="mt-2 bg-rose-50 text-rose-700 py-0.5 px-2 rounded text-[10px] font-bold inline-block w-fit">
                أقل من 6 درجات
              </div>
            </div>

            {/* Stat Card 4 */}
            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs flex flex-col justify-between">
              <span className="text-slate-400 text-xs font-bold block mb-1">المتفوقون لغوياً</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-extrabold text-emerald-500 font-mono">{excellentKidsCount}</span>
                <span className="text-slate-400 text-xs">طلاب</span>
              </div>
              <div className="mt-2 bg-emerald-50 text-emerald-700 py-0.5 px-2 rounded text-[10px] font-bold inline-block w-fit">
                9 فما فوق
              </div>
            </div>

          </div>

          {/* Records List card container */}
          <div className="bg-white rounded-3xl border border-slate-100 p-6 flex-1 flex flex-col shadow-xs min-h-[350px]">
            
            {/* List Header controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <h3 className="font-extrabold text-slate-800 text-base">سجلات التشخيص الحالية</h3>
              
              {/* Search inputs */}
              <div className="relative w-full sm:w-60">
                <Search size={14} className="absolute top-1/2 -translate-y-1/2 right-3 text-slate-400" />
                <input 
                  id="dashboard-search"
                  type="text" 
                  placeholder="ابحث عن طفل أو صف..."
                  className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl pr-9 pl-3 py-2 focus:outline-none focus:border-sky-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* List elements scrollable */}
            <div className="flex-1 overflow-y-auto space-y-2 max-h-[400px] pr-1">
              {filteredReports.length > 0 ? (
                filteredReports.map((report, idx) => {
                  const isCheckedSelected = selectedReport && 
                    selectedReport.childInfo.name === report.childInfo.name && 
                    selectedReport.childInfo.surname === report.childInfo.surname;

                  const reportScorePercent = (report.score / report.totalQuestions) * 100;

                  return (
                    <div
                      key={idx}
                      onClick={() => onSelectReport(report)}
                      className={`group border rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer transition-all ${
                        isCheckedSelected 
                        ? "border-sky-500 bg-sky-50/40" 
                        : "border-slate-100 hover:border-slate-200 bg-slate-50/30"
                      }`}
                    >
                      {/* Name in details */}
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-100 text-slate-600 rounded-xl flex items-center justify-center font-extrabold text-sm group-hover:bg-sky-100 group-hover:text-sky-600 transition">
                          {report.childInfo.name[0]}
                        </div>
                        <div className="text-right space-y-0.5">
                          <h4 className="font-extrabold text-slate-800 text-sm group-hover:text-sky-700 transition">
                            {report.childInfo.name} {report.childInfo.surname}
                          </h4>
                          <span className="text-[10px] text-slate-400 font-bold block">
                            {report.childInfo.classSection || "تمهيدي"} • العمر: {report.childInfo.age} سنة • {report.date}
                          </span>
                        </div>
                      </div>

                      {/* Score metric bar */}
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <span className="text-[10px] text-slate-400 font-semibold block">درجة الفحص</span>
                          <span className={`text-base font-black font-mono ${
                            report.score >= 8 ? "text-emerald-600" : report.score >= 5 ? "text-amber-500" : "text-rose-500"
                          }`}>
                            {report.score} / {report.totalQuestions}
                          </span>
                        </div>
                        
                        {/* Interactive dynamic delete */}
                        <button
                          id={`btn-delete-report-${idx}`}
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent selection
                            onDeleteReport(idx);
                          }}
                          className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                          title="حذف هذا السجل"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center py-12 text-center text-slate-400 space-y-3">
                  <div className="text-5xl">📋</div>
                  <p className="text-sm font-bold">لا يوجد أطفال مسجلين حالياً</p>
                  <p className="text-xs">اضغط على زر إجراء فحص جديد بالهاتف لتسجيل النتائج بذكاء.</p>
                </div>
              )}
            </div>

          </div>

        </div>

        {/* Grid Right: Full diagnostic guidelines viewer (5 span) */}
        <div className="lg:col-span-12 xl:col-span-5 space-y-6">
          
          <div className="bg-slate-900 text-slate-100 rounded-3xl p-6 shadow-md border border-slate-800 space-y-5 flex flex-col min-h-[460px] justify-between">
            
            {selectedReport ? (
              <div className="space-y-4">
                {/* Selected kid info header */}
                <div className="border-b border-slate-800 pb-3 flex justify-between items-center">
                  <div className="text-right">
                    <span className="text-sky-400 text-xs font-bold block">التقرير الفردي النشط</span>
                    <h3 className="text-xl font-black text-white">
                      {selectedReport.childInfo.name} {selectedReport.childInfo.surname}
                    </h3>
                  </div>
                  <div className="bg-slate-800 select-none py-1 px-3 rounded-full border border-slate-700">
                    <span className="text-xs font-mono font-extrabold text-amber-400">
                      الدرجة: {selectedReport.score} من 10
                    </span>
                  </div>
                </div>

                {/* Interpretation scrollable card */}
                <div className="bg-slate-800/40 border border-slate-850 p-4 rounded-2xl text-xs space-y-1">
                  <span className="font-extrabold text-slate-300 flex items-center gap-1">
                    <Brain size={14} className="text-amber-400" />
                    التحليل ومستوى الصعوبات اللفظية:
                  </span>
                  <p className="text-slate-300 leading-relaxed font-normal">{selectedReport.interpretation}</p>
                </div>

                {/* Subdomains assessment analysis progress representation */}
                <div className="space-y-3">
                  <h4 className="text-slate-400 text-xs font-bold leading-none">مستويات الوعي الفرعية للطفل:</h4>
                  
                  {/* Skill 1 */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[11px] text-slate-300 font-bold">
                      <span>تمييز الحروف المتماثلة في اللفظ (عزل الحرف الأول)</span>
                      <span className="font-mono text-sky-400">{Math.round(selectedReport.score * 10)}%</span>
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${selectedReport.score >= 8 ? 'bg-emerald-500' : selectedReport.score >= 5 ? 'bg-amber-400' : 'bg-rose-500'}`}
                        style={{ width: `${selectedReport.score * 10}%` }}
                      />
                    </div>
                  </div>

                  {/* Skill 2 */}
                  <div className="space-y-1.5 pt-1">
                    <div className="flex justify-between text-[11px] text-slate-300 font-bold">
                      <span>تجزئة الكلمة للمقاطع الصوتية (البلورة والدمج)</span>
                      <span className="font-mono text-[#D97706]">{selectedReport.score >= 8 ? "90%" : selectedReport.score >= 5 ? "65%" : "35%"}</span>
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${selectedReport.score >= 8 ? 'bg-emerald-500' : selectedReport.score >= 5 ? 'bg-amber-400' : 'bg-rose-500'}`}
                        style={{ width: `${selectedReport.score >= 8 ? 90 : selectedReport.score >= 5 ? 65 : 35}%` }}
                      />
                    </div>
                  </div>

                  {/* Skill 3 */}
                  <div className="space-y-1.5 pt-1">
                    <div className="flex justify-between text-[11px] text-slate-300 font-bold">
                      <span>التركيز الصوتي (الربط البصري السمعي)</span>
                      <span className="font-mono text-sky-400">{selectedReport.score >= 8 ? "95%" : selectedReport.score >= 5 ? "72%" : "40%"}</span>
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${selectedReport.score >= 8 ? 'bg-emerald-500' : selectedReport.score >= 5 ? 'bg-amber-400' : 'bg-rose-500'}`}
                        style={{ width: `${selectedReport.score >= 8 ? 95 : selectedReport.score >= 5 ? 72 : 40}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Suggested classroom support exercises references */}
                <div className="pt-2">
                  <h4 className="text-slate-400 text-xs font-bold block mb-2">التمارين المقترحة للأخصائي:</h4>
                  <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-300">
                    <div className="p-2.5 bg-slate-800/60 rounded-xl border border-slate-750">
                      <span className="font-bold text-sky-400 block mb-0.5">تمييز مخارج الحروف 🗣️</span>
                      تمرير باقة بطاقات حروف ملونة على الطفل ليحدد الكلمة الصحيحة.
                    </div>
                    <div className="p-2.5 bg-slate-800/60 rounded-xl border border-slate-750">
                      <span className="font-bold text-[#D97706] block mb-0.5">مطابقة الذاكرة 🎴</span>
                      استخدام ألعاب ذاكرة الحروف المتاحة على يسار الشاشة لزيادة التركيز.
                    </div>
                  </div>
                </div>

              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-slate-500 space-y-4">
                <div className="text-5xl">🔬</div>
                <div className="space-y-1">
                  <h4 className="text-slate-300 font-bold text-sm">لم يتم تحديد تلميذ نشط</h4>
                  <p className="text-xs text-slate-500">اختر أحد السجلات المعروضة من القائمة لعرض تفاصيل التقرير التشخيصي للوعي الفونولوجي والخطة الموصى بها.</p>
                </div>
              </div>
            )}

            {/* General instructional warning disclaimer */}
            <div className="text-[10px] text-slate-500 border-t border-slate-800/60 pt-3 leading-normal">
              💡 يعتمد هذا التقرير على مقاييس تشخيصية أولية معتمدة أكاديمياً لتأجير الوعي الصوتي والفونولوجي لمرحلة الروضة والصفوف المبكرة.
            </div>

          </div>

          {/* Trend chart of Phonological Awareness development Curve over time */}
          {selectedReport && (
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4 text-right"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="space-y-0.5">
                  <h3 className="font-extrabold text-slate-800 text-sm flex items-center gap-1.5 justify-end">
                    <span>منحنى الوعي الفونولوجي للطفل بمرور الوقت 📈</span>
                  </h3>
                  <p className="text-slate-400 text-[10px] font-bold">
                    تتبع تطور الطفل: {selectedReport.childInfo.name} {selectedReport.childInfo.surname}
                  </p>
                </div>
                <div className="bg-sky-50 py-1 px-2.5 rounded-full text-[10px] font-extrabold text-sky-700">
                  {sortedHistory.length} فحوصات مسجلة
                </div>
              </div>

              {sortedHistory.length > 1 ? (
                <div className="w-full h-[200px] mt-2 font-mono" dir="ltr">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={chartData}
                      margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.25}/>
                          <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis 
                        dataKey="date" 
                        tick={{ fill: '#64748b', fontSize: 9, fontFamily: 'Tajawal, sans-serif' }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis 
                        domain={[0, 10]} 
                        ticks={[0, 2, 4, 6, 8, 10]}
                        tick={{ fill: '#64748b', fontSize: 10 }}
                        axisLine={false}
                        tickLine={false}
                        orientation="right"
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Area 
                        type="monotone" 
                        dataKey="score" 
                        stroke="#0ea5e9" 
                        strokeWidth={2.5}
                        fillOpacity={1} 
                        fill="url(#colorScore)"
                        dot={{ r: 4, strokeWidth: 2, stroke: '#ffffff', fill: '#0ea5e9' }}
                        activeDot={{ r: 6, strokeWidth: 0, fill: '#0284c7' }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="py-8 text-center text-slate-400 border border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center space-y-2">
                  <div className="text-3xl text-sky-400 select-none">📊</div>
                  <p className="text-xs font-bold text-slate-700">تتوفر نتيجة فحص واحدة حالياً للطفل</p>
                  <p className="text-[10px] max-w-xs leading-relaxed text-slate-400 font-semibold px-4">
                    سيظهر منحنى التطور التتابعي بمرور الوقت بمجرد إجراء فحوصات أو اختبارات تشخيصية إضافية لهذا الطفل عبر الهاتف المحاكي.
                  </p>
                </div>
              )}
            </motion.div>
          )}

        </div>

      </div>
    </div>
  );
}
