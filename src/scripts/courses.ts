import { getCollection } from "astro:content";
import { getPeople } from "./people";
import { getTags } from "./tags";

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

  return courseCards;
}
