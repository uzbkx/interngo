"use client";

import { Button } from "@/components/ui/button";
import { RefreshCw, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="container mx-auto px-4 py-20 flex flex-col items-center text-center">
      <h1 className="text-4xl font-bold mb-2">Something went wrong</h1>
      <p className="text-muted-foreground mb-8 max-w-md">
        An unexpected error occurred. Please try again or go back to the
        homepage.
      </p>
      <div className="flex gap-3">
        <Button variant="outline" render={<Link href="/" />}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Home
        </Button>
        <Button onClick={() => reset()}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Try Again
        </Button>
      </div>
    </div>
  );
}
