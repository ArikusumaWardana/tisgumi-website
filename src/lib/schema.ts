import { z } from "zod";

export const loginSchema = z.object({
     email: z.string({required_error: 'Email is required'}).email({message: 'Invalid email address'}),
     password: z.string({required_error: 'Password is required'}).min(8, {message: 'Password must be at least 8 characters long'}),
})

export const categorySchema = z.object({
     code: z.string({required_error: 'Code is required'}).min(4, {message: 'Code must be at least 4 characters long'}),
     name: z.string({required_error: 'Name is required'}).min(4, {message: 'Name must be at least 4 characters long'}),
})