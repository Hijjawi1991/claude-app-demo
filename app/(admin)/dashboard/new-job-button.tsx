"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NewJobButton({
  isPro,
  jobCount,
}: {
  isPro: boolean;
  jobCount: number;
}) {
  if (!isPro && jobCount >= 1) {
    return (
      <Button asChild variant="outline">
        <Link href="/pricing">
          <Plus className="mr-2 h-4 w-4" />
          Upgrade to add more jobs
        </Link>
      </Button>
    );
  }

  return (
    <Button asChild>
      <Link href="/jobs/new">
        <Plus className="mr-2 h-4 w-4" />
        New job
      </Link>
    </Button>
  );
}
