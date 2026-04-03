"use client";

import { Badge } from "@/components/ui/badge";
import { Clock, AlertTriangle, Flame } from "lucide-react";

interface DeadlineBadgeProps {
  deadline: Date | string;
}

export function DeadlineBadge({ deadline }: DeadlineBadgeProps) {
  const date = new Date(deadline);
  const now = new Date();
  const diff = date.getTime() - now.getTime();
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));

  if (days < 0) {
    return (
      <Badge variant="destructive" className="text-xs">
        Deadline passed
      </Badge>
    );
  }

  if (days === 0) {
    return (
      <Badge variant="destructive" className="text-xs animate-pulse">
        <Flame className="h-3 w-3 mr-1" />
        Last day!
      </Badge>
    );
  }

  if (days <= 3) {
    return (
      <Badge variant="destructive" className="text-xs">
        <AlertTriangle className="h-3 w-3 mr-1" />
        {days} day{days > 1 ? "s" : ""} left
      </Badge>
    );
  }

  if (days <= 7) {
    return (
      <Badge className="text-xs bg-orange-100 text-orange-800">
        <Clock className="h-3 w-3 mr-1" />
        {days} days left
      </Badge>
    );
  }

  if (days <= 30) {
    return (
      <Badge className="text-xs bg-yellow-100 text-yellow-800">
        <Clock className="h-3 w-3 mr-1" />
        {days} days left
      </Badge>
    );
  }

  return null;
}
