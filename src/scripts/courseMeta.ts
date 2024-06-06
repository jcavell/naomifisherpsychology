import {
  age11To18,
  age5To12,
  tagDemandAvoidance,
  forParents,
  allAges,
  tagAutism,
} from "./tags";
import { naomi, abi } from "./people";

// Product Images
import testImage from "../images/courses/test.jpeg";
import testImage2 from "../images/courses/test2.jpeg";

type CourseMeta = {
  title: string;
  tags: string[];
  contributers: string[];
  runningTime: string;
  image?: ImageMetadata;
  videoUrl?: URL;
  relatedTitles?: string[];
};

// export const demandAvoidantAdolescent: CourseMeta = {
//   title: "Understanding and Helping your Demand Avoidant Adolescent",
//   tags: [tagDemandAvoidance, age11To18, forParents],
//   contributers: [naomi],
//   runningTime: "1 hour 20 mins",
//   image: testImage,
// };

const demandAvoidance101: CourseMeta = {
  title: "Demand Avoidance 101",
  contributers: [naomi],
  tags: [tagDemandAvoidance, forParents, allAges],
  runningTime: "1 hour 15 mins",
  image: testImage,
  videoUrl: new URL("https://player.vimeo.com/video/953498420"),
};

export const neurodiversity101: CourseMeta = {
  title: "Neurodiversity 101",
  tags: [tagAutism, allAges, forParents],
  contributers: [naomi],
  runningTime: "1 hour 22 mins",
};

// !! REMEMBER TO ADD NEW COURSES HERE !!
const allCourses = [
  // demandAvoidantAdolescent,
  demandAvoidance101,
  neurodiversity101,
];

// !! REMEMBER TO ADD RELATED COURSES HERE !!
// demandAvoidantAdolescent.relatedTitles = [demandAvoidance101.title];
demandAvoidance101.relatedTitles = [neurodiversity101.title];

export function lowerCaseAndRemoveWhitespace(input: string) {
  // console.log("TESTING: " + JSON.stringify(input));
  return input.toLowerCase().replace(/\s+/g, "");
}

export function getCourseMetaFromTitle(title: string): CourseMeta | undefined {
  return allCourses.find(
    (prod) =>
      lowerCaseAndRemoveWhitespace(prod.title) ===
      lowerCaseAndRemoveWhitespace(title)
  );
}
