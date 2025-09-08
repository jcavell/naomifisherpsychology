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
import autisticTransitionsImage from "../images/webinars/helping-your-autistic-child-with-transitions.jpg";
import autisticTeenAnxietyImage from "../images/webinars/demand_avoidant_child_anxiety.avif";
import demandAvoidantChildImage from "../images/webinars/understanding-and-helping-your-demand-avoidand-child.avif";

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

const demandAvoidantChild: WebinarMeta = {
  id: "1472494212829",
  tags: [tagDemandAvoidance, age5To11, age11To19, forParents],
  image: demandAvoidantChildImage,
  contributers: [naomi],
};

const autisticTransitions: WebinarMeta = {
  id: "1472461725659",
  tags: [tagAutism, age5To11, age11To19, forParents],
  image: autisticTransitionsImage,
  contributers: [naomi],
};

const autisticTeenAnxiety: WebinarMeta = {
  id: "1472472718539",
  tags: [tagDemandAvoidance, age5To11, age11To19, forParents],
  image: autisticTeenAnxietyImage,
  contributers: [naomi],
};

// !! ADD WEBINAR HERE !!
export function getWebinarMeta(eventId: string): WebinarMeta | undefined {
  return [demandAvoidantChild, autisticTransitions, autisticTeenAnxiety].find(
    (webMeta) => eventId === webMeta.id,
  );
}
