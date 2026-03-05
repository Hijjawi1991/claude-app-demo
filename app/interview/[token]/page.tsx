"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";

interface Question {
  id: string;
  prompt_text: string;
  order_index: number;
}

interface InterviewData {
  job: {
    title: string;
    description: string;
    max_answer_seconds: number;
    prep_time_seconds: number;
    max_do_overs: number;
  };
  questions: Question[];
  candidate: { id: string; full_name: string };
}

type Phase = "consent" | "prep" | "recording" | "preview" | "submitting" | "submitted";

export default function InterviewPage({
  params,
}: {
  params: { token: string };
}) {
  const [data, setData] = useState<InterviewData | null>(null);
  const [error, setError] = useState("");
  const [currentQ, setCurrentQ] = useState(0);
  const [phase, setPhase] = useState<Phase>("consent");
  const [completed, setCompleted] = useState(false);
  const [submittedQuestions, setSubmittedQuestions] = useState<Set<number>>(new Set());

  // Timer
  const [timeLeft, setTimeLeft] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Recording
  const [elapsed, setElapsed] = useState(0);
  const [doOversUsed, setDoOversUsed] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [cameraReady, setCameraReady] = useState(false);

  // Load interview data
  useEffect(() => {
    async function load() {
      const res = await fetch(`/api/interview/${params.token}`);
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setError(body.error || "This interview link is invalid or has expired.");
        return;
      }
      setData(await res.json());
    }
    load();
  }, [params.token]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.muted = true;
        videoRef.current.play();
      }
      setCameraReady(true);
    } catch {
      setError("Camera/microphone access is required for the interview.");
    }
  }, []);

  function startPrep() {
    if (!data) return;
    setRecordedBlob(null);
    setPhase("prep");
    setTimeLeft(data.job.prep_time_seconds);

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          startRecording();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }

  function skipPrep() {
    if (timerRef.current) clearInterval(timerRef.current);
    startRecording();
  }

  function startRecording() {
    if (!streamRef.current || !data) return;
    chunksRef.current = [];
    setElapsed(0);
    setPhase("recording");

    const recorder = new MediaRecorder(streamRef.current, {
      mimeType: MediaRecorder.isTypeSupported("video/webm;codecs=vp9")
        ? "video/webm;codecs=vp9"
        : "video/webm",
    });

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };

    recorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: "video/webm" });
      setRecordedBlob(blob);
      setPhase("preview");

      // Show recorded video in player
      if (videoRef.current) {
        videoRef.current.srcObject = null;
        videoRef.current.src = URL.createObjectURL(blob);
        videoRef.current.muted = false;
        videoRef.current.controls = true;
      }
    };

    mediaRecorderRef.current = recorder;
    recorder.start(1000);

    // Elapsed timer
    const maxSec = data.job.max_answer_seconds;
    timerRef.current = setInterval(() => {
      setElapsed((prev) => {
        const next = prev + 1;
        if (next >= maxSec) {
          stopRecording();
        }
        return next;
      });
    }, 1000);
  }

  function stopRecording() {
    if (timerRef.current) clearInterval(timerRef.current);
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      mediaRecorderRef.current.stop();
    }
  }

  async function submitAnswer() {
    if (!data || !recordedBlob) return;
    setPhase("submitting");

    const question = data.questions[currentQ];

    // 1. Get signed upload URL
    const intentRes = await fetch(
      `/api/interview/${params.token}/upload-intent`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderIndex: question.order_index }),
      }
    );
    const { signedUrl, path } = await intentRes.json();

    // 2. Upload blob to Storage
    await fetch(signedUrl, {
      method: "PUT",
      headers: { "Content-Type": "video/webm" },
      body: recordedBlob,
    });

    // 3. Save answer metadata
    await fetch(`/api/interview/${params.token}/submit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        questionId: question.id,
        videoPath: path,
        videoUrl: path,
        durationSeconds: elapsed,
        doOversUsed: doOversUsed,
      }),
    });

    setSubmittedQuestions((prev) => new Set(prev).add(currentQ));
    setPhase("submitted");
  }

  function reRecord() {
    setDoOversUsed((prev) => prev + 1);
    setRecordedBlob(null);
    // Restart camera preview
    if (videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
      videoRef.current.muted = true;
      videoRef.current.controls = false;
      videoRef.current.play();
    }
    startPrep();
  }

  function goToNextQuestion() {
    setDoOversUsed(0);
    setRecordedBlob(null);

    if (currentQ < data!.questions.length - 1) {
      setCurrentQ((prev) => prev + 1);
      // Restart camera preview
      if (videoRef.current && streamRef.current) {
        videoRef.current.srcObject = streamRef.current;
        videoRef.current.muted = true;
        videoRef.current.controls = false;
        videoRef.current.play();
      }
      startPrep();
    } else {
      // All questions done — complete interview
      completeInterview();
    }
  }

  async function completeInterview() {
    await fetch(`/api/interview/${params.token}/complete`, { method: "POST" });
    // Stop camera
    streamRef.current?.getTracks().forEach((t) => t.stop());
    setCompleted(true);
  }

  // ── Render ──

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-6">
        <p className="text-center text-red-600">{error}</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-gray-500">Loading interview...</p>
      </div>
    );
  }

  if (completed) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-2xl text-green-600">
            &#10003;
          </div>
          <h1 className="mt-6 text-2xl font-bold text-gray-900">
            Thanks, {data.candidate.full_name}!
          </h1>
          <p className="mt-4 text-gray-600">
            Your responses have been submitted. You can close this tab.
          </p>
        </div>
      </div>
    );
  }

  // ── Consent screen ──
  if (phase === "consent") {
    return (
      <div className="flex min-h-screen items-center justify-center gradient-hero px-6">
        <div className="max-w-lg text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            {data.job.title}
          </h1>
          {data.job.description && (
            <p className="mt-4 text-gray-600">{data.job.description}</p>
          )}
          <div className="mx-auto mt-8 max-w-sm rounded-xl border border-gray-100 bg-white p-6 text-left text-sm text-gray-600 shadow-sm">
            <p className="font-semibold text-gray-900">How it works</p>
            <ul className="mt-3 space-y-2">
              <li>&#8226; {data.questions.length} questions, answered in order</li>
              <li>&#8226; {data.job.prep_time_seconds}s prep time before each question</li>
              <li>&#8226; Up to {data.job.max_answer_seconds}s to record each answer</li>
              <li>&#8226; {data.job.max_do_overs} re-record{data.job.max_do_overs !== 1 ? "s" : ""} allowed per question</li>
            </ul>
            <p className="mt-4 text-xs text-gray-400">
              We&apos;ll need access to your camera and microphone.
            </p>
          </div>
          <Button
            className="mt-8"
            size="lg"
            onClick={async () => {
              await startCamera();
              startPrep();
            }}
          >
            Begin interview
          </Button>
        </div>
      </div>
    );
  }

  const question = data.questions[currentQ];
  const canReRecord = doOversUsed < data.job.max_do_overs;

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      {/* Progress bar */}
      <div className="flex gap-1 px-6 pt-4">
        {data.questions.map((_, i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full ${
              submittedQuestions.has(i)
                ? "bg-green-500"
                : i === currentQ
                  ? "bg-brand-600"
                  : "bg-gray-200"
            }`}
          />
        ))}
      </div>

      <div className="flex flex-1 flex-col items-center justify-center px-6 py-8">
        <div className="w-full max-w-2xl">
          <p className="text-sm text-gray-500">
            Question {currentQ + 1} of {data.questions.length}
          </p>
          <h2 className="mt-2 text-xl font-bold text-gray-900">
            {question.prompt_text}
          </h2>

          {/* Video area */}
          <div className="relative mt-6 aspect-video overflow-hidden rounded-lg bg-black">
            <video
              ref={videoRef}
              className="h-full w-full object-cover"
              playsInline
            />

            {/* Prep countdown overlay */}
            {phase === "prep" && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 text-white">
                <p className="text-sm">Get ready...</p>
                <p className="mt-2 text-5xl font-bold">{timeLeft}</p>
                <button
                  onClick={skipPrep}
                  className="mt-4 text-sm text-gray-300 underline"
                >
                  Skip prep
                </button>
              </div>
            )}

            {/* Recording indicator */}
            {phase === "recording" && (
              <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full bg-red-600 px-3 py-1 text-xs font-medium text-white">
                <span className="h-2 w-2 animate-pulse rounded-full bg-white" />
                REC {elapsed}s / {data.job.max_answer_seconds}s
              </div>
            )}

            {/* Submitting overlay */}
            {phase === "submitting" && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/60 text-white">
                <p>Uploading...</p>
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="mt-6 flex items-center justify-between">
            <div className="text-sm text-gray-500">
              {phase === "prep" && "Preparing..."}
              {phase === "recording" && "Recording — click Stop when done"}
              {phase === "preview" && "Review your recording"}
              {phase === "submitted" && (
                <span className="text-green-600">Answer saved &#10003;</span>
              )}
            </div>

            <div className="flex gap-3">
              {phase === "recording" && (
                <Button variant="destructive" onClick={stopRecording}>
                  Stop recording
                </Button>
              )}

              {phase === "preview" && (
                <>
                  {canReRecord && (
                    <Button variant="outline" onClick={reRecord}>
                      Re-record ({data.job.max_do_overs - doOversUsed} left)
                    </Button>
                  )}
                  <Button onClick={submitAnswer}>Submit answer</Button>
                </>
              )}

              {phase === "submitted" && (
                <Button onClick={goToNextQuestion}>
                  {currentQ < data.questions.length - 1
                    ? "Next question"
                    : "Finish interview"}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
