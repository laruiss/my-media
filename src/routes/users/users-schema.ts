import { z } from 'zod'

const strongEnoughPasswordDict = {
  '1 digit': /\d/,
  '1 uppercase letter': /[A-Z]/,
  '1 lowercase letter': /[a-z]/,
  '1 special character': /[^A-Z0-9]/i,
} as const

export const createUserSchema = z.object({
  email: z.string().email({ message: 'The email should be a valid email' }),
  username: z.string({ required_error: 'The username is required', message: 'The username should be a string' })
    .min(3, 'Your username should be at least 3 characters')
    .max(20, 'Your username should be at most 20 characters'),
  password: z.string()
    .min(8, 'Your username should be at least 3 characters')
    .superRefine((value, ctx) => {
      const errors = Object.entries(strongEnoughPasswordDict)
        .filter(([, regex]) => !regex.test(value))
        .map(([key]) => key)
      if (errors.length > 0) {
        return ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Your password should contain at least ${errors.join(', ')}`,
        })
      }
    }),
})

export const userOutputSchema = z.object({
  id: z.number().int().positive(),
  email: z.string().email({ message: 'The email should be a valid email' }),
  username: z.string({ required_error: 'The username is required', message: 'The username should be a string' })
    .min(3, 'Your username should be at least 3 characters')
    .max(20, 'Your username should be at most 20 characters'),
})
