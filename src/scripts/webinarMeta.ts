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
import demandAvoidantChildImage from "../images/webinars/understanding-and-helping-your-demand-avoidand-child.avif";
import ehcpImage from "../images/webinars/does-my-child-need-an-ehcp.jpg";
import navigatingPhonesImage from "../images/webinars/navigating-phones-with-your-neurodiverse-child.jpg";
import aldpFoodImage from "../images/webinars/aldp-food.jpg";

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
  image: demandAvoidantChildImage,
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

const doesMyChildNeedAnEHCP: WebinarMeta = {
  id: "1634945679539",
  tags: [tagEHCPs, tagSchool, age5To11, age11To19, forParents],
  image: ehcpImage,
  contributers: [abi],
};

const navigatingPhones: WebinarMeta = {
  id: "1742168826859",
  tags: [tagScreens, age5To11, age11To19, forParents],
  image: navigatingPhonesImage,
  contributers: [naomi],
};

const aldpFood: WebinarMeta = {
  id: "1736300695119",
  tags: [tagALDP, tagDemandAvoidance, age5To11, age11To19, forParents],
  image: aldpFoodImage,
  contributers: [naomi, eliza],
};

// !! ADD WEBINAR HERE !!
export function getWebinarMeta(eventId: string): WebinarMeta | undefined {
  return [demandAvoidantChild, doesMyChildNeedAnEHCP, navigatingPhones, aldpFood].find(
    (webMeta) => eventId === webMeta.id,
  );
}
