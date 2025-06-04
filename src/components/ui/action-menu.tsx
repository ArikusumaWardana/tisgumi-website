"use client";

import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { User } from "lucia";
import { canCreateOrEditClient, canDeleteClient } from "@/lib/client-auth";

interface ActionMenuProps {
  onEdit?: string;
  onView?: string;
  onContact?: string;
  onDelete?: React.ReactNode;
  customActions?: { label: string; onClick: () => void }[];
  user?: User | null;
  module?: "products" | "categories" | "customers";
  requiresSuperadmin?: boolean;
}

export function ActionMenu({
  onEdit,
  onView,
  onDelete,
  onContact,
  customActions,
  user,
  module,
  requiresSuperadmin = false,
}: ActionMenuProps) {
  const canEdit = () => {
    if (!requiresSuperadmin || !module || !user) return true;
    return canCreateOrEditClient(user.role);
  };

  const canDeleteAction = () => {
    if (!requiresSuperadmin || !module || !user) return true;
    return canDeleteClient(user.role);
  };

  const shouldShowMenu = () => {
    if (!requiresSuperadmin) return true;

    const hasEditPermission = onEdit && canEdit();
    const hasDeletePermission = onDelete && canDeleteAction();
    const hasViewPermission = onView;
    const hasContactPermission = onContact;
    const hasCustomActions = customActions && customActions.length > 0;

    return (
      hasEditPermission ||
      hasDeletePermission ||
      hasViewPermission ||
      hasContactPermission ||
      hasCustomActions
    );
  };

  if (!shouldShowMenu()) {
    return null;
  }

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" forceMount>
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {onContact && (
          <DropdownMenuItem asChild>
            <Link target="_blank" href={onContact}>
              Contact
            </Link>
          </DropdownMenuItem>
        )}
        {onEdit && canEdit() && (
          <DropdownMenuItem asChild>
            <Link href={onEdit}>Edit</Link>
          </DropdownMenuItem>
        )}
        {onView && (
          <DropdownMenuItem asChild>
            <Link href={onView}>View Details</Link>
          </DropdownMenuItem>
        )}
        {customActions?.map((action, index) => (
          <DropdownMenuItem key={index} onClick={action.onClick}>
            {action.label}
          </DropdownMenuItem>
        ))}
        {onDelete && canDeleteAction() && (
          <>
            <DropdownMenuSeparator />
            <div className="p-1">{onDelete}</div>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
