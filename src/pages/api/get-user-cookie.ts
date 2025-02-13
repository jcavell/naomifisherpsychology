import { parse } from "cookie"; // To parse incoming cookies
export const prerender = false;

export async function GET({ request }: { request: Request }) {
  // Step 1: Get cookies from the request headers
  const cookieHeader = request.headers.get("cookie");
  if (!cookieHeader) {
    return new Response("No cookies found.", { status: 404 });
  }

  // Step 2: Parse the cookie
  const cookies = parse(cookieHeader);

  // Step 3: Get the userInfo cookie data
  const userInfo = cookies.userInfo;
  if (!userInfo) {
    return new Response("User data not found in cookies.", { status: 404 });
  }

  // Step 4: Parse and return the user data
  return new Response(userInfo, {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
