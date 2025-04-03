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
  tagDemandAvoidance,
  tagBurnout,
  tagNeurodiversity,
  tagScreens,
  tagWellbeing,
  tagTrauma,
} from "./tags";

import { naomi, abi, eliza, kate } from "./people";

// Webinar Images
import myFaultImage from "../images/webinars/is-it-all-my-fault.jpg";

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

const book_launch_school_not_working: WebinarMeta = {
  id: "1292582281399",
  tags: [tagSchool, forParents, age5To11, age11To19],
  contributers: [naomi, abi, eliza],
};

const not_fine_at_school_kinship: WebinarMeta = {
  id: "1292558791139",
  tags: [tagSchool, forParents, age5To11, age11To19],
  contributers: [naomi],
};
const understanding_demand_avoidant_teen: WebinarMeta = {
  id: "1283983492189",
  tags: [tagDemandAvoidance, forParents, age11To19],
  contributers: [naomi],
};

const now_what_recovering_after_school_breakdown: WebinarMeta = {
  id: "1311499834309",
  tags: [tagSchool, forParents, age5To11, age11To19],
  contributers: [naomi, eliza],
};

// !! ADD WEBINAR HERE !!
export function getWebinarMeta(eventId: string): WebinarMeta | undefined {
  return [
    book_launch_school_not_working,
    now_what_recovering_after_school_breakdown,
    not_fine_at_school_kinship,
    understanding_demand_avoidant_teen,
  ].find((webMeta) => eventId === webMeta.id);
}
