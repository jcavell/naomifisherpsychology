import {
  age5To11,
  age11To19,
  forParents,
  tagAnxiety,
  tagAutism,
  tagALDP,
  tagEHCPs,
  tagSchool,
  tagSEN,
} from "./tags";

import { naomi, abi, eliza, kate } from "./people";

// Webinar Images
import eotasImage from "../images/webinars/eotas-what-to-expect.jpg";

type WebinarMeta = {
  id: string;
  tags: string[];
  contributers: string[];
  subsubtitle?: string;
  image?: ImageMetadata;
};

const is_it_all_my_fault: WebinarMeta = {
  id: "1008493379847",
  tags: [tagALDP, age5To11, age11To19, forParents],
  subsubtitle:
    "In an exclusive special offer, we are offering a free ticket for this webinar to anyone who preorders our book before Oct 9th. Click Learn More for details.",
  contributers: [naomi, eliza],
};

const eotas_what_to_expect: WebinarMeta = {
  id: "1024840845557",
  image: eotasImage,
  tags: [tagSEN, forParents],
  contributers: [abi]
};

const writing_for_wellbeing: WebinarMeta = {
  id: "1016739654677",
  tags: [forParents],
  contributers: [abi, kate],
};

// !! ADD WEBINAR HERE !!
export function getWebinarMeta(eventId: string): WebinarMeta | undefined {
  return [
    is_it_all_my_fault,
    eotas_what_to_expect,
    writing_for_wellbeing
  ].find((webMeta) => eventId === webMeta.id);
}
