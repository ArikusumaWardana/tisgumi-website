"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface PageHeaderProps {
  title: string;
  description: string;
  actionButton?: {
    label: string;
    onClick?: () => void;
    icon?: React.ReactNode;
    dialogContent?: React.ReactNode;
  };
}

export function PageHeader({
  title,
  description,
  actionButton,
}: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {title}
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {description}
        </p>
      </div>

      {actionButton &&
        (actionButton.dialogContent ? (
          <Dialog>
            <DialogTrigger asChild>
              <Button className="w-full md:w-auto">
                {actionButton.icon}
                {actionButton.label}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>{actionButton.label}</DialogTitle>
              </DialogHeader>
              {actionButton.dialogContent}
            </DialogContent>
          </Dialog>
        ) : (
          <Button className="w-full md:w-auto" onClick={actionButton.onClick}>
            {actionButton.icon}
            {actionButton.label}
          </Button>
        ))}
    </div>
  );
}
