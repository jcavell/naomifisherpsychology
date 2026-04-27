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
import autisticPTSDImage from "../images/webinars/autistic-ptsd.png";
import demanndAvoidantChildAnxietyImage from "../images/webinars/demand-avoidant-child-anxiety.webp";
import eotasImage from "../images/courses/eotas-what-to-expect.webp";
import ocdImage from "../images/courses/helping-your-autistic-child-with-ocd.webp";

import autisticPTSDThumb from "../images/webinars/thumbnails/autistic-ptsd.png";
import demanndAvoidantChildAnxietyThumb from "../images/webinars/demand-avoidant-child-anxiety.webp";
import eotasThumb from "../images/courses/eotas-what-to-expect.webp";
import ocdThumb from "../images/courses/helping-your-autistic-child-with-ocd.webp";


type WebinarMeta = {
  id: string;
  tags: string[];
  contributers: string[];
  subsubtitle?: string;
  image: ImageMetadata;
  thumbnail: ImageMetadata;
};

const example_webinar: WebinarMeta = {
  id: "1008493379847",
  tags: [tagALDP, age5To11, age11To19, forParents],
  image: demandAvoidantChildImage,
  thumbnail:autisticPTSDThumb,
  subsubtitle:
    "In an exclusive special offer, we are offering a free ticket to anyone who orders our new book before Oct 9th. Click Learn More for details.",
  contributers: [naomi, eliza],
};


const autisticPTSD: WebinarMeta = {
  id: "1985569311260",
  tags: [tagAutism, tagNeurodiversity, tagTrauma, age5To11, age11To19, forParents],
  image: autisticPTSDImage,
  thumbnail: autisticPTSDThumb,
  contributers: [naomi],
};

const demandAvoidantChildAnxiety: WebinarMeta = {
  id: "1985570059498",
  tags: [tagDemandAvoidance, tagAnxiety, tagMentalHealth, age5To11, age11To19, forParents],
  image: demanndAvoidantChildAnxietyImage,
  thumbnail: demanndAvoidantChildAnxietyThumb,
  contributers: [naomi],
};

const eotas: WebinarMeta = {
  id: "1986945650929",
  tags: [tagSEN, age5To11, age11To19, forParents],
  image: eotasImage,
  thumbnail: eotasThumb,
  contributers: [abi],
};

const autisticOCD: WebinarMeta = {
  id: "1985570305233",
  tags: [tagAutism, tagNeurodiversity, tagAnxiety, tagTrauma, age5To11, age11To19, forParents],
  image: ocdImage,
  thumbnail: ocdThumb,
  contributers: [naomi],
};

// !! ADD WEBINAR HERE !!
export function getWebinarMeta(eventId: string): WebinarMeta | undefined {
  return [autisticPTSD, demandAvoidantChildAnxiety, autisticOCD, eotas].find(
    (webMeta) => eventId === webMeta.id,
  );
}
