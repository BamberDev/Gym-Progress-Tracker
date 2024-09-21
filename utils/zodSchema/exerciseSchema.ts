import { z } from "zod";

export const exerciseSetSchema = z.object({
  reps: z
    .number()
    .positive("Reps must be greater than 0")
    .max(30, "Reps must not exceed 30"),
  weight: z
    .number()
    .min(0.5, "Weight must be at least 0.5")
    .max(500, "Weight must not exceed 500"),
});

export const exerciseSchema = z.object({
  name: z
    .string()
    .min(1, "Exercise name must be at least 1 character long")
    .max(50, "Exercise name must not exceed 50 characters"),
  restTime: z
    .number()
    .positive("Rest time must be greater than 0")
    .step(0.5, "Rest time must be a multiple of 0.5")
    .max(30, "Rest time must not exceed 30 minutes")
    .nullable(),
  sets: z.array(exerciseSetSchema).min(1, "Please add at least one set"),
});
