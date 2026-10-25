import { redirect } from "next/navigation";
import { TeacherDashboard } from "@/components/teacher/teacher-dashboard";
import type {
  TeacherAttempt,
  TeacherCheckin,
  TeacherQuestion,
  TeacherQuizResult,
  TeacherStudentSummary,
} from "@/components/teacher/teacher-dashboard";
import { getAuthContext } from "@/lib/auth/session";
import {
  getLocalLearningSnapshot,
  getPresetStudentUsernames,
} from "@/lib/local-learning-store";

export const runtime = "nodejs";

export default async function TeacherDashboardPage() {
  const auth = await getAuthContext();
  if (!auth) redirect("/login");
  if (auth.profile.role !== "guru") redirect("/ruang-belajar");

  const store = await getLocalLearningSnapshot();
  const studentSummaries = new Map<string, TeacherStudentSummary>(
    getPresetStudentUsernames().map((username) => [username, {
      id: username,
      username,
      checkins: [],
      attempts: [],
      quizResults: [],
    }]),
  );
  const questions = store.questions.map((question) => ({
    id: question.id,
    title: question.title,
    prompt: question.prompt,
    options: question.options,
    isActive: question.is_active,
    createdAt: question.created_at,
  })) satisfies TeacherQuestion[];
  const questionNames = new Map(questions.map((question) => [question.id, question.title]));
  const questionOptions = new Map(questions.map((question) => [question.id, question.options]));

  for (const checkin of store.checkins) {
    const student = studentSummaries.get(checkin.username);
    if (!student) continue;
    const mappedCheckin: TeacherCheckin = {
      id: checkin.id,
      student: checkin.username,
      createdAt: checkin.created_at,
      checkinDate: checkin.checkin_date,
      dayOfWeek: checkin.day_of_week,
      mood: checkin.mood_score,
      energy: checkin.energy_level,
      focus: checkin.focus_level,
      workload: checkin.workload_level,
      priority: checkin.analysis.priority,
      safetyFlag: checkin.analysis.safety_flag,
      summary: checkin.analysis.ai_summary,
    };
    student.checkins.push(mappedCheckin);
  }

  for (const attempt of store.attempts) {
    const student = studentSummaries.get(attempt.username);
    if (!student) continue;
    const mappedAttempt: TeacherAttempt = {
      id: attempt.id,
      student: attempt.username,
      question: questionNames.get(attempt.question_id) ?? "Soal dihapus",
      answer: questionOptions.get(attempt.question_id)?.[attempt.selected_option] ?? `Pilihan ${attempt.selected_option + 1}`,
      isCorrect: attempt.is_correct,
      score: attempt.score,
      submittedAt: attempt.submitted_at,
    };
    student.attempts.push(mappedAttempt);
  }

  for (const attempt of store.quizAttempts) {
    const student = studentSummaries.get(attempt.username);
    if (!student) continue;
    const result: TeacherQuizResult = {
      id: attempt.id,
      subject: attempt.subject,
      level: attempt.level,
      score: attempt.score,
      correctAnswers: attempt.correct_answers,
      totalQuestions: attempt.total_questions,
      completedAt: attempt.completed_at,
    };
    student.quizResults.push(result);
  }

  return (
    <TeacherDashboard
      loadError={null}
      questions={questions}
      students={[...studentSummaries.values()]}
    />
  );
}