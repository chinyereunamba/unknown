import { supabase } from "./supabase";

export async function getUserStats(userId: string) {
  // Count summaries
  const { count: summaryCount } = await supabase
    .from("summaries")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId);

  // Count crawled pages
  const { count: crawledCount } = await supabase
    .from("crawled_pages")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId);

  return {
    summaryCount: summaryCount ?? 0,
    crawledCount: crawledCount ?? 0,
  };
}
