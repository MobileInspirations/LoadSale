import { z } from "zod";

export const emailSchema = z.string().email();
export const passwordSchema = z.string().min(8, "Password must be at least 8 characters");

export const signUpSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  name: z.string().min(1, "Name is required"),
  role: z.enum(["buyer", "seller"]),
});

export const signInSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required"),
});

export type SignUpInput = z.infer<typeof signUpSchema>;
export type SignInInput = z.infer<typeof signInSchema>;
