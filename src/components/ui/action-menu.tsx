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

interface ActionMenuProps {
  onEdit?: string;
  onView?: string;
  onContact?: string;
  onDelete?: React.ReactNode;
  customActions?: { label: string; onClick: () => void }[];
}

export function ActionMenu({
  onEdit,
  onView,
  onDelete,
  onContact,
  customActions,
}: ActionMenuProps) {
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
            <Link target="_blank" href={onContact}>Contact</Link>
          </DropdownMenuItem>
        )}
        {onEdit && (
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
        {onDelete && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>{onDelete}</DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
