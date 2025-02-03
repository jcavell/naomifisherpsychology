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

const helping_your_demand_avoidant_child_with_change: WebinarMeta = {
  id: "1111413330189",
  image: helpingYourDemandAvoidantChildWithChangeImage,
  tags: [tagDemandAvoidance, age5To11, age11To19, forParents],
  contributers: [naomi],
};

const low_pressure_parenting_for_teens: WebinarMeta = {
  id: "1118800224589",
  image: lowPressureParentingImage,
  tags: [tagALDP, age11To19, forParents],
  contributers: [naomi, eliza],
};

const restoring_your_energy: WebinarMeta = {
  id: "1098609644019",
  image: restoringYourBalanceImage,
  tags: [tagMentalHealth, forParents],
  contributers: [abi],
};

const understanding_dyslexia: WebinarMeta = {
  id: "1118945458989",
  image: dyslexiaAndReadingDifficultiesImage,
  tags: [tagSEN, age5To11, age11To19, forParents],
  contributers: [abi],
};

const helping_your_child_with_burnout: WebinarMeta = {
  id: "1139703857919",
  image: helpingYourChildWithBurnoutImage,
  tags: [tagBurnout, age5To11, age11To19, forParents],
  contributers: [naomi],
};

const burnt_out_by_parenting: WebinarMeta = {
  id: "1152421787589",
  tags: [tagBurnout, forParents],
  contributers: [naomi],
};

const helping_your_autistic_child_with_anger: WebinarMeta = {
  id: "1216716193889",
  tags: [tagAutism, forParents, age5To11, age11To19],
  contributers: [naomi],
};

const helping_your_neurodivergent_teen_recover_from_school: WebinarMeta = {
  id: "1230238058149",
  tags: [tagNeurodiversity, tagAutism, forParents, age11To19],
  contributers: [naomi],
};

const what_now_diagnosis: WebinarMeta = {
  id: "1203174349869",
  tags: [tagALDP, age5To11, age11To19, forParents],
  image: whatNowImage,
  contributers: [naomi, eliza],
};

// !! ADD WEBINAR HERE !!
export function getWebinarMeta(eventId: string): WebinarMeta | undefined {
  return [
    helping_your_neurodivergent_teen_recover_from_school,
    helping_your_autistic_child_with_anger,
    helping_your_demand_avoidant_child_with_change,
    low_pressure_parenting_for_teens,
    restoring_your_energy,
    understanding_dyslexia,
    helping_your_child_with_burnout,
    burnt_out_by_parenting,
    what_now_diagnosis,
  ].find((webMeta) => eventId === webMeta.id);
}
