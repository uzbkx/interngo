import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Search, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-20 flex flex-col items-center text-center">
      <h1 className="text-6xl font-bold text-muted-foreground mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-2">Page Not Found</h2>
      <p className="text-muted-foreground mb-8 max-w-md">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <div className="flex gap-3">
        <Button variant="outline" render={<Link href="/" />}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Home
        </Button>
        <Button render={<Link href="/listings" />}>
          <Search className="mr-2 h-4 w-4" />
          Browse Opportunities
        </Button>
      </div>
    </div>
  );
}
