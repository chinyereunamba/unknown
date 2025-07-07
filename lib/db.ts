import { supabase } from "@/lib/supabase";

export async function upsertUser({
  email,
  name,
  image,
}: {
  email: string;
  name: string | null;
  image: string | null;
}) {
  const { data, error } = await supabase
    .from("users")
    .upsert([{ email, name, image }], { onConflict: "email" })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}
