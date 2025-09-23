import type { APIRoute } from "astro";
export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
  // Netlify-specific header
  const netlifyIp = request.headers.get("x-nf-client-connection-ip");

  // Fallbacks
  const forwardedFor = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");

  // Choose in priority order
  const ip =
    netlifyIp ||
    (forwardedFor?.split(",")[0]?.trim() ?? realIp ?? "0.0.0.0");

  return new Response(ip, {
    status: 200,
    headers: { "Content-Type": "text/plain" },
  });
};
