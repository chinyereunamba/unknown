import { Button } from "@heroui/button";
import { Card } from "@heroui/card";
import { Link as HeroLink } from "@heroui/link";

export default function SummaryPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Navbar */}
      <nav className="w-full flex items-center justify-between px-6 py-6">
        <div className="text-2xl font-extrabold tracking-tight">
          WebWhisper <span className="text-primary">AI</span>
        </div>
        <Button
          radius="full"
          color="default"
          variant="flat"
          className="font-semibold"
        >
          Sign In
        </Button>
      </nav>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4">
        <div className="w-full max-w-xl flex flex-col items-center justify-center text-center gap-8 py-12">
          <h1 className="font-extrabold text-4xl md:text-5xl mb-2">
            Here’s Your Summary
          </h1>
          <p className="text-lg text-neutral-500 mb-6">
            We’ve simplified the content for you—see the key points below.
          </p>

          {/* Summary Card */}
          <Card className="w-full rounded-xl shadow p-8 mb-6 text-left">
            <div className="text-neutral-700 text-lg">
              <span className="block font-semibold mb-2">Summary:</span>
              <span className="block text-neutral-500">
                This is a placeholder for your summarized content. It will be
                concise, clear, and easy to read.
              </span>
            </div>
          </Card>

          {/* Action Steps Card */}
          <Card className="w-full rounded-xl shadow p-8 mb-8 text-left">
            <div className="text-neutral-700 text-lg font-semibold mb-2">
              Action Steps:
            </div>
            <ul className="list-disc pl-5 text-neutral-600 space-y-2">
              <li>Review the summary above for key insights.</li>
              <li>Take action on the most important points.</li>
              <li>Share or save this summary for later.</li>
            </ul>
          </Card>

          {/* Back Button */}
          <HeroLink href="/" className="inline-block">
            <Button
              radius="xl"
              color="primary"
              className="px-6 py-3 font-semibold shadow text-lg"
            >
              Back to Home
            </Button>
          </HeroLink>
        </div>
      </main>
    </div>
  );
}
