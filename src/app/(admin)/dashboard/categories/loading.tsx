import { TableSkeleton } from "@/components/ui/table-skeleton";

export default function Loading() {
  return <TableSkeleton title="Loading Categories..." rows={10} columns={5} />;
}
