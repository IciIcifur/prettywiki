import { z } from 'zod';

export const signInFormSchema = z.object({
  login: z.string().min(5, 'zod.loginMin').max(32, 'zod.loginMax'),
  password: z.string().min(8, 'zod.passwordMin').max(32, 'zod.passwordMax'),
});

export type SignInFormSchemaType = z.output<typeof signInFormSchema>;

export const signUpFormSchema = z.object({
  login: z.string().min(5, 'zod.loginMin').max(32, 'zod.loginMax'),
  password: z.string().min(8, 'zod.passwordMin').max(32, 'zod.passwordMax'),
  email: z.string().email('zod.emailValid').max(32, 'zod.emailMax').optional(),
});

export type SignUpFormSchemaType = z.output<typeof signUpFormSchema>;
