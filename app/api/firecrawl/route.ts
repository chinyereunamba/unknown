// app/api/firecrawl/route.ts

export async function POST(req: Request) {
  const { url } = await req.json();

  if (!url) {
    return new Response(JSON.stringify({ error: "Missing URL" }), {
      status: 400,
    });
  }

  const firecrawlRes = await fetch("https://api.firecrawl.dev/v1/scrape", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.FIRECRAWL_API_KEY}`, // store securely
    },
    body: JSON.stringify({
      url,
      html: false,
      screenshot: false,
      metadata: true,
    }),
  });

  const data = await firecrawlRes.json();

  return Response.json(data);
}
