"use client";

import { useState } from "react";
import Link from "next/link";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
  useDraggable,
  useDroppable,
  type DragStartEvent,
  type DragEndEvent,
} from "@dnd-kit/core";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ArrowLeft, GripVertical, CheckCircle2 } from "lucide-react";

interface Candidate {
  id: string;
  full_name: string | null;
  email: string | null;
  status: string;
  invite_token: string;
  completed_at: string | null;
}

const STAGES = ["Pending", "Shortlisted", "Approved", "Rejected"] as const;

const COLUMN_COLORS: Record<string, string> = {
  Pending: "border-t-gray-400",
  Shortlisted: "border-t-yellow-400",
  Approved: "border-t-green-400",
  Rejected: "border-t-red-400",
};

export default function KanbanBoard({
  jobId,
  jobTitle,
  initialCandidates,
}: {
  jobId: string;
  jobTitle: string;
  initialCandidates: Candidate[];
}) {
  const [candidates, setCandidates] = useState(initialCandidates);
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    })
  );

  const activeCandidate = candidates.find((c) => c.id === activeId);

  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id as string);
  }

  async function handleDragEnd(event: DragEndEvent) {
    setActiveId(null);

    const { active, over } = event;
    if (!over) return;

    const candidateId = active.id as string;
    const newStatus = over.id as string;

    const candidate = candidates.find((c) => c.id === candidateId);
    if (!candidate || candidate.status === newStatus) return;
    if (!STAGES.includes(newStatus as (typeof STAGES)[number])) return;

    // Optimistic update
    const previous = [...candidates];
    setCandidates((prev) =>
      prev.map((c) =>
        c.id === candidateId ? { ...c, status: newStatus } : c
      )
    );

    // Fire API call
    const res = await fetch(`/api/admin/candidates/${candidateId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });

    if (!res.ok) {
      setCandidates(previous);
    }
  }

  return (
    <div>
      <div className="mb-6 flex items-center gap-3">
        <Link
          href={`/jobs/${jobId}`}
          className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-accent"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground">
            Pipeline
          </h1>
          <p className="text-sm text-muted-foreground">{jobTitle}</p>
        </div>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-4 gap-4">
          {STAGES.map((stage) => (
            <KanbanColumn
              key={stage}
              stage={stage}
              candidates={candidates.filter((c) => c.status === stage)}
              activeId={activeId}
            />
          ))}
        </div>

        <DragOverlay>
          {activeCandidate ? (
            <div className="w-64 scale-105 opacity-90">
              <CandidateCard candidate={activeCandidate} isDragOverlay />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}

function KanbanColumn({
  stage,
  candidates,
  activeId,
}: {
  stage: string;
  candidates: Candidate[];
  activeId: string | null;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: stage });

  return (
    <div
      ref={setNodeRef}
      className={`rounded-lg border-t-4 bg-muted/50 p-3 transition-colors ${
        COLUMN_COLORS[stage]
      } ${isOver ? "bg-accent/60" : ""}`}
    >
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-foreground">{stage}</h2>
        <Badge variant="secondary" className="text-xs">
          {candidates.length}
        </Badge>
      </div>
      <div className="space-y-2 min-h-[100px]">
        {candidates.map((c) => (
          <DraggableCandidateCard
            key={c.id}
            candidate={c}
            isDragging={activeId === c.id}
          />
        ))}
      </div>
    </div>
  );
}

function DraggableCandidateCard({
  candidate,
  isDragging,
}: {
  candidate: Candidate;
  isDragging: boolean;
}) {
  const { setNodeRef, listeners, attributes } = useDraggable({
    id: candidate.id,
  });

  return (
    <div ref={setNodeRef} className={isDragging ? "opacity-30" : ""}>
      <CandidateCard
        candidate={candidate}
        dragHandleProps={{ ...listeners, ...attributes }}
      />
    </div>
  );
}

function CandidateCard({
  candidate,
  isDragOverlay,
  dragHandleProps,
}: {
  candidate: Candidate;
  isDragOverlay?: boolean;
  dragHandleProps?: Record<string, unknown>;
}) {
  return (
    <Card
      className={`p-3 ${
        isDragOverlay ? "shadow-lg ring-2 ring-brand-400" : ""
      }`}
    >
      <div className="flex items-start gap-2">
        <button
          className="mt-0.5 cursor-grab text-muted-foreground hover:text-foreground active:cursor-grabbing"
          {...dragHandleProps}
        >
          <GripVertical className="h-4 w-4" />
        </button>
        <div className="flex-1 min-w-0">
          <Link
            href={`/candidates/${candidate.id}`}
            className="text-sm font-medium text-foreground hover:underline"
            onClick={(e) => isDragOverlay && e.preventDefault()}
          >
            {candidate.full_name || "Unknown"}
          </Link>
          {candidate.email && (
            <p className="text-xs text-muted-foreground truncate">
              {candidate.email}
            </p>
          )}
        </div>
        {candidate.completed_at && (
          <CheckCircle2 className="h-4 w-4 shrink-0 text-green-500" />
        )}
      </div>
    </Card>
  );
}
