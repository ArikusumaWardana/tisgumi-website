import { z } from "zod";

export const loginSchema = z.object({
     email: z.string({required_error: 'Email is required'}).email({message: 'Invalid email address'}),
     password: z.string({required_error: 'Password is required'}).min(8, {message: 'Password must be at least 8 characters long'}),
})

export const categorySchema = z.object({
     code: z.string({required_error: 'Code is required'}).min(4, {message: 'Code must be at least 4 characters long'}),
     name: z.string({required_error: 'Name is required'}).min(4, {message: 'Name must be at least 4 characters long'}),
})

export const customerSchema = z.object({
     code: z.string({required_error: 'Code is required'}).min(4, {message: 'Code must be at least 4 characters long'}),
     name: z.string({required_error: 'Name is required'}).min(4, {message: 'Name must be at least 4 characters long'}),
     phone: z.string({ required_error: 'Phone is required' }).min(10, { message: 'Phone must be at least 10 characters long' }),
     status: z.enum(['active', 'inactive'], { required_error: 'Status is required' }),
})

export const adminSchema = z.object({
     code: z.string({required_error: 'Code is required'}).min(4, {message: 'Code must be at least 4 characters long'}),
     name: z.string({ required_error: 'Name is required' }).min(4, { message: 'Name must be at least 4 characters long' }),
     email: z.string({ required_error: 'Email is required' }).email({ message: 'Invalid email address' }),
     phone: z.string({ required_error: 'Phone is required' }).min(10, { message: 'Phone must be at least 10 characters long' }),
     password: z.string({ required_error: 'Password is required' }).min(8, { message: 'Password must be at least 8 characters long' }),     
})

export const productSchema = z.object({
     code: z.string({required_error: 'Code is required'}).min(4, {message: 'Code must be at least 4 characters long'}),
     name: z.string({ required_error: 'Name is required' }).min(4, { message: 'Name must be at least 4 characters long' }),
     default_price: z.number({required_error: 'Price is required'}).min(0, {message: 'Price must be at least 0'}),
     status: z.enum(['active', 'inactive'], { required_error: 'Status is required' }),
     category_id: z.number({required_error: 'Category is required'}),
})

