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
  forProfessionals,
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

const eotas_what_to_expect: WebinarMeta = {
  id: "1323455744759",
  tags: [tagSchool, tagSEN, forParents, age5To11, age11To19],
  contributers: [abi],
};

const helping_your_demand_avoidant_child_with_anxiety: WebinarMeta = {
  id: "1312064092019",
  tags: [tagDemandAvoidance, tagAnxiety, forParents, age5To11, age11To19],
  contributers: [naomi],
};

const helping_your_autistic_child_with_ocd: WebinarMeta = {
  id: "1312079718759",
  tags: [tagMentalHealth, forParents, age5To11, age11To19],
  contributers: [naomi],
};

const art_of_low_demand_therapy: WebinarMeta = {
  id: "1312042738149",
  tags: [tagDemandAvoidance, forProfessionals, age5To11, age11To19],
  contributers: [naomi],
};

const aldp_communication: WebinarMeta = {
  id: "1312030000049",
  tags: [tagDemandAvoidance, forParents, age5To11, age11To19],
  contributers: [naomi, eliza],
};

const helping_your_demand_avoidant_teen_with_anxiety: WebinarMeta = {
  id: "1312091433799",
  tags: [tagDemandAvoidance, forParents, age5To11, age11To19],
  contributers: [naomi],
};

const helping_your_child_with_severe_anxiety: WebinarMeta = {
  id: "1312038304889",
  tags: [tagAnxiety, forParents, age5To11, age11To19],
  contributers: [naomi],
};

const burnt_out_by_school: WebinarMeta = {
  id: "1312049117229",
  tags: [tagSchool, forParents, age5To11, age11To19],
  contributers: [naomi],
}; // !! ADD WEBINAR HERE !!
export function getWebinarMeta(eventId: string): WebinarMeta | undefined {
  return [
    burnt_out_by_school,
    eotas_what_to_expect,
    helping_your_autistic_child_with_ocd,
    helping_your_demand_avoidant_child_with_anxiety,
    helping_your_demand_avoidant_teen_with_anxiety,
    helping_your_child_with_severe_anxiety,
    aldp_communication,
    art_of_low_demand_therapy,
    now_what_recovering_after_school_breakdown,
    not_fine_at_school_kinship,
    understanding_demand_avoidant_teen,
  ].find((webMeta) => eventId === webMeta.id);
}
