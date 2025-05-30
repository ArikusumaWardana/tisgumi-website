interface StatusBadgeProps {
  status?: string | null;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const getStatusStyles = (status?: string | null) => {
    if (!status) {
      return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400";
    }

    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400";
      case "inactive":
        return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400";
    }
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium capitalize ${getStatusStyles(
        status
      )}`}
    >
      {status || "Unknown"}
    </span>
  );
}
