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
import rejectionSensitivityImage from "../images/webinars/helping-your-child-with-rejection-sensitivity.jpg";
import autisticChildAnxietyImage from "../images/webinars/helping-your-autistic-child-with-anxiety.png";


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


const rejectionSensitivity: WebinarMeta = {
  id: "1982283058991",
  tags: [tagNeurodiversity, age5To11, age11To19, forParents],
  image: rejectionSensitivityImage,
  contributers: [naomi],
};

const autisticAnxiety: WebinarMeta = {
  id: "1982284000808",
  tags: [tagAutism, tagAnxiety, age5To11, age11To19, forParents],
  image:autisticChildAnxietyImage,
  contributers: [naomi],
};

// !! ADD WEBINAR HERE !!
export function getWebinarMeta(eventId: string): WebinarMeta | undefined {
  return [rejectionSensitivity, autisticAnxiety].find(
    (webMeta) => eventId === webMeta.id,
  );
}
