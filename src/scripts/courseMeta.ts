import { ageTeen, age5To12, tagDemandAvoidance, forParents } from "./tags";
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
  videoLink?: URL;
};

export const demandAvoidantAdolescent: CourseMeta = {
  title: "Understanding and Helping your Demand Avoidant Adolescent",
  tags: [tagDemandAvoidance, ageTeen, forParents],
  contributers: [naomi],
  runningTime: "1 hour 20 mins",
  image: testImage,
};

const demandAvoidance101: CourseMeta = {
  title: "Demand Avoidance 101",
  contributers: [naomi],
  tags: [tagDemandAvoidance, forParents, ageTeen, age5To12],
  runningTime: "1 hour 15 mins",
  image: testImage,
};

export function getCourseMeta(course): CourseMeta | undefined {
  return [demandAvoidantAdolescent, demandAvoidance101].find(
    (prod) => prod.title === course.title
  );
}
