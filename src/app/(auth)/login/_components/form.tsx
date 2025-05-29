"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import React from "react";
import { ActionResult } from "@/types";
import { useActionState } from "react";
import { LoginAction } from "../lib/actions";
import { useFormStatus } from "react-dom";
const initialState: ActionResult = {error: ''}

// Submit button component
function SubmitButton() {
  const { pending } = useFormStatus()
  
  return (
    <Button
      className="w-full bg-[#8e8e4b] hover:bg-[#8e8e4b]/90 text-white font-semibold py-3 px-4 rounded-sm transition-colors text-base sm:text-lg"
      type="submit"
      disabled={pending}
    >
      {pending ? 'Signing in...' : 'Sign in'}
    </Button>
  );
}

export default function LoginForm() {
     const [state, formAction] = useActionState(LoginAction, initialState)

    console.log(state)
  
     return (
       <form className="mt-8 space-y-6" action={formAction}>
         {/* Error Alert */}
         {state.error !== "" && (
           <Alert variant="destructive" className="">
             <AlertCircle className="h-4 w-4" />
             <AlertDescription>
               {state.error}
             </AlertDescription>
           </Alert>
         )}
         <div className="space-y-5">
           <div>
             <Label
               htmlFor="email"
               className="block text-sm font-medium text-gray-700 dark:text-gray-300"
             >
               Email
             </Label>
             <div className="mt-2">
               <Input
                 type="text"
                 name="email"
                 id="email"
                 autoComplete="email"
                 placeholder="Enter your email address"
                 className="block w-full rounded-sm border-0 px-4 py-3 text-gray-900 dark:text-white dark:bg-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#8e8e4b] dark:focus:ring-[#8e8e4b] sm:text-sm transition-colors"
               />
             </div>
           </div>

           <div>
             <div className="flex items-center justify-between">
               <Label
                 htmlFor="password"
                 className="block text-sm font-medium text-gray-700 dark:text-gray-300"
               >
                 Password
               </Label>
             </div>
             <div className="mt-2">
               <Input
                 type="password"
                 name="password"
                 id="password"
                 autoComplete="current-password"
                 placeholder="Enter your password"
                 className="block w-full rounded-sm border-0 px-4 py-3 text-gray-900 dark:text-white dark:bg-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#8e8e4b] dark:focus:ring-[#8e8e4b] sm:text-sm transition-colors"
               />
             </div>
           </div>
         </div>

         <div>
           <SubmitButton />
         </div>
       </form>
     );
}
