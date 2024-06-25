'use client';

import * as z from 'zod';

// export const todoFormSchema = z.object({
//   title: z
//     .string({
//       required_error: 'Please enter a Title.'
//     })
//     .max(30, {
//       message: 'Title must not be longer than 30 characters.'
//     }),
//   description: z.string().min(8, {
//     message: 'Description Must be at least 8 characters'
//   })
// });


export const todoFormSchema = z.object({
  name: z.string().nonempty("Name is required"),
  task: z.string().nonempty("Task is required"),
  transferPhoneNumber: z.string().nonempty("Transfer Phone Number is required"),
  aiVoice: z.string().nonempty("AI Voice is required"),
  metadataKey: z.string().nonempty("Metadata Key is required"),
  metadataValue: z.string().nonempty("Metadata Value is required"),
  scheduleTime: z.date().refine((date) => date >= new Date(), {
    message: "Schedule Time must be a future date",
  }),
  isActive: z.boolean(),
});

export const DisplayNameFormSchema = z.object({
  display_name: z
    .string()
    .min(2, {
      message: 'Display Name must be at least 2 characters.'
    })
    .max(30, {
      message: 'Display Name must not be longer than 30 characters.'
    })
});

export const EmailFormSchema = z.object({
  email: z.string().email()
});

export const UpdatePasswordFormSchema = z.object({
  password: z
    .string()
    .min(8, {
      message: 'Password must be at least 8 characters.'
    })
    .max(30, {
      message: 'Password must not be longer than 30 characters.'
    })
});

export type DisplayNameFormValues = z.infer<typeof DisplayNameFormSchema>;
export type EmailFormValues = z.infer<typeof EmailFormSchema>;
export type UpdatePasswordFormValues = z.infer<typeof UpdatePasswordFormSchema>;
export type todoFormValues = z.infer<typeof todoFormSchema>;
