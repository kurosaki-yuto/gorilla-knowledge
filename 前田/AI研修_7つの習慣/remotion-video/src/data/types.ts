export interface SlideData {
  id: number;
  type:
    | 'title'
    | 'section'
    | 'content'
    | 'comparison'
    | 'practice'
    | 'quiz'
    | 'summary';
  title: string;
  subtitle?: string;
  habitNumber?: number;
  habitName?: string;
  slideType?: string;
  bullets?: string[];
  leftColumn?: { label: string; items: string[] };
  rightColumn?: { label: string; items: string[] };
  practiceType?: string;
  timer?: string;
  steps?: string[];
  quizQuestion?: string;
  quizOptions?: { text: string; correct: boolean }[];
  keyMessage?: string;
  narration: string;
  durationSeconds: number;
}
