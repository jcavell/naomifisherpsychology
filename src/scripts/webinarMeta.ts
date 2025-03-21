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

const demand_avoidant_child: WebinarMeta = {
  id: "1246046932919",
  tags: [tagDemandAvoidance, forParents, age5To11, age11To19],
  contributers: [naomi],
};

const navigating_the_sen_tribunal_process: WebinarMeta = {
  id: "1257579777969",
  tags: [tagSEN, tagSchool, forParents, age5To11, age11To19],
  contributers: [abi],
};

const now_what_not_fine_at_school: WebinarMeta = {
  id: "1264018757129",
  tags: [tagSchool, forParents, age5To11, age11To19],
  contributers: [naomi, eliza],
};

const helping_your_autistic_child_with_trauma: WebinarMeta = {
  id: "1267249911599",
  tags: [tagAutism, tagTrauma, forParents, age5To11, age11To19],
  contributers: [naomi],
};

const does_my_child_need_an_ehcp: WebinarMeta = {
  id: "1284018246139",
  tags: [tagSEN, tagEHCPs, tagSchool, forParents, age5To11, age11To19],
  contributers: [abi],
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

// !! ADD WEBINAR HERE !!
export function getWebinarMeta(eventId: string): WebinarMeta | undefined {
  return [
    demand_avoidant_child,
    navigating_the_sen_tribunal_process,
    now_what_not_fine_at_school,
    helping_your_autistic_child_with_trauma,
    does_my_child_need_an_ehcp,
    book_launch_school_not_working,
    not_fine_at_school_kinship,
    understanding_demand_avoidant_teen,
  ].find((webMeta) => eventId === webMeta.id);
}
