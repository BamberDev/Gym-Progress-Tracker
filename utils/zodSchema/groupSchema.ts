import { z } from "zod";

export const groupSchema = z.object({
  name: z
    .string()
    .min(1, "Name must be at least 1 character long")
    .max(50, "Name must not exceed 50 characters"),
  description: z
    .string()
    .min(1, "Description must be at least 1 character long")
    .max(100, "Description must not exceed 100 characters"),
});
