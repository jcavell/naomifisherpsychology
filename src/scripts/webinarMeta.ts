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


const schoolTrauma: WebinarMeta = {
  id: "1828642532039",
  tags: [tagTrauma, tagSchool, age5To11, age11To19, forParents],
  image: schoolTraumaImage,
  contributers: [naomi],
};

const writingForWellbeing: WebinarMeta = {
  id: "1870305446939",
  tags: [tagWellbeing, forParents],
  image: writingForWellbeingImage,
  contributers: [abi],
};

const dyslexia: WebinarMeta = {
  id: "1837990482009",
  tags: [tagSEN, tagSchool, age5To11, age11To19, forParents],
  image: dyslexiaImage,
  contributers: [abi],
};

const demandAvoidantChange: WebinarMeta = {
  id: "1964030267400",
  tags: [tagDemandAvoidance, age5To11, age11To19, forParents],
  image: demandAvoidantChangeImage,
  contributers: [naomi],
};

const autisticAnger: WebinarMeta = {
  id: "1964043054647",
  tags: [tagAutism, age5To11, age11To19, forParents],
  image: autisticAngerImage,
  contributers: [naomi],
};

const aldpChristmas: WebinarMeta = {
  id: "1965441059116",
  tags: [tagALDP, tagDemandAvoidance, age5To11, age11To19, forParents],
  image: aldpChristmasImage,
  contributers: [naomi, eliza],
};


// !! ADD WEBINAR HERE !!
export function getWebinarMeta(eventId: string): WebinarMeta | undefined {
  return [schoolTrauma, writingForWellbeing, dyslexia, demandAvoidantChange, autisticAnger, aldpChristmas].find(
    (webMeta) => eventId === webMeta.id,
  );
}
