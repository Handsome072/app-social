import { supaClient } from "./supaClient";

export async function getVoteId(
  userId: string,
  postId: string
): Promise<string | undefined> {
  const { data, error } = await supaClient
    .from('post_votes')
    .select('id')
    .eq('user_id', userId)
    .eq('post_id', postId)
    .single();
  return data?.id || undefined;
}