import { ageTeen, demandAvoidance, forParents } from "./tags";

const isDev = import.meta.env.DEV;

type Category = {
  name: string;
};

type Product = {
  title: string;
  categories: Category[];
  tags: string[];
  runningTime: string;
  imageName?: string;
  videoLink?: URL;
};

const autismCategory: Category = { name: "Autism" };

const demandAvoidantAdolescent: Product = {
  title: "Understanding and Helping your Demand Avoidant Adolescent",
  tags: [demandAvoidance, ageTeen, forParents],
  categories: [autismCategory],
  runningTime: "1 hour 20 mins",
};

const demandAvoidance101: Product = {
  title: "Demand Avoidance 101",
  tags: [demandAvoidance, forParents],
  categories: [autismCategory],
  runningTime: "1 hour 15 mins",
  imageName: 'test.jpeg'
};

export function getProductForCourse(course): Product | undefined {
  return [demandAvoidantAdolescent, demandAvoidance101].find(
    (prod) => prod.title === course.title
  );
}

export function getImagePathForCourse(course): string{

  const product = getProductForCourse(course);
  const productImage = product?.imageName;
  return productImage
    ? isDev
      ? `/images/course-originals/${productImage}`
      : `/.netlify/images?url=/images/course-originals/${productImage}`
    : `/images/kajabi/${course.imageFileName}`;
}
