"use client";

interface Toast {
  title: string;
  description?: string;
  variant?: "default" | "destructive";
}

interface ToastRef {
  toast: (toast: Toast) => void;
}

let toastRef: ToastRef | null = null;

export function useToast() {
  const toast = (toast: Toast) => {
    // Simple alert implementation for now
    // In a real application, you'd want to use a proper toast library
    const message = `${toast.title}${
      toast.description ? "\n" + toast.description : ""
    }`;
    alert(message);
  };

  // Store reference for external access
  toastRef = { toast };

  return { toast };
}

// Export function for external use
export const showToast = (toast: Toast) => {
  if (toastRef) {
    toastRef.toast(toast);
  } else {
    const message = `${toast.title}${
      toast.description ? "\n" + toast.description : ""
    }`;
    alert(message);
  }
};
