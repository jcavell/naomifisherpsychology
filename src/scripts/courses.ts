import { getCollection } from "astro:content";
import {
  lowerCaseAndRemoveWhitespace,
  getCourseMetaFromTitle,
  allCourses
} from "./courseMeta";

export default async function getCourses() {
  const courseCards = await getCollection("courseCards");
  const courseCheckouts = await getCollection("courseCheckouts");

  // Return sorted courses with checkout and meta data added
  courseCards.forEach((card) => {

    // Add checkout details
    const checkout = courseCheckouts.find(
      (co) => co.data.url === card.data.checkoutUrl
    );
    card.data.checkout = checkout?.data;

    // Add meta data
    const title = card.data.title;
    card.data.meta = getCourseMetaFromTitle(title);
  });

  // Sort based on CourseMeta.allCourses position


  const sortedCards = courseCards.sort(
    (a, b) =>
      allCourses.indexOf(a.data.meta) - allCourses.indexOf(b.data.meta)
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
  let runningTime = "";
  descriptions.forEach((line) => {
    if (line.startsWith("p:Total running time: ")) {
      runningTime = line.substring(22);
    }
  });
  return runningTime;
}

export async function getCourseFromTitle(title: string) {
  const courses = await getCourses();
  const course = courses.find((course) =>
    lowerCaseAndRemoveWhitespace(course.data.title).startsWith(
      lowerCaseAndRemoveWhitespace(title)
    )
  );
  // console.log(
  //   "Trying to find course with name " +
  //     title +
  //     " Outcome: " +
  //     JSON.stringify(course)
  // );

  return course;
}

export async function getCoursesWithAnyTag(tags: string[]) {
  const courses = await getCourses();

  const tagged = courses.filter((c) => {
    return tags.some((t) => c.data.meta?.tags.includes(t));
  });

  return tagged;
}

export async function getLatestCourses(numCourses: number = 2) {
  const courses = await getCourses();
  return courses.slice(0, numCourses);
}
