'use client';
import { z } from 'zod';

export const todoFormSchema = z.object({
  name: z.string().nonempty("Name is required"),
  agentId: z.string().nonempty("Agent selection is required"),
  transferPhoneNumber: z.string().nonempty("Transfer Phone Number is required"),
  aiVoice: z.string().nonempty("AI Voice is required"),
  scheduleTime: z.date().refine(date => date >= new Date(), {
    message: "Schedule Time must be a future date",
  }),
  isActive: z.boolean(),
  model: z.string().optional().default('default_model'),
  language: z.string().optional().default('en'),
  localDialing: z.boolean().optional().default(false),
  maxDuration: z.number().optional().default(12),
  answeredByEnabled: z.boolean().optional().default(false),
  waitForGreeting: z.boolean().optional().default(false),
  record: z.boolean().optional().default(false),
  amd: z.boolean().optional().default(false),
  interruptionThreshold: z.number().optional().default(100),
  voicemailMessage: z.string().optional().nullable().default(''),
  temperature: z.number().optional().nullable().default(0.7),
  transferList: z.string().optional().default('{}'),
  metadata: z.string().optional().default('{}'),
  pronunciationGuide: z.string().optional().default('[]'),
  startTime: z.date().optional().nullable(),
  requestData: z.string().optional().default('{}'),
  tools: z.string().optional().default('[]'),
  webhook: z.string().optional().nullable().default(''),
  calendly: z.string().optional().default('{}'),
  customerCallList: z.string().nonempty("Customer Call List is required"), // Make it required
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