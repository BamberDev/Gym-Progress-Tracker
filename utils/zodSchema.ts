import { z } from "zod";

const historyEntrySchema = z.object({
  date: z.string(),
  averageWeight: z.number(),
  averageReps: z.number(),
});

export const exerciseSetSchema = z.object({
  reps: z
    .number()
    .positive("Reps must be greater than 0")
    .max(30, "Reps must not exceed 30"),
  weight: z
    .number()
    .min(0.5, "Weight must be at least 0.5")
    .step(0.5, "Weight must be a multiple of 0.5")
    .max(500, "Weight must not exceed 500"),
});

export const clientExerciseSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Exercise name must be at least 1 character long")
    .max(50, "Exercise name must not exceed 50 characters"),
  restTime: z
    .number()
    .positive("Rest time must be greater than 0")
    .step(0.5, "Rest time must be a multiple of 0.5")
    .max(30, "Rest time must not exceed 30 minutes")
    .nullable(),
  sets: z.array(exerciseSetSchema).min(1, "Please add at least one set"),
  history: z.array(historyEntrySchema).optional(),
});

export const serverExerciseSchema = clientExerciseSchema.extend({
  _id: z.string().optional(),
  userId: z.string(),
  userName: z.string(),
  groupId: z.string(),
});

export const clientGroupSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name must be at least 1 character long")
    .max(50, "Name must not exceed 50 characters"),
  description: z
    .string()
    .trim()
    .min(1, "Description must be at least 1 character long")
    .max(100, "Description must not exceed 100 characters"),
});

export const serverGroupSchema = clientGroupSchema.extend({
  _id: z.string().optional(),
  userId: z.string(),
});

export const timerSchema = z
  .number()
  .min(1, "Duration must be at least 1 second")
  .max(600, "Duration must not exceed 600 seconds");

export const validateForm = <T>(
  schema: z.ZodSchema<T>,
  data: T
): { valid: boolean; errors: { [key: string]: string } } => {
  try {
    schema.parse(data);
    return { valid: true, errors: {} };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: { [key: string]: string } = {};
      error.errors.forEach((err) => {
        if (err.path.length > 0) {
          errors[err.path[0] as string] = err.message;
        }
      });
      return { valid: false, errors };
    }
    return { valid: false, errors: {} };
  }
};
