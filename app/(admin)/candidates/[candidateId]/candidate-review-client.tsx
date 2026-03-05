"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Clock, RotateCcw, CheckCircle2, User, Mail } from "lucide-react";

interface Answer {
  id: string;
  video_url: string | null;
  video_path: string;
  duration_seconds: number;
  do_overs_used: number;
  job_questions: {
    prompt_text: string;
    order_index: number;
  };
}

interface CandidateData {
  id: string;
  full_name: string | null;
  email: string | null;
  status: string;
  notes: string | null;
  completed_at: string | null;
  jobs: { title: string };
}

const STATUSES = ["Pending", "Shortlisted", "Approved", "Rejected"];

export default function CandidateReviewClient({
  candidate,
  answers,
}: {
  candidate: CandidateData;
  answers: Answer[];
}) {
  const router = useRouter();
  const [notes, setNotes] = useState(candidate.notes || "");

  const saveField = useCallback(
    async (data: Record<string, string>) => {
      await fetch(`/api/admin/candidates/${candidate.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      router.refresh();
    },
    [candidate.id, router]
  );

  async function handleStatusChange(newStatus: string) {
    await saveField({ status: newStatus });
  }

  function handleNotesBlur() {
    if (notes !== (candidate.notes || "")) {
      saveField({ notes });
    }
  }

  return (
    <div className="mx-auto max-w-5xl">
      <button
        onClick={() => router.back()}
        className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </button>

      <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
        {/* Left: video answers */}
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              {candidate.full_name || candidate.email || "Candidate"}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {candidate.jobs.title}
            </p>
          </div>

          {answers.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <p className="text-sm text-muted-foreground">
                  No responses recorded yet.
                </p>
              </CardContent>
            </Card>
          ) : (
            answers
              .sort(
                (a, b) =>
                  a.job_questions.order_index - b.job_questions.order_index
              )
              .map((answer) => (
                <Card key={answer.id}>
                  <CardContent className="p-5 space-y-4">
                    <div className="flex items-start gap-3">
                      <Badge variant="secondary" className="shrink-0">
                        Q{answer.job_questions.order_index}
                      </Badge>
                      <p className="font-medium text-foreground">
                        {answer.job_questions.prompt_text}
                      </p>
                    </div>

                    {answer.video_url ? (
                      <div className="aspect-video overflow-hidden rounded-lg bg-black">
                        <video
                          src={answer.video_url}
                          controls
                          className="h-full w-full"
                        />
                      </div>
                    ) : (
                      <div className="flex aspect-video items-center justify-center rounded-lg bg-muted text-sm text-muted-foreground">
                        Video unavailable
                      </div>
                    )}

                    <div className="flex gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {answer.duration_seconds}s
                      </span>
                      <span className="flex items-center gap-1">
                        <RotateCcw className="h-3.5 w-3.5" />
                        {answer.do_overs_used} re-records
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))
          )}
        </div>

        {/* Right: sidebar */}
        <div className="space-y-4">
          {/* Status */}
          <Card>
            <CardContent className="p-4 space-y-3">
              <Label className="text-xs text-muted-foreground">Status</Label>
              <Select
                defaultValue={candidate.status}
                onValueChange={handleStatusChange}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUSES.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Notes */}
          <Card>
            <CardContent className="p-4 space-y-3">
              <Label htmlFor="notes" className="text-xs text-muted-foreground">
                Notes
              </Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                onBlur={handleNotesBlur}
                rows={5}
                placeholder="Add private notes..."
              />
            </CardContent>
          </Card>

          {/* Candidate info */}
          <Card>
            <CardContent className="p-4 space-y-3">
              <Label className="text-xs text-muted-foreground">Info</Label>
              {candidate.full_name && (
                <div className="flex items-center gap-2 text-sm text-foreground">
                  <User className="h-4 w-4 text-muted-foreground" />
                  {candidate.full_name}
                </div>
              )}
              {candidate.email && (
                <div className="flex items-center gap-2 text-sm text-foreground">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  {candidate.email}
                </div>
              )}
              {candidate.completed_at && (
                <div className="flex items-center gap-2 text-sm text-green-600">
                  <CheckCircle2 className="h-4 w-4" />
                  Interview completed
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
