import {
  aldp,
  anxiety,
  autism,
  burnout,
  demandAvoidance,
  ehcp,
  forTeens,
  neurodiversity,
  school,
  trauma,
} from "./tags";
import { makeUrl } from "./url";

class Category {
  name: string;
  tags: string[];
  subnames: string[];

  constructor(name: string, tags: string[], subnames: string[] = []) {
    this.name = name;
    this.subnames = subnames;
    this.tags = tags;
  }
}

export const autismCategory = new Category(
  "Autism",
  [autism, demandAvoidance, neurodiversity],
  ["Demand Avoidance", "Neurodiversity"]
);

export const anxietyCategory = new Category(
  "Anxiety",
  [anxiety, trauma, burnout],
  ["Trauma", "Burnout"]
);

export const schoolCategory = new Category("School", [school, ehcp], ["EHCPs"]);

export const aldpCategory = new Category("The Art of Low Demand Parenting", [aldp]);

export const forTeensCategory = new Category("For teenagers to watch", [
  forTeens,
]);

const categories: ReadonlyArray<Category> = [
  forTeensCategory,
  autismCategory,
  schoolCategory,
  anxietyCategory,
  aldpCategory,
];

export const getCategories = () => categories;

// export const getTagsForCategoryUrlName = (urlName: string) =>
//   categories.filter((c) => makeUrl(c.name) === urlName).flatMap((c) => c.tags);

export const getCategoryForName = (name: string) => {
  const cats = categories.filter((c) => c.name === name);
  return cats.length > 0 ? cats[0] : undefined;
};

export const getCategoriesFromTags = (tags: string[]) =>
  categories.filter(
    (c) => c.tags.filter((catTag) => tags.includes(catTag)).length > 0
  );
