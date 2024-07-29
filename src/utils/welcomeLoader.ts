import { supaClient } from "./supaClient";
import { redirect } from "react-router-dom";

export async function welcomeLoader() {
  const {
    data: { user },
  } = await supaClient.auth.getUser();
  if (!user) {
    return redirect('/');
  }
  const { data } = await supaClient
    .from('user_profiles')
    .select('*')
    .eq('user_id', user?.id)
    .single();
  if (data?.username) {
    return redirect('/');
  }
  return null;
}