import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";

// Dummy summary function (replace with your AI/LLM call)
async function generateSummary(text: string): Promise<string> {
  // Replace this with your real summary logic
  return text.length > 100 ? text.slice(0, 100) + "..." : text;
}

export default async function GenerateSummaryPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/login");
  }

  // Handle form submission
  async function handleSubmit(formData: FormData) {
    "use server";
    const title = formData.get("title") as string;
    const original_text = formData.get("original_text") as string;
    const summary_text = await generateSummary(original_text);

    await db.query(
      `INSERT INTO summaries (user_id, title, original_text, summary_text, created_at)
       VALUES ($1, $2, $3, $4, now())`,
      [session.user.id, title, original_text, summary_text]
    );
    // Optionally, redirect or show a message
  }

  return (
    <div>
      <h1>Generate Summary</h1>
      <form action={handleSubmit}>
        <div>
          <label>
            Title:
            <input
              name="title"
              type="text"
              required
              className="border p-1 rounded ml-2"
            />
          </label>
        </div>
        <div>
          <label>
            Text to summarize:
            <textarea
              name="original_text"
              required
              rows={6}
              className="border p-1 rounded ml-2 w-full"
            />
          </label>
        </div>
        <button
          type="submit"
          className="mt-2 px-4 py-2 bg-blue-600 text-white rounded"
        >
          Generate
        </button>
      </form>
    </div>
  );
}
