import { z } from "zod";

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
