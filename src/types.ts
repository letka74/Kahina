export interface ChildInfo {
  name: string;
  surname: string;
  classSection: string; // القسم
  age: number;
  gradeLevel: string; // المستوى الدراسي
  diagnosisDate: string; // تاريخ التشخيص
}

export interface Question {
  id: number;
  targetSound: string; // e.g., "س"
  promptPhrase: string; // e.g., "اختر الكلمة التي تبدأ بصوت س"
  soundWord: string; // target spoken instruction
  correctOptionIndex: number;
  options: {
    text: string;
    emoji: string;
    sound: string;
  }[];
}

export interface TestResult {
  childInfo: ChildInfo;
  score: number; // e.g., 6
  totalQuestions: number; // 10
  timeSpentSeconds: number; // e.g. 332
  answers: {
    questionId: number;
    selectedOptionIndex: number;
    isCorrect: boolean;
  }[];
  date: string;
  interpretation: string;
}

export type AppScreen = 'WELCOME' | 'CHILD_INFO' | 'ASSESSMENT' | 'RESULTS' | 'EXERCISES';

export interface ReportItem {
  id: string;
  childInfo: ChildInfo;
  score: number;
  totalQuestions: number;
  timeSpentSeconds: number;
  date: string;
}
