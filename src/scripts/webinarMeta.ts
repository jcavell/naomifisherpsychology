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
  tagMentalHealth,
} from "./tags";

import { naomi, abi, eliza, kate } from "./people";

// Webinar Images
import eotasImage from "../images/webinars/eotas-what-to-expect.jpg";
import myFaultImage from "../images/webinars/is-it-all-my-fault.jpg";
import transitionsImage from "../images/webinars/helping-your-autistic-child-with-transitions.jpg";
import writingForWellbeingImage from "../images/webinars/writing-for-wellbeing.jpg";

type WebinarMeta = {
  id: string;
  tags: string[];
  contributers: string[];
  subsubtitle?: string;
  image?: ImageMetadata;
};

const example_webinar: WebinarMeta = {
  id: "1008493379847",
  tags: [tagALDP, age5To11, age11To19, forParents],
  image: myFaultImage,
  subsubtitle:
    "In an exclusive special offer, we are offering a free ticket to anyone who orders our new book before Oct 9th. Click Learn More for details.",
  contributers: [naomi, eliza],
};

const helping_your_teen_with_anxiety: WebinarMeta = {
  id: "1082385577399",
  tags: [tagAnxiety, age11To19, forParents],
  contributers: [naomi],
};

// !! ADD WEBINAR HERE !!
export function getWebinarMeta(eventId: string): WebinarMeta | undefined {
  return [
    helping_your_teen_with_anxiety
  ].find((webMeta) => eventId === webMeta.id);
}
