import Logger from "../logger.ts";

export async function withRetry<T>(
  operation: () => Promise<T>,
  name: string,
  maxAttempts = 3,
  baseDelay = 1000
): Promise<T> {
  let lastError: Error;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      Logger.ERROR(`${name} failed (attempt ${attempt}/${maxAttempts}):`, error);

      if (attempt < maxAttempts) {
        const delay = baseDelay * Math.pow(1.5, attempt - 1); // Exponential backoff
        Logger.INFO(`Retry attempt ${attempt} for ${name}: waiting ${delay}ms`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError!; // All attempts failed
}