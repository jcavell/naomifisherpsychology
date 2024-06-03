import {
  tagALDP,
  tagAnxiety,
  tagAutism,
  tagBurnout,
  tagDemandAvoidance,
  tagEHCP,
  forTeens,
  tagNeurodiversity,
  tagSchool,
  tagTrauma,
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

export const catAutism = new Category(
  "Autism",
  [tagAutism, tagDemandAvoidance, tagNeurodiversity],
  ["Demand Avoidance", "Neurodiversity"]
);

export const catAnxiety = new Category(
  "Anxiety",
  [tagAnxiety, tagTrauma, tagBurnout],
  ["Trauma", "Burnout"]
);

export const catSchool = new Category(
  "School",
  [tagSchool, tagEHCP],
  ["EHCPs"]
);

export const catALDP = new Category("The Art of Low Demand Parenting", [
  tagALDP,
]);

export const catForTeens = new Category("For teenagers to watch", [forTeens]);

const categories: ReadonlyArray<Category> = [
  catAutism,
  catSchool,
  catAnxiety,
  catALDP,
  catForTeens,
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
