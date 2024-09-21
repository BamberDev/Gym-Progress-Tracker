import { z } from "zod";

export const timerSchema = z
  .number()
  .min(1, "Duration must be at least 1 second")
  .max(600, "Duration must not exceed 600 seconds");
