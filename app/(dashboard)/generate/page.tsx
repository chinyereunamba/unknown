import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";


async function generateSummary(text: string): Promise<string> {
  return text.length > 100 ? text.slice(0, 100) + "..." : text;
}

export default async function GenerateSummaryPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/login");
  }


  return (
    <div>
      <h1>Generate Summary</h1>
      <form>
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
