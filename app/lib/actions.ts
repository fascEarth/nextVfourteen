'use server';
import { sql } from "@vercel/postgres";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
import { auth } from '@/auth';
import bcrypt from 'bcrypt';

const FormSchema = z.object({
    id: z.string(),
    customerId: z.string({
        invalid_type_error:'Please select a customer.',
    }),
    amount: z.coerce.number().gt(0,{
        message:'Please enter an amount greater than $0'
    }),
    status: z.enum(['pending','paid'], {
        invalid_type_error:'Please select an invoice status.',
    } ),
    date: z.string()
});
export type State = {
    errors?: {
      customerId?: string[];
      amount?: string[];
      status?: string[];
    };
    message?: string | null;
  };


const UpdateInvoice = FormSchema.omit({id:true, date: true})

const CreateInvoice = FormSchema.omit({id:true,date:true});

export async function authenticate(
    prevState: string | undefined,
    formData: FormData,
  ) {
    try {
      await signIn('credentials', formData);
    } catch (error) {
      if (error instanceof AuthError) {
        switch (error.type) {
          case 'CredentialsSignin':
            return 'Invalid credentials.';
          default:
            return 'Something went wrong.';
        }
      }
      throw error;
    }
  }
  
export async function createInvoice(prevState: State, formData: FormData){
    const validatedFields = CreateInvoice.safeParse({
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status'),
      });
     
      // If form validation fails, return errors early. Otherwise, continue.
      if (!validatedFields.success) {
        return {
          errors: validatedFields.error.flatten().fieldErrors,
          message: 'Missing Fields. Failed to Create Invoice.',
        };
      }
    const { customerId, amount, status} =validatedFields.data;
   const amountInCents = amount * 100;
   const date = new Date().toISOString().split('T')[0];
    try {

        await sql`
        INSERT INTO invoices (customer_id, amount, status, date)
        VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
        `;

    } catch (error) {
        return {
            message: 'Database Error: Failed to create invoice'
        }
    }
   revalidatePath('/dashboard/invoices');
   redirect('/dashboard/invoices');
}

export async function updateInvoice(id:string,prevState: State,formData:FormData){
   

    const validatedFields = CreateInvoice.safeParse({
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status'),
      });
     
      // If form validation fails, return errors early. Otherwise, continue.
      if (!validatedFields.success) {
        return {
          errors: validatedFields.error.flatten().fieldErrors,
          message: 'Missing Fields. Failed to Update Invoice.',
        };
      }
    const { customerId, amount, status} =validatedFields.data;

    const amountInCents = amount * 100;
    try {    
        await sql`
        UPDATE invoices
        SET customer_id = ${customerId}, 
        amount = ${amountInCents}, status = ${status}
        WHERE id=${id}
        `;
    } catch (error) {
        return {
            message: 'Database Error: Failed to update invoice'
        }
    }
    revalidatePath('/dashboard/invoices');
    redirect('/dashboard/invoices');

}

export async function deleteInvoice(id: string){
    try {
        await sql`DELETE FROM invoices WHERE id = ${id}`;
        revalidatePath('/dashboard/invoices');
        return {  message : 'Deleted Invoice' };

    } catch (error) {
        return {
            message: 'Database Error: Failed to delete invoice'
        }
    }
    
}

const ProfileFormSchema = z.object({
  name: z.string().min(1, { message: 'Name is required.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  password: z.union([z.string().min(6, { message: 'Password must be at least 6 characters.' }), z.literal('')]),
  confirmPassword: z.string().optional().or(z.literal('')),
}).refine(
  (data) => !data.password || data.password === data.confirmPassword,
  { message: 'Passwords do not match.', path: ['confirmPassword'] }
);

export type ProfileState = {
  errors?: {
    name?: string[];
    email?: string[];
    password?: string[];
    confirmPassword?: string[];
  };
  message?: string | null;
  success?: boolean;
};

export async function updateUserProfile(prevState: ProfileState, formData: FormData): Promise<ProfileState> {
  const session = await auth();
  if (!session?.user?.id) {
    return { message: 'Not authenticated.' };
  }

  const validatedFields = ProfileFormSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password') || '',
    confirmPassword: formData.get('confirmPassword') || '',
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing or invalid fields. Failed to update profile.',
    };
  }

  const { name, email, password } = validatedFields.data;

  try {
    // Check if email is already in use by another user
    const existingUser = await sql`SELECT id FROM users WHERE email = ${email} AND id != ${session.user.id}`;
    if (existingUser.rows.length > 0) {
      return {
        errors: { email: ['This email is already in use by another account.'] },
        message: 'Failed to update profile.',
      };
    }

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      await sql`
        UPDATE users
        SET name = ${name}, email = ${email}, password = ${hashedPassword}
        WHERE id = ${session.user.id}
      `;
    } else {
      await sql`
        UPDATE users
        SET name = ${name}, email = ${email}
        WHERE id = ${session.user.id}
      `;
    }
  } catch (error) {
    return { message: 'Database Error: Failed to update profile.' };
  }

  revalidatePath('/dashboard/profile');
  return { message: 'Profile updated successfully.', success: true };
}