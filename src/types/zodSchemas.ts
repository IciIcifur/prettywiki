import { z } from 'zod';

export const signInFormSchema = z.object({
  login: z
    .string()
    .min(5, 'Логин не может быть короче 5 символов')
    .max(32, 'Логин не может быть длиннее 32 символов'),
  password: z
    .string()
    .min(8, 'Пароль должен быть не менее 8 символов')
    .max(32, 'Пароль не может быть больше 32 символов'),
});

export type SignInFormSchemaType = z.output<typeof signInFormSchema>;

export const signUpFormSchema = z.object({
  login: z
    .string()
    .min(5, 'Логин не может быть короче 5 символов')
    .max(32, 'Логин не может быть длиннее 32 символов'),
  password: z
    .string()
    .min(8, 'Пароль должен быть не менее 8 символов')
    .max(32, 'Пароль не может быть больше 32 символов'),
  email: z
    .string()
    .email('Введите корректный адрес эл. почты')
    .max(32, 'Адрес эл. почты не может быть больше 32 символов')
    .optional(),
});

export type SignUpFormSchemaType = z.output<typeof signUpFormSchema>;
