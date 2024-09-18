import {
  age5To12,
  age13To18,
  forParents,
  tagAnxiety,
  tagAutism,
  tagALDP,
  tagEHCPs,
  tagSchool,
  tagSEN
} from "./tags";

import { naomi, abi, eliza } from "./people";

// Webinar Images
import aldpHolidaysImage from "../images/courses/ALDP-Holidays.webp";

type WebinarMeta = {
  id: string;
  tags: string[];
  contributers: string[];
  subsubtitle?: string;
  image?: ImageMetadata;
};

const helping_your_autistic_teen_with_anxiety: WebinarMeta = {
  id: "1005075506897",
  tags: [tagAutism, tagAnxiety, age13To18, forParents],
  contributers: [naomi],
};

const navigating_the_ehcp_jungle: WebinarMeta = {
  id: "1004481700807",
  tags: [tagEHCPs, tagSchool, tagSEN, age5To12, age13To18, forParents],
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
    helping_your_autistic_teen_with_anxiety,
    navigating_the_ehcp_jungle,
    is_it_all_my_fault,
  ].find((webMeta) => eventId === webMeta.id);
}
