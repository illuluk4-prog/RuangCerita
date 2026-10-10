import { z } from "zod";

export const needCategories = [
  "study_planning",
  "subject_help",
  "motivation",
  "learning_conditions",
  "human_support",
  "general",
] as const;

export const priorities = ["low", "medium", "high", "urgent"] as const;

export const recommendedActions = [
  "study_planner",
  "flashcards",
  "ai_tutor",
  "human_support",
] as const;

export const aiAnalysisSchema = z
  .object({
    need_category: z.enum(needCategories),
    priority: z.enum(priorities),
    recommended_action: z.enum(recommendedActions),
    human_support_needed: z.boolean(),
    safety_flag: z.boolean(),
    ai_summary: z.string().trim().min(1).max(500),
  })
  .strict();

export const checkinRequestSchema = z
  .object({
    mood_score: z.number().int().min(1).max(5),
    energy_level: z.number().int().min(1).max(5),
    focus_level: z.number().int().min(1).max(5),
    workload_level: z.number().int().min(1).max(5),
    factors: z
      .array(
        z.enum([
          "hafalan",
          "tugas_padat",
          "kelelahan",
          "relasi_sosial",
          "adaptasi_asrama",
        ]),
      )
      .max(5),
    desired_support: z.enum([
      "study_planner",
      "flashcards",
      "ai_tutor",
      "human_support",
      "not_sure",
    ]),
    reflection_text: z.string().trim().max(500).default(""),
  })
  .strict();

export type CheckinRequest = z.infer<typeof checkinRequestSchema>;
export type AIAnalysis = z.infer<typeof aiAnalysisSchema>;