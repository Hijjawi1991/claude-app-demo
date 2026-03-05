import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import CandidateReviewClient from "./candidate-review-client";

export default async function CandidateReviewPage({
  params,
}: {
  params: { candidateId: string };
}) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: candidate } = await supabase
    .from("candidates")
    .select("*, jobs!inner(owner_id, title)")
    .eq("id", params.candidateId)
    .single();

  if (!candidate || candidate.jobs.owner_id !== user!.id) {
    notFound();
  }

  const { data: answers } = await supabase
    .from("candidate_answers")
    .select("*, job_questions(prompt_text, order_index)")
    .eq("candidate_id", candidate.id)
    .order("submitted_at");

  // Generate signed URLs using admin client
  const admin = createAdminClient();
  const answersWithUrls = await Promise.all(
    (answers || []).map(async (answer) => {
      if (answer.video_path) {
        const { data } = await admin.storage
          .from("interviews")
          .createSignedUrl(answer.video_path, 3600);
        return { ...answer, video_url: data?.signedUrl || null };
      }
      return answer;
    })
  );

  return (
    <CandidateReviewClient
      candidate={candidate}
      answers={answersWithUrls}
    />
  );
}
