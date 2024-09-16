import { getCollection } from "astro:content";

export function getFormats(book): string[] {
  let formats = ["Paperback"];

  if (book.kindleUrl) {
    formats.push("E-Book");
  }

  if (book.audiobookLength) {
    formats.push("Audiobook");
  }
  return formats;
}

export async function getFeaturedBooks() {
  const featuredIds = [4, 2];
  const books = await getCollection("books");
  return featuredIds.map((id) => books.find((b) => b.data.id === id));
}

export function getPubDate(book): Date {
  return new Date(book.pubDate);
}

export function getPubDateString(book): string {
  return getPubDate(book).toLocaleDateString(undefined, {
    dateStyle: "long",
  });
}
