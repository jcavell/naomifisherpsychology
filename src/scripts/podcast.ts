import { getCollection } from "astro:content";

const months: Record<string, string> = {
  Jan: "01", Feb: "02", Mar: "03", Apr: "04",
  May: "05", Jun: "06", Jul: "07", Aug: "08",
  Sep: "09", Oct: "10", Nov: "11", Dec: "12",
};

export async function getOrderedPodcasts() {
  const episodes = await getCollection("podcasts");

  return episodes.sort((a, b) => {
    const toStr = (d: { year: number; month: string; day: string }) =>
      `${d.year}${months[d.month]}${d.day.padStart(2, "0")}`;
    return toStr(b.data.pubDate).localeCompare(toStr(a.data.pubDate));
  });
}