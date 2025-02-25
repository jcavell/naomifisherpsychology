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
} from "./tags";

import { naomi, abi, eliza, kate } from "./people";

// Webinar Images
import myFaultImage from "../images/webinars/is-it-all-my-fault.jpg";
import helpingYourDemandAvoidantChildWithChangeImage from "../images/webinars/helping-your-demand-avoidant-child-with-change.webp";
import dyslexiaAndReadingDifficultiesImage from "../images/webinars/dyslexia-and-reading-difficulties.webp";
import lowPressureParentingImage from "../images/webinars/low-pressure-parenting.webp";
import restoringYourBalanceImage from "../images/webinars/restoring-your-balance.webp";
import whatNowImage from "../images/webinars/what-now.jpg";
import helpingYourChildWithBurnoutImage from "../images/webinars/helping-your-child-with-burnout.jpeg";

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

const helping_your_neurodivergent_teen_recover_from_school: WebinarMeta = {
  id: "1230238058149",
  tags: [tagNeurodiversity, tagSchool, forParents, age11To19],
  contributers: [naomi],
};

const what_now_diagnosis: WebinarMeta = {
  id: "1203174349869",
  tags: [tagALDP, age5To11, age11To19, forParents],
  image: whatNowImage,
  contributers: [naomi, eliza],
};

const calm_and_connect: WebinarMeta = {
  id: "1244751046889",
  tags: [tagWellbeing, forParents],
  contributers: [abi],
};

const my_child_hates_maths: WebinarMeta = {
  id: "1244786462819",
  tags: [tagSEN, tagSchool, age5To11, age11To19, forParents],
  contributers: [abi],
};

const demand_avoidant_child: WebinarMeta = {
  id: "1246046932919",
  tags: [tagDemandAvoidance, forParents, age5To11, age11To19],
  contributers: [naomi],
};

// !! ADD WEBINAR HERE !!
export function getWebinarMeta(eventId: string): WebinarMeta | undefined {
  return [
    calm_and_connect,
    demand_avoidant_child,
    helping_your_neurodivergent_teen_recover_from_school,
    my_child_hates_maths,
    what_now_diagnosis,
  ].find((webMeta) => eventId === webMeta.id);
}
