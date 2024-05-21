import { getCollection } from "astro:content";
import { getTags } from "./tags";

interface PubDate {
  day: number;
  month: string;
  year: number;
}

const months = {
  Jan: "01",
  Feb: "02",
  Mar: "03",
  Apr: "04",
  May: "05",
  Jun: "06",
  Jul: "07",
  Aug: "08",
  Sep: "09",
  Oct: "10",
  Nov: "11",
  Dec: "12",
};

const comparePubDate = (a: PubDate, b: PubDate) => {
  const aString = "" + a.year + months[a.month] + a.day;
  const bString = "" + b.year + months[b.month] + b.day;
  return bString.localeCompare(aString);
};

export async function getOrderedPosts() {
  const posts = await getCollection("blog");

  // Add tags
  posts.map((p) => {
    const title = p.data.title;
    const subtitle = p.data.subtitle;
    const paragraphs = p.data.paragraphs;

    const body = paragraphs.reduce(
      (acc: string, curr: string) => acc + " " + curr
    );
    p.data.tags = getTags(title, subtitle, body);
  });

  return posts.sort((a, b) => comparePubDate(a.data.pubDate, b.data.pubDate));
}
