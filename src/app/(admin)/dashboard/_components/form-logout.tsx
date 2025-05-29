"use client";

import { ActionResult } from "@/types";
import { LogOut } from "lucide-react";
import React from "react";
import { Logout } from "../lib/actions";
import { useActionState } from "react";

const intialState: ActionResult = {
    error: ''
}

export default function FormLogout() {

     const [state, formAction] = useActionState(Logout, intialState)

     return (
      
       <form action={formAction}>
           <button
             className="flex items-center gap-3 w-full px-3 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
           >
             <LogOut className="w-5 h-5" />
             <span>Logout</span>
           </button>
         </form>
     );
}


