import { getCollection } from "astro:content";
import { getPeople } from "./people";
import { getTags } from "./tags";
import { lowerCaseAndRemoveWhitespace } from "./courseMeta";

export default async function getCourses() {
  const courseCards = await getCollection("courseCards");
  const courseCheckouts = await getCollection("courseCheckouts");

  // Add the checkout, people and tags to each card
  courseCards.forEach((card) => {
    const checkout = courseCheckouts.find(
      (co) => co.data.url === card.data.checkoutUrl
    );

    card.data.checkout = checkout?.data;

    const title = card.data.title;
    const summary = card.data.description;
    const descriptions = card.data.checkout?.descriptions;

    const descriptionText = descriptions?.reduce(
      (acc: string, curr: string) => acc + " " + curr
    );

    const titleSummaryDescription =
      title + " " + summary + " " + descriptionText;

    card.data.people = getPeople(titleSummaryDescription);
    card.data.tags = getTags(title, titleSummaryDescription);
  });

  const sortedCards = courseCards.sort((a, b) =>
    a.data.categoryUrl === b.data.categoryUrl
      ? a.data.categoryPosition - b.data.categoryPosition
      : a.data.categoryUrl === "https://courses.naomifisher.co.uk"
      ? -1
      : 1
  );

  return sortedCards;
}


export function parseDescriptions(descriptions: string[]): string {
  const tagged = descriptions.map((line) => {
    const tag = line.match(/(.*?):/)[1];
    return `<${tag}>${line.substring(tag.length + 1)}</${tag}>`;
  });

  return tagged
    .map((line, index) => {
      return line.startsWith("<li>") &&
        (index === 0 || !tagged[index - 1].startsWith("<li>"))
        ? "<ul>" + line
        : line.endsWith("</li>") &&
          (index + 1 === tagged.length || !tagged[index + 1].startsWith("<li>"))
        ? line + "</ul>"
        : line;
    })
    .join("");
}

export function getTotalRunningTimeFromDescriptions(
  descriptions: string[]
): string {

  let runningTime = '';
  descriptions.forEach((line) => {
    if (line.startsWith("p:Total running time: ")) {
      runningTime = line.substring(22);
    }
  });
  return runningTime;
}

export async function getCourseFromTitle(title: string){
  const courses = await getCourses();
  const course = courses.find(
    (course) =>
      lowerCaseAndRemoveWhitespace(course.data.title) ===
      lowerCaseAndRemoveWhitespace(title)
  );
   //  console.log("Trying to find course with name " + title + ". Outcome: " + JSON.stringify(course));


  return course;

}
