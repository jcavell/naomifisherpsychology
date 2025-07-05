import { getCollection, type CollectionEntry } from "astro:content";
import type { CourseCard, CourseCheckout } from "../content/config.ts";

import {
  lowerCaseAndRemoveWhitespace,
  getCourseMetaFromTitle,
  allCourseMetas,
  featuredCourses,
  type CourseMeta,
} from "./courseMeta";

type CourseCardEntry = CollectionEntry<"courseCards">;
type CourseCheckoutEntry = CollectionEntry<"courseCheckouts">;

export async function getCourseByOfferId(
  offerId: string,
): Promise<CourseCardEntry | undefined> {
  const courses = await getCourses();
  return courses.find((course) => course.data.offerId === offerId);
}

export default async function getCourses(): Promise<CourseCardEntry[]> {
  const courseCards = await getCollection("courseCards");
  const courseCheckouts = await getCollection("courseCheckouts");

  // Return sorted courses with checkout, offerId and metaData added
  courseCards.forEach((card) => {
    // Add checkout based on matching url field
    const checkout = courseCheckouts.find(
      (co) => co.data.url === card.data.checkoutUrl,
    );

    if (!checkout)
      throw new Error(`Failed to find checkout for course: ${card.data.title}`);
    card.data.checkout = checkout?.data;

    // Add offer ID from checkout.url
    const url = new URL(card.data.checkoutUrl);
    const pathSegments = url.pathname.split("/");
    const extractedOfferId = pathSegments[pathSegments.length - 1];

    if (!extractedOfferId) {
      throw new Error(
        `Failed to extract offerId from checkout URL for course: ${card.data.title}`,
      );
    }
    card.data.offerId = extractedOfferId;
    card.data.priceInPence = convertKajabiPriceToPriceInPence(card.data.price);

    // Add meta data from title
    const title = card.data.title;
    const courseMetaFromTitle = getCourseMetaFromTitle(title);

    if (!courseMetaFromTitle)
      throw new Error(`Failed to find course meta for course: ${title}`);

    card.data.meta = courseMetaFromTitle;
  });

  return courseCards.sort((a, b) => {
    const metaA = a.data.meta as CourseMeta;
    const metaB = b.data.meta as CourseMeta;
    return allCourseMetas.indexOf(metaA) - allCourseMetas.indexOf(metaB);
  });
}

export function parseDescriptions(descriptions: string[]): string {
  const tagged = descriptions.map((line) => {
    const tag = line.match(/(.*?):/)?.[1] ?? "p";
    return `<${tag}>${line.substring(tag.length + 1)}</${tag}>`;
  });

  return tagged
    .map((line, index) => {
      return line.startsWith("<li>") &&
        (index === 0 || !tagged[index - 1].startsWith("<li>"))
        ? "<ul>" + line
        : line.endsWith("</li>") &&
            (index + 1 === tagged.length ||
              !tagged[index + 1].startsWith("<li>"))
          ? line + "</ul>"
          : line;
    })
    .join("");
}

export function getTotalRunningTimeFromDescriptions(
  descriptions: string[],
): string {
  let runningTime = "";
  descriptions.forEach((line) => {
    if (line.startsWith("p:Total running time: ")) {
      runningTime = line.substring(22);
    }
  });
  return runningTime;
}

export async function getCourseFromTitle(
  title: string,
): Promise<CourseCardEntry | undefined> {
  const courses = await getCourses();
  const course = courses.find((course) =>
    lowerCaseAndRemoveWhitespace(course.data.title).startsWith(
      lowerCaseAndRemoveWhitespace(title),
    ),
  );

  return course;
}

export async function getCoursesWithTag(
  tags: string[],
): Promise<CourseCardEntry[]> {
  const courses = await getCourses();

  const tagged = courses.filter((c) => {
    return tags.some((t) => c.data.meta?.tags.includes(t));
  });

  return tagged;
}

export async function getCoursesWithTagWithoutOtherTags(
  withTags: string[],
  withoutTags: string[] = [],
): Promise<CourseCardEntry[]> {
  const courses = await getCourses();

  const tagged = courses.filter((c) => {
    return (
      withTags.some((t) => c.data.meta?.tags.includes(t)) &&
      !withoutTags.some((t) => c.data.meta?.tags.includes(t))
    );
  });
  return tagged;
}

export async function getLatestCourses(
  numCourses: number = 2,
): Promise<CourseCardEntry[]> {
  const courses = await getCourses();
  return courses.slice(0, numCourses);
}

export async function getFeaturedCourses(
  start: number,
  numCourses: number,
): Promise<(CourseCardEntry | undefined)[]> {
  const courses = await getCourses();

  return featuredCourses
    .slice(start, numCourses)
    .map((m) => courses.find((c) => c.data.meta === m));
}

 const convertKajabiPriceToPriceInPence = (kajabiPrice: string) => {
  return 100 * parseFloat(kajabiPrice.replace(/[^0-9.]/g, ""))// Remove currency symbol and convert to number
};
