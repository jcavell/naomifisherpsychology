import getWebinars from "./webinars";

// Module-level cache — persists for the lifetime of the build process
let cachedWebinars: Awaited<ReturnType<typeof getWebinars>> | null = null;

export async function getCachedWebinars() {
  // if (!cachedWebinars) {
  //   console.log("Fetching webinars from Eventbrite...");
  //   cachedWebinars = await getWebinars();
  // }
  return cachedWebinars;
}