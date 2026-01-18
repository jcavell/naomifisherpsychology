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


const notFineAtSchool: WebinarMeta = {
  id: "1980544344449",
  tags: [tagSchool, age5To11, age11To19, forParents],
  contributers: [naomi],
};

const ehcpBookLaunch: WebinarMeta = {
  id: "1980668709428",
  tags: [tagEHCPs, tagSEN, tagSchool, age5To11, age11To19, forParents],
  contributers: [abi, eliza],
};

  const burntOutByParenting: WebinarMeta = {
    id: "1980545402614",
    tags: [tagBurnout, forParents],
    contributers: [naomi],
  };

// !! ADD WEBINAR HERE !!
export function getWebinarMeta(eventId: string): WebinarMeta | undefined {
  return [notFineAtSchool, ehcpBookLaunch, burntOutByParenting].find(
    (webMeta) => eventId === webMeta.id,
  );
}
