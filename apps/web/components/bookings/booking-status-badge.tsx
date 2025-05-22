import { BookingStatus } from "@vibewell/types";

interface BookingStatusBadgeProps {
  status: BookingStatus;
}

export function BookingStatusBadge({ status }: BookingStatusBadgeProps) {
  const getStatusBadgeColor = (status: BookingStatus) => {
    switch (status) {
      case BookingStatus.PENDING:
        return "bg-yellow-50 text-yellow-700 ring-yellow-600/20";
      case BookingStatus.CONFIRMED:
        return "bg-blue-50 text-blue-700 ring-blue-600/20";
      case BookingStatus.COMPLETED:
        return "bg-green-50 text-green-700 ring-green-600/20";
      case BookingStatus.CANCELLED:
        return "bg-red-50 text-red-700 ring-red-600/20";
      case BookingStatus.NO_SHOW:
        return "bg-gray-50 text-gray-700 ring-gray-600/20";
      default:
        return "bg-gray-50 text-gray-700 ring-gray-600/20";
    }
  };

  return (
    <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset ${getStatusBadgeColor(status)}`}>
      {status}
    </span>
  );
} 