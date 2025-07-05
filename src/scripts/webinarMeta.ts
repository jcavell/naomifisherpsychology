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

// EventbriteWebinar Images
import myFaultImage from "../images/webinars/is-it-all-my-fault.jpg";
import severeAnxietyImage from "../images/webinars/severe_anxiety.avif";
import demandAvoidantTeenAnxietyImage from "../images/webinars/demand_avoidant_teen_anxiety.avif";
import demandAvoidantChildAnxietyImage from "../images/webinars/demand_avoidant_child_anxiety.avif";
import aldpBehImage from "../images/webinars/aldp_behaviour.avif";
import autOCDImage from "../images/webinars/autistic_ocd.avif";
import screeensImage from "../images/webinars/screens.avif";
import ehcpEssentialsImage from "../images/webinars/ehcp-essentials.avif";

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

const helping_your_demand_avoidant_child_with_anxiety: WebinarMeta = {
  id: "1312064092019",
  tags: [tagDemandAvoidance, tagAnxiety, forParents, age5To11, age11To19],
  image: demandAvoidantChildAnxietyImage,
  contributers: [naomi],
};

const helping_your_autistic_child_with_ocd: WebinarMeta = {
  id: "1312079718759",
  tags: [tagMentalHealth, forParents, age5To11, age11To19],
  image: autOCDImage,
  contributers: [naomi],
};

const aldp_behaviour: WebinarMeta = {
  id: "1348567344229",
  tags: [tagDemandAvoidance, forParents, age5To11, age11To19],
  image: aldpBehImage,
  contributers: [naomi, eliza],
};

const ehcp_essentials: WebinarMeta = {
  id: "1374374744859",
  tags: [tagEHCPs, tagSEN, forParents, age5To11, age11To19],
  image: ehcpEssentialsImage,
  contributers: [abi],
};

const helping_your_demand_avoidant_teen_with_anxiety: WebinarMeta = {
  id: "1312091433799",
  tags: [tagDemandAvoidance, forParents, age5To11, age11To19],
  image: demandAvoidantTeenAnxietyImage,
  contributers: [naomi],
};

const helping_your_child_with_severe_anxiety: WebinarMeta = {
  id: "1312038304889",
  tags: [tagAnxiety, forParents, age5To11, age11To19],
  image: severeAnxietyImage,
  contributers: [naomi],
};

const helping_your_child_develop_a_health_relationship_with_screens: WebinarMeta =
  {
    id: "1362789302489",
    tags: [tagScreens, forParents, age5To11, age11To19],
    image: screeensImage,
    contributers: [naomi],
  };

// !! ADD WEBINAR HERE !!
export function getWebinarMeta(eventId: string): WebinarMeta | undefined {
  return [
    ehcp_essentials,
    helping_your_autistic_child_with_ocd,
    helping_your_demand_avoidant_child_with_anxiety,
    helping_your_demand_avoidant_teen_with_anxiety,
    helping_your_child_with_severe_anxiety,
    aldp_behaviour,
    helping_your_child_develop_a_health_relationship_with_screens,
  ].find((webMeta) => eventId === webMeta.id);
}
