"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Users,
  Clock,
  RotateCcw,
  Timer,
  CheckCircle2,
  Copy,
  ArrowRight,
  UserPlus,
} from "lucide-react";

interface Job {
  id: string;
  title: string;
  description: string | null;
  prep_time_seconds: number;
  max_do_overs: number;
  max_answer_seconds: number;
  is_active: boolean;
}

interface Question {
  id: string;
  prompt_text: string;
  order_index: number;
}

interface Candidate {
  id: string;
  full_name: string | null;
  email: string | null;
  status: string;
  invite_token: string;
  completed_at: string | null;
  created_at: string;
}

const STAGES = ["Pending", "Shortlisted", "Approved", "Rejected"];

const STATUS_VARIANT: Record<string, "secondary" | "warning" | "success" | "destructive" | "default"> = {
  Pending: "secondary",
  Shortlisted: "warning",
  Approved: "success",
  Rejected: "destructive",
};

export default function JobDetailTabs({
  job: initialJob,
  questions: initialQuestions,
  candidates: initialCandidates,
}: {
  job: Job;
  questions: Question[];
  candidates: Candidate[];
}) {
  const router = useRouter();
  const [candidates, setCandidates] = useState(initialCandidates);

  // Questions state
  const [questionTexts, setQuestionTexts] = useState<string[]>(() => {
    const texts = Array(5).fill("");
    initialQuestions.forEach((q) => {
      texts[q.order_index - 1] = q.prompt_text;
    });
    return texts;
  });
  const [savingQuestions, setSavingQuestions] = useState(false);

  // Settings state
  const [title, setTitle] = useState(initialJob.title);
  const [description, setDescription] = useState(initialJob.description || "");
  const [prepTime, setPrepTime] = useState(initialJob.prep_time_seconds);
  const [maxDoOvers, setMaxDoOvers] = useState(initialJob.max_do_overs);
  const [maxAnswerSeconds, setMaxAnswerSeconds] = useState(initialJob.max_answer_seconds);
  const [savingSettings, setSavingSettings] = useState(false);

  // Add candidate state
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [addingCandidate, setAddingCandidate] = useState(false);
  const [addError, setAddError] = useState("");
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  async function saveQuestions() {
    setSavingQuestions(true);
    const filtered = questionTexts.filter((t) => t.trim() !== "");
    await fetch(`/api/admin/jobs/${initialJob.id}/questions`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ questions: filtered }),
    });
    setSavingQuestions(false);
    router.refresh();
  }

  async function saveSettings() {
    setSavingSettings(true);
    await fetch(`/api/admin/jobs/${initialJob.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        description,
        prep_time_seconds: prepTime,
        max_do_overs: maxDoOvers,
        max_answer_seconds: maxAnswerSeconds,
      }),
    });
    setSavingSettings(false);
    router.refresh();
  }

  async function addCandidate(e: React.FormEvent) {
    e.preventDefault();
    setAddingCandidate(true);
    setAddError("");
    const res = await fetch(`/api/admin/jobs/${initialJob.id}/candidates`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ full_name: newName, email: newEmail }),
    });
    if (res.ok) {
      const { candidate } = await res.json();
      setCandidates((prev) => [candidate, ...prev]);
      setNewName("");
      setNewEmail("");
    } else {
      const body = await res.json().catch(() => ({}));
      setAddError(body.error || "Failed to add candidate");
    }
    setAddingCandidate(false);
  }

  function copyInviteLink(candidate: Candidate) {
    const link = `${window.location.origin}/interview/${candidate.invite_token}`;
    navigator.clipboard.writeText(link);
    setCopiedToken(candidate.id);
    setTimeout(() => setCopiedToken(null), 2000);
  }

  return (
    <div className="mx-auto max-w-4xl">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          {initialJob.title}
        </h1>
        <Badge variant={initialJob.is_active ? "success" : "secondary"}>
          {initialJob.is_active ? "Active" : "Closed"}
        </Badge>
      </div>

      <Tabs defaultValue="overview" className="mt-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="pipeline">Pipeline</TabsTrigger>
          <TabsTrigger value="questions">Questions</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        {/* Overview */}
        <TabsContent value="overview" className="space-y-6">
          {initialJob.description && (
            <p className="text-muted-foreground">{initialJob.description}</p>
          )}

          <div className="grid gap-4 sm:grid-cols-4">
            {STAGES.map((stage) => {
              const count = candidates.filter((c) => c.status === stage).length;
              return (
                <Card key={stage}>
                  <CardContent className="p-4 text-center">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      {stage}
                    </p>
                    <p className="mt-1 text-3xl font-bold">{count}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Users className="h-4 w-4" /> {candidates.length} candidates
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" /> {initialQuestions.length}/5 questions
            </span>
            <span className="flex items-center gap-1.5">
              <Timer className="h-4 w-4" /> {initialJob.prep_time_seconds}s prep
            </span>
            <span className="flex items-center gap-1.5">
              <RotateCcw className="h-4 w-4" /> {initialJob.max_do_overs} re-records
            </span>
          </div>
        </TabsContent>

        {/* Pipeline */}
        <TabsContent value="pipeline" className="space-y-6">
          <Card>
            <CardContent className="p-4">
              <form onSubmit={addCandidate} className="flex items-end gap-3">
                <div className="flex-1">
                  <Label htmlFor="cand-name" className="text-xs text-muted-foreground">Name</Label>
                  <Input
                    id="cand-name"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    required
                    className="mt-1"
                    placeholder="Jane Smith"
                  />
                </div>
                <div className="flex-1">
                  <Label htmlFor="cand-email" className="text-xs text-muted-foreground">Email</Label>
                  <Input
                    id="cand-email"
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    required
                    className="mt-1"
                    placeholder="jane@example.com"
                  />
                </div>
                <Button type="submit" disabled={addingCandidate} size="sm">
                  <UserPlus className="mr-2 h-4 w-4" />
                  {addingCandidate ? "Adding..." : "Add"}
                </Button>
              </form>
              {addError && (
                <p className="mt-2 text-sm text-destructive">{addError}</p>
              )}
            </CardContent>
          </Card>

          {candidates.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No candidates yet. Add one above to get started.
            </p>
          ) : (
            <Card>
              <div className="divide-y divide-border">
                {candidates.map((c) => (
                  <div key={c.id} className="flex items-center gap-4 px-4 py-3">
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/candidates/${c.id}`}
                        className="text-sm font-medium text-foreground hover:underline"
                      >
                        {c.full_name || "Unknown"}
                      </Link>
                      {c.email && (
                        <p className="text-xs text-muted-foreground truncate">{c.email}</p>
                      )}
                    </div>
                    <Badge variant={STATUS_VARIANT[c.status] || "secondary"}>
                      {c.status}
                    </Badge>
                    {c.completed_at && (
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    )}
                    <button
                      onClick={() => copyInviteLink(c)}
                      className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-accent"
                      title="Copy invite link"
                    >
                      {copiedToken === c.id ? (
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </Card>
          )}

          <Button asChild variant="outline">
            <Link href={`/jobs/${initialJob.id}/pipeline`}>
              Open Kanban
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </TabsContent>

        {/* Questions */}
        <TabsContent value="questions" className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Add up to 5 interview questions. Candidates will answer them in order.
          </p>
          {questionTexts.map((text, i) => (
            <div key={i}>
              <Label className="text-xs text-muted-foreground">Question {i + 1}</Label>
              <Textarea
                value={text}
                onChange={(e) => {
                  const updated = [...questionTexts];
                  updated[i] = e.target.value;
                  setQuestionTexts(updated);
                }}
                rows={2}
                className="mt-1"
                placeholder={`Enter question ${i + 1}...`}
              />
            </div>
          ))}
          <Button onClick={saveQuestions} disabled={savingQuestions}>
            {savingQuestions ? "Saving..." : "Save questions"}
          </Button>
        </TabsContent>

        {/* Settings */}
        <TabsContent value="settings">
          <div className="max-w-lg space-y-6">
            <div>
              <Label htmlFor="job-title">Job title</Label>
              <Input
                id="job-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="job-desc">Description</Label>
              <Textarea
                id="job-desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="mt-1"
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="prep-time" className="text-xs">Prep time (sec)</Label>
                <Input
                  id="prep-time"
                  type="number"
                  value={prepTime}
                  onChange={(e) => setPrepTime(Number(e.target.value))}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="do-overs" className="text-xs">Max do-overs</Label>
                <Input
                  id="do-overs"
                  type="number"
                  value={maxDoOvers}
                  onChange={(e) => setMaxDoOvers(Number(e.target.value))}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="max-answer" className="text-xs">Max answer (sec)</Label>
                <Input
                  id="max-answer"
                  type="number"
                  value={maxAnswerSeconds}
                  onChange={(e) => setMaxAnswerSeconds(Number(e.target.value))}
                  className="mt-1"
                />
              </div>
            </div>
            <Button onClick={saveSettings} disabled={savingSettings}>
              {savingSettings ? "Saving..." : "Save settings"}
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
