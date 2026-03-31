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
import aThumb from "../images/webinars/thumbnails/autistic-ptsd.png";
import demanndAvoidantChildAnxietyImage from "../images/webinars/demand-avoidant-child-anxiety.webp";
import dThumb from "../images/webinars/thumbnails/demand-avoidant-child-anxiety.png";


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
  thumbnail:aThumb,
  subsubtitle:
    "In an exclusive special offer, we are offering a free ticket to anyone who orders our new book before Oct 9th. Click Learn More for details.",
  contributers: [naomi, eliza],
};


const autisticPTSD: WebinarMeta = {
  id: "1985569311260",
  tags: [tagAutism, tagNeurodiversity, tagTrauma, age5To11, age11To19, forParents],
  image: autisticPTSDImage,
  thumbnail: aThumb,
  contributers: [naomi],
};

const demandAvoidantChildAnxiety: WebinarMeta = {
  id: "1985570059498",
  tags: [tagDemandAvoidance, tagAnxiety, tagMentalHealth, age5To11, age11To19, forParents],
  image: demanndAvoidantChildAnxietyImage,
  thumbnail: dThumb,
  contributers: [naomi],
};

// !! ADD WEBINAR HERE !!
export function getWebinarMeta(eventId: string): WebinarMeta | undefined {
  return [autisticPTSD, demandAvoidantChildAnxiety].find(
    (webMeta) => eventId === webMeta.id,
  );
}
