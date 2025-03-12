export const prerender = false;

export async function GET({ request }: { request: Request }) {
  // Step 1: Extract email from query parameters
  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email");

  if (!email) {
    return new Response(JSON.stringify({ error: "Email is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Step 2: ConvertKit API details
  const KIT_API_KEY = import.meta.env.KIT_API_KEY;
  const KIT_BASE_URL = "https://api.convertkit.com/v4/subscribers";

  try {
    // Step 3: Call the ConvertKit API with X-Kit-Api-Key header
    const response = await fetch(
      `${KIT_BASE_URL}?email_address=${encodeURIComponent(email)}`,
      {
        headers: {
          "X-Kit-Api-Key": KIT_API_KEY, // Include the API key in the header
          "Content-Type": "application/json",
        },
      },
    );
    if (!response.ok) {
      return new Response(
        JSON.stringify({
          error:
            "Failed to retrieve user data, please check your API secret or email address",
        }),
        {
          status: response.status,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    // Step 4: Parse API response
    const data = await response.json();

    // Step 5: Return the subscriber if found
    if (!data.subscribers || data.subscribers.length === 0) {
      return new Response(
        JSON.stringify({ error: "No subscriber found for the given email" }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    return new Response(JSON.stringify({ subscriber: data.subscribers[0] }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching subscriber:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
