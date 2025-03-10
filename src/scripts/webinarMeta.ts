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

const helping_your_neurodivergent_teen_recover_from_school: WebinarMeta = {
  id: "1230238058149",
  tags: [tagNeurodiversity, tagSchool, forParents, age11To19],
  contributers: [naomi],
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

// !! ADD WEBINAR HERE !!
export function getWebinarMeta(eventId: string): WebinarMeta | undefined {
  return [
    demand_avoidant_child,
    helping_your_neurodivergent_teen_recover_from_school,
    navigating_the_sen_tribunal_process,
    now_what_not_fine_at_school,
    helping_your_autistic_child_with_trauma,
  ].find((webMeta) => eventId === webMeta.id);
}
