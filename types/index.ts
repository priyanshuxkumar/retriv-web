import { z } from 'zod';

export const EmailSchema = z.string().email({ message: 'Please enter a valid email.' }).trim();

const PasswordSchema = z
    .string()
    .min(8, { message: 'Be at least 8 characters long' })
    .regex(/[a-zA-Z]/, { message: 'Contain at least one letter.' })
    .regex(/[0-9]/, { message: 'Contain at least one number.' })
    .regex(/[^a-zA-Z0-9]/, {
        message: 'Contain at least one special character.',
    })
    .trim();

export const SigninFormSchema = z.object({
    email: EmailSchema,
    password: PasswordSchema,
});

export const SignupFormSchema = z.object({
    name: z.string({ message: 'Please enter a valid name' }),
    email: EmailSchema,
    password: PasswordSchema,
});

export const AgentSettingsSchema = z
    .object({
        responseLength: z.enum(['Balanced', 'Concise', 'Detailed']).optional(),
        enableSources: z.boolean().optional(),
    })
    .refine(
        (data) => {
            return data.responseLength !== undefined || data.enableSources !== undefined;
        },
        {
            message: 'At least one field must be provided.',
            path: ['responseLength'],
        },
    );

export const PaymentFormSchema = z.object({
    name: z.string({ message: 'Please enter a valid name' }),
    email: EmailSchema,
    mobileNumber: z.string({ message: 'Please enter valid number' }),
    terms: z.literal(true, {
        errorMap: () => ({ message: 'You must accept the terms and privacy policy' }),
    }),
});

export const ChatInputSchema = z.object({
    query: z.string(),
});
