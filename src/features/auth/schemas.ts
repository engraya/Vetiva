import { z } from 'zod';

export const bvnSchema = z.object({
  bvn: z.string().regex(/^\d{11}$/, 'BVN must be 11 digits'),
});
export type BvnFormValues = z.infer<typeof bvnSchema>;

export const confirmIdentitySchema = z.object({
  email: z.string().email('Enter a valid email address'),
});
export type ConfirmIdentityValues = z.infer<typeof confirmIdentitySchema>;

/** Alphanumeric, at least 8 characters — the prototype's rule. */
export const passwordRule = z
  .string()
  .regex(/^(?=.*[A-Za-z])(?=.*\d).{8,}$/, 'Use at least 8 characters with letters and numbers');

export const verifySchema = z
  .object({
    otp: z.string().length(6, 'Enter the 6-digit code'),
    password: passwordRule,
    confirmPassword: z.string(),
  })
  .refine((v) => v.password === v.confirmPassword, {
    path: ['confirmPassword'],
    message: "Passwords don't match",
  });
export type VerifyValues = z.infer<typeof verifySchema>;

export const loginSchema = z.object({
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(1, 'Enter your password'),
  biometric: z.boolean(),
});
export type LoginValues = z.infer<typeof loginSchema>;
