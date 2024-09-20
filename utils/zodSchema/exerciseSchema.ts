import { z } from "zod";

export const exerciseSetSchema = z.object({
  reps: z
    .number()
    .min(1, "Reps must be at least 1")
    .max(20, "Reps must not exceed 20"),
  weight: z
    .number()
    .min(0.5, "Weight must be at least 0.5")
    .max(500, "Weight must not exceed 500 kg"),
});

export const exerciseSchema = z.object({
  name: z.string().min(1, "Exercise name must be at least 1 character long"),
  restTime: z
    .number()
    .positive("Rest time must be greater than 0")
    .max(30, "Rest time must not exceed 30 minutes")
    .nullable(),
  sets: z.array(exerciseSetSchema).min(1, "Please add at least one set"),
});
