import {
  age5To12,
  age13To18,
  tagTrauma,
  tagSEN,
  forParents,
  tagAnxiety,
  tagAutism,
  tagScreens,
  tagALDP,
  tagEHCP,
  tagSchool,
} from "./tags";

import { naomi, abi, eliza } from "./people";

// Webinar Images
import testImage from "../images/courses/test.jpeg";
import testImage2 from "../images/courses/test2.jpeg";

import aldpHolidaysImage from "../images/courses/ALDP-Holidays.png";
import autisticChildOCDImage from "../images/courses/helping-your-autistic-child-with-ocd.png";
import aldpScreensImage from "../images/courses/ALDP-7.png";

type WebinarMeta = {
  id: string;
  tags: string[];
  contributers: string[];
  subsubtitle?: string;
  image?: ImageMetadata;
};

export const webinar_helping_your_child_recover_from_trauma_and_loss: WebinarMeta =
  {
    id: "909728952787",
    tags: [tagTrauma, age5To12, forParents],
    contributers: [naomi],
    image: testImage,
  };

const webinar_nagivating_the_sen_tribunal_process: WebinarMeta = {
  id: "911308828237",
  tags: [tagSEN, forParents],
  contributers: [abi],
  image: testImage2,
};

const webinar_Helping_Your_Child_with_Learning_Disabilities_with_Anxiety: WebinarMeta =
  {
    id: "912635556517",
    tags: [tagAnxiety, tagSEN, forParents],
    contributers: [naomi],
  };

const webinar_Helping_Your_Autistic_Child_Develop_a_Healthy_Relationship_with_Screens: WebinarMeta =
  {
    id: "922751934877",
    tags: [tagScreens, tagAutism, age5To12, forParents],
    contributers: [naomi],
  };

const webinar_aldp_holidays: WebinarMeta = {
  id: "933220877767",
  tags: [tagALDP, age5To12, age13To18, forParents],
  contributers: [naomi, eliza],
  image: aldpHolidaysImage,
};

const helping_your_autistic_child_with_ocd: WebinarMeta = {
  id: "934324007257",
  tags: [tagAutism, tagAnxiety, age5To12, forParents],
  contributers: [naomi],
  image: autisticChildOCDImage,
};

const aldp_screens: WebinarMeta = {
  id: "943055974807",
  tags: [tagALDP, tagScreens, age5To12, age13To18, forParents],
  contributers: [naomi, eliza],
  image: aldpScreensImage,
};

const helping_your_autistic_child_with_anxiety: WebinarMeta = {
  id: "1005061825977",
  tags: [tagAutism, tagAnxiety, age5To12, forParents],
  contributers: [naomi],
};

const helping_your_autistic_teen_with_anxiety: WebinarMeta = {
  id: "1005075506897",
  tags: [tagAutism, tagAnxiety, age13To18, forParents],
  contributers: [naomi],
};

const navigating_the_ehcp_jungle: WebinarMeta = {
  id: "1004481700807",
  tags: [tagEHCP, tagSchool, age5To12, age13To18, forParents],
  contributers: [abi],
};

const is_it_all_my_fault: WebinarMeta = {
  id: "1008493379847",
  tags: [tagALDP, age5To12, age13To18, forParents],
  subsubtitle:
    "In an exclusive special offer, we are offering a free ticket for this webinar to anyone who preorders our book before Oct 2nd. Click Learn More for details.",
  contributers: [naomi, eliza],
};

// !! ADD WEBINAR HERE !!
export function getWebinarMeta(eventId: string): WebinarMeta | undefined {
  return [
    webinar_helping_your_child_recover_from_trauma_and_loss,
    webinar_nagivating_the_sen_tribunal_process,
    webinar_Helping_Your_Child_with_Learning_Disabilities_with_Anxiety,
    webinar_Helping_Your_Autistic_Child_Develop_a_Healthy_Relationship_with_Screens,
    webinar_aldp_holidays,
    helping_your_autistic_child_with_ocd,
    aldp_screens,
    helping_your_autistic_child_with_anxiety,
    helping_your_autistic_teen_with_anxiety,
    navigating_the_ehcp_jungle,
    is_it_all_my_fault,
  ].find((webMeta) => eventId === webMeta.id);
}
