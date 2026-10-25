import { randomUUID } from "node:crypto";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import { join } from "node:path";
import type { AIAnalysis } from "@/lib/ai/schemas";
import { getQuizQuestions, type QuizLevel, type QuizOptionLabel, type QuizSubject } from "@/lib/quizData";
import { presetAccounts } from "@/lib/studentsData";

export type LocalCheckinRecord = {
  id: string;
  username: string;
  checkin_date: string;
  day_of_week: string;
  mood_score: number;
  energy_level: number;
  focus_level: number;
  workload_level: number;
  factors: string[];
  desired_support: string;
  reflection_text: string | null;
  analysis: AIAnalysis;
  analysis_source: "ai" | "demo_rules" | "safety_rule";
  created_at: string;
};

export type LocalPracticeQuestion = {
  id: string;
  title: string;
  prompt: string;
  options: string[];
  correct_option: number;
  is_active: boolean;
  created_at: string;
};

export type LocalPracticeAttempt = {
  id: string;
  question_id: string;
  username: string;
  selected_option: number;
  is_correct: boolean;
  score: number;
  submitted_at: string;
};

export type LocalQuizAttempt = {
  id: string;
  submission_id: string;
  username: string;
  subject: QuizSubject;
  level: QuizLevel;
  score: number;
  correct_answers: number;
  total_questions: number;
  completed_at: string;
};

type LocalLearningStore = {
  checkins: LocalCheckinRecord[];
  questions: LocalPracticeQuestion[];
  attempts: LocalPracticeAttempt[];
  quizAttempts: LocalQuizAttempt[];
};

const storeDirectory = join(process.cwd(), "data");
const storePath = join(storeDirectory, "learning-records.json");
const weekdayNames = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
const seedQuestions: LocalPracticeQuestion[] = [
  {
    id: "00000000-0000-4000-8000-000000000001",
    title: "Unsur Berita",
    prompt: "Unsur berita yang menjelaskan waktu terjadinya peristiwa adalah ...",
    options: ["Who", "When", "Where", "Why"],
    correct_option: 1,
    is_active: true,
    created_at: "2026-01-01T00:00:00.000Z",
  },
];

let pendingWrite: Promise<unknown> = Promise.resolve();

function localDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function dateForRecord(checkin: LocalCheckinRecord) {
  return checkin.checkin_date ?? localDateKey(new Date(checkin.created_at));
}

function shiftDate(date: Date, amount: number) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + amount);
}

function emptyStore(): LocalLearningStore {
  return { checkins: [], questions: seedQuestions, attempts: [], quizAttempts: [] };
}

async function readStore(): Promise<LocalLearningStore> {
  try {
    const content = await readFile(storePath, "utf8");
    const parsed = JSON.parse(content) as Partial<LocalLearningStore>;
    return {
      checkins: Array.isArray(parsed.checkins)
        ? parsed.checkins.map((checkin) => {
            const date = checkin.checkin_date ?? localDateKey(new Date(checkin.created_at));
            const weekday = new Date(`${date}T12:00:00`).getDay();
            return {
              ...checkin,
              checkin_date: date,
              day_of_week: checkin.day_of_week ?? weekdayNames[weekday],
            };
          })
        : [],
      questions: Array.isArray(parsed.questions) ? parsed.questions : seedQuestions,
      attempts: Array.isArray(parsed.attempts) ? parsed.attempts : [],
      quizAttempts: Array.isArray(parsed.quizAttempts) ? parsed.quizAttempts : [],
    };
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return emptyStore();
    throw error;
  }
}

async function writeStore(store: LocalLearningStore) {
  await mkdir(storeDirectory, { recursive: true });
  const temporaryPath = `${storePath}.${process.pid}.tmp`;
  await writeFile(temporaryPath, JSON.stringify(store, null, 2), "utf8");
  await rename(temporaryPath, storePath);
}

async function updateStore<T>(update: (store: LocalLearningStore) => T): Promise<T> {
  const operation = pendingWrite.then(async () => {
    const store = await readStore();
    const result = update(store);
    await writeStore(store);
    return result;
  });
  pendingWrite = operation.catch(() => undefined);
  return operation;
}

export async function getLocalLearningSnapshot() {
  await pendingWrite;
  return readStore();
}

