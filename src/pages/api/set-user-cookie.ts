import { serialize } from "cookie"; // To properly set cookies
export const prerender = false;

export async function POST({ request }: { request: Request }) {
  // Step 1: Parse the raw form data sent in the request body

  const rawBody = await request.text();
  // console.log("set-user-cookie RAW BODY: *" + rawBody + "*");
  const { firstName, surname, email } = JSON.parse(rawBody);

  // Step 2: Serialize the data into a single JSON string (store safely in cookies)
  const userData = JSON.stringify({ firstName, surname, email });

  // Step 3: Set the cookie
  const userCookie = serialize("userInfo", userData, {
    httpOnly: true, // Cookie cannot be accessed via JavaScript
    secure: true, // Only send over HTTPS
    path: "/", // Cookie is available site-wide
    sameSite: "strict", // Prevent CSRF
  });

  // Set the cookie and return a JSON response
  return new Response(
    JSON.stringify({ message: "User data saved in cookie." }),
    {
      status: 200,
      headers: {
        "Set-Cookie": userCookie,
        "Content-Type": "application/json",
      },
    },
  );
}
