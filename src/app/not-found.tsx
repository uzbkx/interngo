import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Search, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-24 flex flex-col items-center text-center">
      <h1 className="text-5xl font-bold text-muted-foreground/30 mb-2">404</h1>
      <h2 className="text-lg font-semibold mb-1">Page Not Found</h2>
      <p className="text-sm text-muted-foreground mb-6 max-w-sm">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <div className="flex gap-2">
        <Button variant="outline" size="sm" render={<Link href="/" />}>
          <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
          Home
        </Button>
        <Button size="sm" render={<Link href="/listings" />}>
          <Search className="mr-1.5 h-3.5 w-3.5" />
          Browse
        </Button>
      </div>
    </div>
  );
}