export async function saveLocalCheckin(
  record: Omit<LocalCheckinRecord, "id" | "created_at" | "checkin_date" | "day_of_week">,
) {
  return updateStore((store) => {
    const now = new Date();
    const checkinDate = localDateKey(now);
    const existing = store.checkins.find(
      (checkin) => checkin.username === record.username && dateForRecord(checkin) === checkinDate,
    );
    if (existing) return { checkin: existing, created: false };

    const saved: LocalCheckinRecord = {
      ...record,
      checkin_date: checkinDate,
      day_of_week: weekdayNames[now.getDay()],
      id: randomUUID(),
      created_at: now.toISOString(),
    };
    store.checkins.unshift(saved);
    return { checkin: saved, created: true };
  });
}

export async function getStudentCheckins(username: string) {
  const store = await getLocalLearningSnapshot();
  return store.checkins.filter((checkin) => checkin.username === username);
}

export async function getStudentCheckinCalendar(username: string, now = new Date()) {
  const checkins = await getStudentCheckins(username);
  const today = localDateKey(now);
  const checkedDates = new Set(checkins.map(dateForRecord));
  const hasCheckedInToday = checkedDates.has(today);
  const todayDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const firstStreakDate = hasCheckedInToday ? todayDate : shiftDate(todayDate, -1);
  let streak = 0;

  for (let date = firstStreakDate; checkedDates.has(localDateKey(date)); date = shiftDate(date, -1)) {
    streak += 1;
  }

  const mondayOffset = (todayDate.getDay() + 6) % 7;
  const week = Array.from({ length: 7 }, (_, index) => {
    const date = shiftDate(todayDate, index - mondayOffset);
    const dateKey = localDateKey(date);
    return {
      date: dateKey,
      day: weekdayNames[date.getDay()],
      checked: checkedDates.has(dateKey),
      isToday: dateKey === today,
    };
  });

  return { today, hasCheckedInToday, streak, week };
}

export async function getStudentPracticeQuestions() {
  const store = await getLocalLearningSnapshot();
  return store.questions
    .filter((question) => question.is_active)
    .map(({ correct_option: _correctOption, ...question }) => question);
}

export async function createLocalPracticeQuestion(input: {
  title: string;
  prompt: string;
  options: string[];
  correctOption: number;
}) {
  return updateStore((store) => {
    const question: LocalPracticeQuestion = {
      id: randomUUID(),
      title: input.title,
      prompt: input.prompt,
      options: input.options,
      correct_option: input.correctOption,
      is_active: true,
      created_at: new Date().toISOString(),
    };
    store.questions.unshift(question);
    return { id: question.id };
  });
}

export async function submitLocalPracticeAttempt(input: {
  questionId: string;
  username: string;
  selectedOption: number;
}) {
  return updateStore((store) => {
    const question = store.questions.find(
      (item) => item.id === input.questionId && item.is_active,
    );
    if (!question || input.selectedOption >= question.options.length) return null;

    const isCorrect = input.selectedOption === question.correct_option;
    const attempt: LocalPracticeAttempt = {
      id: randomUUID(),
      question_id: question.id,
      username: input.username,
      selected_option: input.selectedOption,
      is_correct: isCorrect,
      score: isCorrect ? 100 : 0,
      submitted_at: new Date().toISOString(),
    };
    store.attempts.unshift(attempt);
    return {
      attempt_id: attempt.id,
      is_correct: isCorrect,
      score: attempt.score,
    };
  });
}

export function getPresetStudentUsernames() {
  return presetAccounts
    .filter((account) => account.role === "siswa")
    .map((account) => account.username);
}

export async function saveLocalQuizAttempt(input: {
  submissionId: string;
  username: string;
  subject: QuizSubject;
  level: QuizLevel;
  answers: QuizOptionLabel[];
}) {
  return updateStore((store) => {
    const existing = store.quizAttempts.find(
      (attempt) =>
        attempt.submission_id === input.submissionId && attempt.username === input.username,
    );
    if (existing) return existing;

    const questions = getQuizQuestions(input.subject, input.level);
    if (input.answers.length !== questions.length) return null;

    const correctAnswers = questions.reduce(
      (total, question, index) => total + (input.answers[index] === question.answer ? 1 : 0),
      0,
    );
    const attempt: LocalQuizAttempt = {
      id: randomUUID(),
      submission_id: input.submissionId,
      username: input.username,
      subject: input.subject,
      level: input.level,
      score: Math.round((correctAnswers / questions.length) * 100),
      correct_answers: correctAnswers,
      total_questions: questions.length,
      completed_at: new Date().toISOString(),
    };
    store.quizAttempts.unshift(attempt);
    return attempt;
  });
}