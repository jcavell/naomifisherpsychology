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
import schoolTraumaImage from "../images/webinars/school-trauma.jpg";
import aldpChristmasImage from "../images/webinars/aldp-christmas.jpg";
import writingForWellbeingImage from "../images/webinars/writing-for-wellbeing.jpg";
import dyslexiaImage from "../images/webinars/dyslexia.jpg";
import demandAvoidantChangeImage from "../images/webinars/demand-avoidant-change.jpg";
import autisticAngerImage from "../images/webinars/autistic-anger.jpg";


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
  contributers: [naomi],
};

const autisticAnxiety: WebinarMeta = {
  id: "1982284000808",
  tags: [tagAutism, tagAnxiety, age5To11, age11To19, forParents],
  contributers: [naomi],
};

// !! ADD WEBINAR HERE !!
export function getWebinarMeta(eventId: string): WebinarMeta | undefined {
  return [rejectionSensitivity, autisticAnxiety].find(
    (webMeta) => eventId === webMeta.id,
  );
}
