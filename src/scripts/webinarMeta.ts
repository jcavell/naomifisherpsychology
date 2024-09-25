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
import myFaultImage from "../images/webinars/is-it-all-my-fault.jpg";
import transitionsImage from "../images/webinars/helping-your-autistic-child-with-transitions.jpg";

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
  image: myFaultImage,
  subsubtitle:
    "In an exclusive special offer, we are offering a free ticket for this webinar to anyone who preorders our book before Oct 9th. Click Learn More for details.",
  contributers: [naomi, eliza],
};

const helping_your_autistic_child_with_transitions: WebinarMeta = {
  id: "888386577167",
  tags: [tagAutism, tagAnxiety, age5To11, age11To19, forParents],
  image: transitionsImage,
  contributers: [naomi],
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
    helping_your_autistic_child_with_transitions,
    is_it_all_my_fault,
    eotas_what_to_expect,
    writing_for_wellbeing
  ].find((webMeta) => eventId === webMeta.id);
}
