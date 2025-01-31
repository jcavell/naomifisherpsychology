import {
  age11To19,
  age5To11,
  tagDemandAvoidance,
  forParents,
  tagAutism,
  tagScreens,
  tagAnxiety,
  tagTrauma,
  tagBurnout,
  tagSchool,
  tagEHCPs,
  forTeens,
  forProfessionals,
  tagALDP,
  tagEMDR,
  tagNeurodiversity,
  tagSEN,
  tagMentalHealth,
} from "./tags";
import { naomi, abi, eliza } from "./people";

import { getWebinarMeta } from "./webinarMeta";

// Course Images
import demandAvoidance101Image from "../images/courses/demand-avoidance-101.webp";
import neurodiversity101Image from "../images/courses/neurodiversity-101.webp";
import autisticChildScreensImage from "../images/courses/helping-your-autistic-child-develop-a-healthy-relationship-with-screens.webp";
import autisticTeenWithAnxietyImage from "../images/courses/helping-your-autistic-teen-with-anxiety.webp";
import autisticChildWithAnxietyImage from "../images/courses/helping-your-autistic-child-with-anxiety.webp";
import demandAvoidantAdolescentImage from "../images/courses/understanding-and-helping-your-demand-avoidant-adolescent.webp";
import childWithAnxietyUnder8sImage from "../images/courses/helping-your-child-with-anxiety-under-8s.webp";
import childWithAnxiety6To13Image from "../images/courses/helping-your-child-with-anxiety-6-to-13.webp";
import autisticChildWithTraumaImage from "../images/courses/helping-your-autistic-child-with-trauma.webp";
import afterSchoolMovingOnFromSchoolTraumaImage from "../images/courses/after-school-moving-on-from-school-trauma.webp";
import burntOutBySchoolImage from "../images/courses/burnt-out-by-school.webp";
import doWeNeedAnEhcpImage from "../images/courses/do-we-need-an-ehcp.webp";
import autisticChildrenWithSchoolImage from "../images/courses/helping-autistic-children-with-school.webp";
import childWithSevereAnxietyImage from "../images/courses/helping-your-child-with-severe-anxiety.webp";
import myChildIsNotFineAtSchoolImage from "../images/courses/my-child-is-not-fine-at-school.webp";
import takingControlOfYourEhcpAnnualReviewImage from "../images/courses/taking-control-of-your-ehcp-annual-review.webp";
import teenagerBurnout101Image from "../images/courses/teenager-burnout-101.webp";
import weDontHaveAnEhcpWhatToExpectFromSchoolImage from "../images/courses/we-dont-have-an-ehcp-what-to-expect-from-school.webp";
import demandAvoidanceGuideForTeenagersImage from "../images/courses/what-is-demand-avoidance-a-guide-for-teenagers.webp";
import workingWithDemandAvoidantChildrenTherapyImage from "../images/courses/working-with-demand-avoidant-children-low-demand-therapy.webp";
import traumaAndLossImage from "../images/courses/helping-your-child-recover-from-trauma-and-loss.webp";
import ehcpJungleImage from "../images/courses/finding-your-way-through-the-ehcp-jungle.webp";
import thrivingAfterSchoolBreakdownImage from "../images/courses/thriving-after-school-breakdown.webp";
import helpingYourAutisticChildWithStartingSchoolImage from "../images/courses/helping-your-autistic-child-with-starting-school.webp";
import navigatingTheSenTribunalProcessImage from "../images/courses/navigating-the-sen-tribunal-process.webp";
import helpingYourChildWithLearningDisabilitiesWithAnxietyImage from "../images/courses/helping-your-child-with-learning-disabilities-with-anxiety.webp";
import helpingYourAutisticChildWithOCDImage from "../images/courses/helping-your-autistic-child-with-ocd.webp";
import helpingYourAutisticChildWithTransitionsImage from "../images/courses/helping-your-autistic-child-with-transitions.webp";
import eotasWhatToExpectImage from "../images/courses/eotas-what-to-expect.webp";
import helpingYourTeenWithAnxietyImage from "../images/courses/helping-your-teen-with-anxiety.jpg";
import anxietyAGuideForTeenagersImage from "../images/courses/anxiety-a-guide-for-teenagers.png";

import ALDP1Image from "../images/courses/ALDP-1.webp";
import ALDP2Image from "../images/courses/ALDP-2.webp";
import ALDP3Image from "../images/courses/ALDP-3.webp";
import ALDP4Image from "../images/courses/ALDP-4.webp";
import ALDP5Image from "../images/courses/ALDP-5.webp";
import ALDP6Image from "../images/courses/ALDP-6.webp";
import ALDP7Image from "../images/courses/ALDP-7.webp";
import ALDP8Image from "../images/courses/ALDP-8.webp";
import ALDP9Image from "../images/courses/ALDP-9.webp";
import ALDP10Image from "../images/courses/ALDP-10.webp";
import ALDP1To10Image from "../images/courses/ALDP-1-10.webp";
import ALDP1To5Image from "../images/courses/ALDP-1-5.webp";
import ALDP6To10Image from "../images/courses/ALDP-6-10.webp";

import EMDR1Image from "../images/courses/EMDR-1.webp";
import EMDR2Image from "../images/courses/EMDR-2.webp";
import EMDR3Image from "../images/courses/EMDR-3.webp";
import EMDR4Image from "../images/courses/EMDR-4.webp";
import EMDR5Image from "../images/courses/EMDR-5.webp";
import EMDR6Image from "../images/courses/EMDR-6.webp";
import EMDR1To6Image from "../images/courses/EMDR-1-6.webp";

const makeVideoURL = (id: string) =>
  new URL("https://player.vimeo.com/video/" + id);

// const CourseMeta = z.object({
//   title: z.string(),
//   tags: z.string().array(),
//   contributers: z.string().array(),
//   runningTime: z.string(),
// });

export type CourseMeta = {
  title: string;
  tags: string[];
  contributers: string[];
  runningTime: string;
  image?: ImageMetadata;
  videoUrl?: URL;
  relatedTitles?: string[];
};

export const demandAvoidantAdolescent: CourseMeta = {
  title: "Understanding and Helping your Demand Avoidant Adolescent",
  tags: [tagDemandAvoidance, age11To19, forParents],
  contributers: [naomi],
  runningTime: "1 hour 17 mins",
  image: demandAvoidantAdolescentImage,
  videoUrl: makeVideoURL("957825416"),
};

export const demandAvoidance101: CourseMeta = {
  title: "Demand Avoidance 101",
  contributers: [naomi],
  tags: [tagDemandAvoidance, age5To11, age11To19, forParents],
  runningTime: "1 hour 15 mins",
  image: demandAvoidance101Image,
  videoUrl: makeVideoURL("953498420"),
};

export const neurodiversity101: CourseMeta = {
  title: "Neurodiversity 101",
  tags: [tagNeurodiversity, age5To11, age11To19, forParents],
  contributers: [naomi],
  image: neurodiversity101Image,
  runningTime: "1 hour 19 mins",
  videoUrl: makeVideoURL("957813449"),
};

export const autisticChildScreens: CourseMeta = {
  title:
    "Helping Your Autistic Child Develop a Healthy Relationship with Screens",
  tags: [tagAutism, tagScreens, age5To11, age11To19, forParents],
  contributers: [naomi],
  image: autisticChildScreensImage,
  runningTime: "1 hour 16 mins",
  videoUrl: makeVideoURL("957937308"),
};

export const autisticTeenWithAnxiety: CourseMeta = {
  title: "Helping Your Autistic Teen with Anxiety",
  tags: [tagAutism, tagAnxiety, tagMentalHealth, age11To19, forParents],
  contributers: [naomi],
  image: autisticTeenWithAnxietyImage,
  runningTime: "1 hour 22 mins",
};

export const autisticChildWithAnxiety: CourseMeta = {
  title: "Helping Your Autistic Child With Anxiety",
  tags: [tagAutism, tagAnxiety, tagMentalHealth, age5To11, forParents],
  contributers: [naomi],
  image: autisticChildWithAnxietyImage,
  runningTime: "1 hour 7 mins",
};

export const helpingYourAutisticChildWithStartingSchool: CourseMeta = {
  title: "Helping Your Autistic Child with Starting School",
  tags: [tagAutism, tagSchool, age5To11, forParents],
  contributers: [abi],
  image: helpingYourAutisticChildWithStartingSchoolImage,
  runningTime: "",
};

export const childWithAnxietyUnder8s: CourseMeta = {
  title: "Helping Your Child With Anxiety (Under 8s)",
  tags: [tagAnxiety, tagMentalHealth, age5To11, forParents],
  contributers: [naomi],
  image: childWithAnxietyUnder8sImage,
  runningTime: "1 hour 30 mins",
};

export const autisticChildWithTrauma: CourseMeta = {
  title: "Helping Your Autistic Child With Trauma",
  tags: [tagAutism, tagTrauma, tagMentalHealth, age5To11, forParents],
  contributers: [naomi],
  image: autisticChildWithTraumaImage,
  runningTime: "1 hour 33 mins",
};

export const childWithAnxiety6To13: CourseMeta = {
  title: "Helping Your Child With Anxiety (Ages 6 - 13)",
  tags: [tagAnxiety, age5To11, forParents],
  contributers: [naomi],
  image: childWithAnxiety6To13Image,
  runningTime: "1 hour 17 mins",
};

export const childWithSevereAnxiety: CourseMeta = {
  title: "Helping Your Child With Severe Anxiety",
  tags: [tagAnxiety, tagMentalHealth, age5To11, age11To19, forParents],
  contributers: [naomi],
  image: childWithSevereAnxietyImage,
  runningTime: "1 hour 5 mins",
};

export const burntOutBySchool: CourseMeta = {
  title: "Burnt Out by School",
  tags: [tagBurnout, tagSchool, tagMentalHealth, age11To19, forParents],
  contributers: [naomi],
  image: burntOutBySchoolImage,
  runningTime: "1 hour 40 mins",
};

export const helpingYourTeenWithAnxiety: CourseMeta = {
  title: "Helping Your Teen with Anxiety",
  tags: [tagAnxiety, tagMentalHealth, age11To19, forParents],
  contributers: [naomi],
  image: helpingYourTeenWithAnxietyImage,
  runningTime: "1 hour 28 mins",
};

export const anxietyAGuideForTeenagers: CourseMeta = {
  title: "Anxiety - A Guide for Teenagers",
  tags: [tagAnxiety, tagMentalHealth, age11To19, forTeens],
  contributers: [naomi],
  image: anxietyAGuideForTeenagersImage,
  runningTime: "1 hour 8 mins",
};

export const afterSchoolMovingOnFromSchoolTrauma: CourseMeta = {
  title: "After School: Helping your Autistic Child Move on from School Trauma",
  tags: [
    tagTrauma,
    tagSchool,
    tagMentalHealth,
    age5To11,
    age11To19,
    forParents,
  ],
  contributers: [naomi],
  image: afterSchoolMovingOnFromSchoolTraumaImage,
  runningTime: "2 hours 8 mins",
};

export const autisticChildrenWithSchool: CourseMeta = {
  title: "Helping Autistic Children with School",
  tags: [tagAutism, tagSchool, age5To11, age11To19, forParents],
  contributers: [naomi],
  image: autisticChildrenWithSchoolImage,
  runningTime: "1 hour 29 mins",
};

export const myChildIsNotFineAtSchool: CourseMeta = {
  title: "My Child is not Fine at School",
  tags: [
    tagSchool,
    tagBurnout,
    tagMentalHealth,
    age5To11,
    age11To19,
    forParents,
  ],
  contributers: [naomi],
  image: myChildIsNotFineAtSchoolImage,
  runningTime: "1 hour 46 mins",
};

export const doWeNeedAnEhcp: CourseMeta = {
  title: "Do we need an EHCP? If we do, what do we do now?",
  tags: [tagEHCPs, tagSchool, age5To11, age11To19, forParents],
  contributers: [abi],
  image: doWeNeedAnEhcpImage,
  runningTime: "57 mins",
};

export const takingControlOfYourEhcpAnnualReview: CourseMeta = {
  title: "Taking control of your EHCP Annual Review",
  tags: [tagEHCPs, tagSchool, age5To11, age11To19, forParents],
  contributers: [abi],
  image: takingControlOfYourEhcpAnnualReviewImage,
  runningTime: "60 mins",
};

export const weDontHaveAnEhcpWhatToExpectFromSchool: CourseMeta = {
  title: "We don't have an EHCP - what can we Expect from School?",
  tags: [tagEHCPs, tagSchool, age5To11, age11To19, forParents],
  contributers: [abi],
  image: weDontHaveAnEhcpWhatToExpectFromSchoolImage,
  runningTime: "1 hour 7 mins",
};

export const findingYourWayThroughTheEHCPJungle: CourseMeta = {
  title: "Finding Your Way Through the EHCP Jungle",
  tags: [tagEHCPs, tagSchool, age5To11, age11To19, forParents],
  contributers: [abi, eliza],
  image: ehcpJungleImage,
  runningTime: "1 hour 26 mins",
};

export const navigatingTheSenTribunalProcess: CourseMeta = {
  title: "Navigating the SEN Tribunal process",
  tags: [tagSEN, tagSchool, age5To11, age11To19, forParents],
  contributers: [abi],
  image: navigatingTheSenTribunalProcessImage,
  runningTime: "1 hour 23 mins",
};

export const thrivingAfterSchoolBreakdown: CourseMeta = {
  title: "Thriving After School Breakdown: An Illustrated Talk",
  tags: [tagSchool, age5To11, age11To19, forParents],
  contributers: [naomi, eliza],
  image: thrivingAfterSchoolBreakdownImage,
  runningTime: "1 hour 36 mins",
};

export const burnoutAGuideForTeenagers: CourseMeta = {
  title: "Burnout - A Guide for Teenagers",
  tags: [tagBurnout, tagMentalHealth, age11To19, forTeens],
  contributers: [naomi],
  image: teenagerBurnout101Image,
  runningTime: "1 hour 10 mins",
};

export const demandAvoidanceGuideForTeenagers: CourseMeta = {
  title: "Demand Avoidance - A Guide for Teenagers",
  tags: [tagDemandAvoidance, age11To19, forTeens],
  contributers: [naomi],
  image: demandAvoidanceGuideForTeenagersImage,
  runningTime: "1 hour 12 mins",
};

export const workingWithDemandAvoidantChildrenTherapy: CourseMeta = {
  title:
    "Working with Demand Avoidant Children: The Art and Science of Low Demand Therapy",
  tags: [tagDemandAvoidance, age5To11, age11To19, forProfessionals],
  contributers: [naomi],
  image: workingWithDemandAvoidantChildrenTherapyImage,
  runningTime: "1 hour 5 minutes",
};

export const ALDP1: CourseMeta = {
  title: "The Art of Low Demand Parenting: Activate Your Parenting",
  tags: [tagALDP, age5To11, age11To19, forParents],
  contributers: [naomi, eliza],
  image: ALDP1Image,
  runningTime: "1 hour 30 mins",
};

export const ALDP2: CourseMeta = {
  title: "The Art of Low Demand Parenting: Communication",
  tags: [tagALDP, age5To11, age11To19, forParents],
  contributers: [naomi, eliza],
  image: ALDP2Image,
  runningTime: "1 hour 30 mins",
};

export const ALDP3: CourseMeta = {
  title: "The Art of Low Demand Parenting: Behaviour",
  tags: [tagALDP, age5To11, age11To19, forParents],
  contributers: [naomi, eliza],
  image: ALDP3Image,
  runningTime: "1 hour 30 mins",
};

export const ALDP4: CourseMeta = {
  title: "The Art of Low Demand Parenting: Emotions",
  tags: [tagALDP, tagMentalHealth, age5To11, age11To19, forParents],
  contributers: [naomi, eliza],
  image: ALDP4Image,
  runningTime: "1 hour 30 mins",
};

export const ALDP5: CourseMeta = {
  title: "The Art of Low Demand Parenting: The Real World",
  tags: [tagALDP, age5To11, age11To19, forParents],
  contributers: [naomi, eliza],
  image: ALDP5Image,
  runningTime: "1 hour 30 mins",
};

export const ALDP6: CourseMeta = {
  title: "The Art of Low Demand Parenting: Other People",
  tags: [tagALDP, age5To11, age11To19, forParents],
  contributers: [naomi, eliza],
  image: ALDP6Image,
  runningTime: "1 hour 30 mins",
};

export const ALDP7: CourseMeta = {
  title: "The Art of Low Demand Parenting: Screens",
  tags: [tagALDP, tagScreens, age5To11, age11To19, forParents],
  contributers: [naomi, eliza],
  image: ALDP7Image,
  runningTime: "1 hour 30 mins",
};

export const ALDP8: CourseMeta = {
  title: "The Art of Low Demand Parenting: School",
  tags: [tagALDP, tagSchool, age5To11, age11To19, forParents],
  contributers: [naomi, eliza],
  image: ALDP8Image,
  runningTime: "1 hour 30 mins",
};

export const ALDP9: CourseMeta = {
  title: "The Art of Low Demand Parenting: What About The Future?",
  tags: [tagALDP, age5To11, age11To19, forParents],
  contributers: [naomi, eliza],
  image: ALDP9Image,
  runningTime: "1 hour 30 mins",
};

export const ALDP10: CourseMeta = {
  title: "The Art of Low Demand Parenting: What About Me?",
  tags: [tagALDP, tagMentalHealth, age5To11, age11To19, forParents],
  contributers: [naomi, eliza],
  image: ALDP10Image,
  runningTime: "1 hour 30 mins",
};

export const ALDP1To10: CourseMeta = {
  title: "All 10 in the Art of Low Demand Parenting series",
  tags: [tagALDP, tagSchool, tagScreens, age5To11, age11To19, forParents],
  contributers: [naomi, eliza],
  image: ALDP1To10Image,
  runningTime: "22 hours 30 mins (approx)",
};

export const ALDP1To5: CourseMeta = {
  title: "First 5 in The Art of Low Demand Parenting series",
  tags: [tagALDP, age5To11, age11To19, forParents],
  contributers: [naomi, eliza],
  image: ALDP1To5Image,
  runningTime: "7 hours 30 mins",
};

export const ALDP6To10: CourseMeta = {
  title: "6-10 in The Art of Low Demand Parenting series",
  tags: [tagALDP, tagSchool, tagScreens, age5To11, age11To19, forParents],
  contributers: [naomi, eliza],
  image: ALDP6To10Image,
  runningTime: "7 hours 30 mins",
};

export const EMDR1: CourseMeta = {
  title: "EMDR Refresher Training - Assessment Phase",
  tags: [tagEMDR, forProfessionals],
  contributers: [naomi],
  image: EMDR1Image,
  runningTime: "41 mins",
};

export const EMDR2: CourseMeta = {
  title: "EMDR Refresher Training - Blocked Processing",
  tags: [tagEMDR, forProfessionals],
  contributers: [naomi],
  image: EMDR2Image,
  runningTime: "48 mins",
};

export const EMDR3: CourseMeta = {
  title: "EMDR Refresher Training - Cognitive Interweaves",
  tags: [tagEMDR, forProfessionals],
  contributers: [naomi],
  image: EMDR3Image,
  runningTime: "52 mins",
};

export const EMDR4: CourseMeta = {
  title: "EMDR Refresher Training - Preparation Phase",
  tags: [tagEMDR, forProfessionals],
  contributers: [naomi],
  image: EMDR4Image,
  runningTime: "47 mins",
};

export const EMDR5: CourseMeta = {
  title: "EMDR Refresher Training - Desensitisation Phase",
  tags: [tagEMDR, forProfessionals],
  contributers: [naomi],
  image: EMDR5Image,
  runningTime: "44 mins",
};

export const EMDR6: CourseMeta = {
  title: "EMDR Refresher Training - Phases 5-8",
  tags: [tagEMDR, forProfessionals],
  contributers: [naomi],
  image: EMDR6Image,
  runningTime: "24 mins",
};

export const EMDR1To6: CourseMeta = {
  title: "EMDR Refresher Training Bundle - All 6 mini courses",
  tags: [tagEMDR, forProfessionals],
  contributers: [naomi],
  image: EMDR1To6Image,
  runningTime: "4 hours 16 mins",
};

export const traumaAndLoss: CourseMeta = {
  title: "Helping your Child Recover from Trauma and Loss",
  tags: [tagTrauma, tagMentalHealth, age5To11, age11To19],
  contributers: [naomi],
  image: traumaAndLossImage,
  runningTime: "1 hour 49 mins",
};

export const helpingYourChildWithLearningDisabilitiesWithAnxiety: CourseMeta = {
  title: "Helping Your Child with Learning Disabilities with Anxiety",
  tags: [tagSEN, tagAnxiety, tagMentalHealth, age5To11, age11To19, forParents],
  contributers: [naomi],
  image: helpingYourChildWithLearningDisabilitiesWithAnxietyImage,
  runningTime: "1 hour 29 mins",
};

export const helpingYourAutisticChildWithOCD: CourseMeta = {
  title: "Helping Your Autistic Child with OCD",
  tags: [
    tagAutism,
    tagAnxiety,
    tagMentalHealth,
    age5To11,
    age11To19,
    forParents,
  ],
  contributers: [naomi],
  image: helpingYourAutisticChildWithOCDImage,
  runningTime: "1 hour 16 mins",
};

export const helpingYourAutisticChildWithTransitions: CourseMeta = {
  title: "Helping Your Autistic Child with Transitions",
  tags: [
    tagAutism,
    tagAnxiety,
    tagMentalHealth,
    age5To11,
    age11To19,
    forParents,
  ],
  contributers: [naomi],
  image: helpingYourAutisticChildWithTransitionsImage,
  runningTime: "1 hour 23 mins",
};

export const eotasWhatToExpect: CourseMeta = {
  title: "EOTAS: What to Expect",
  tags: [
    tagEHCPs,
    tagSEN,
    tagAnxiety,
    tagMentalHealth,
    age5To11,
    age11To19,
    forParents,
  ],
  contributers: [abi],
  image: eotasWhatToExpectImage,
  runningTime: "58 mins",
};

// !! ADD NEW COURSES HERE !!
// Most recent first
export const allCourseMetas = [
  anxietyAGuideForTeenagers,
  helpingYourTeenWithAnxiety,
  navigatingTheSenTribunalProcess,
  takingControlOfYourEhcpAnnualReview,
  demandAvoidance101,
  demandAvoidantAdolescent,
  neurodiversity101,
  autisticChildWithAnxiety,
  autisticTeenWithAnxiety,
  autisticChildWithTrauma,
  autisticChildScreens,
  childWithAnxietyUnder8s,
  childWithAnxiety6To13,
  childWithSevereAnxiety,
  helpingYourChildWithLearningDisabilitiesWithAnxiety,
  helpingYourAutisticChildWithTransitions,
  helpingYourAutisticChildWithOCD,
  burntOutBySchool,
  afterSchoolMovingOnFromSchoolTrauma,
  autisticChildrenWithSchool,
  myChildIsNotFineAtSchool,
  doWeNeedAnEhcp,
  weDontHaveAnEhcpWhatToExpectFromSchool,
  burnoutAGuideForTeenagers,
  demandAvoidanceGuideForTeenagers,
  traumaAndLoss,
  workingWithDemandAvoidantChildrenTherapy,
  thrivingAfterSchoolBreakdown,
  helpingYourAutisticChildWithStartingSchool,
  eotasWhatToExpect,
  findingYourWayThroughTheEHCPJungle,
  ALDP1To10,
  ALDP1To5,
  ALDP6To10,
  ALDP1,
  ALDP2,
  ALDP3,
  ALDP4,
  ALDP5,
  ALDP6,
  ALDP7,
  ALDP8,
  ALDP9,
  ALDP10,
  EMDR1To6,
  EMDR1,
  EMDR2,
  EMDR3,
  EMDR4,
  EMDR5,
  EMDR6,
];

// For the featured list on the homepage
export const featuredCourses = [
  anxietyAGuideForTeenagers,
  helpingYourTeenWithAnxiety,
  autisticTeenWithAnxiety,
  childWithSevereAnxiety,
];

// !! ADD RELATED COURSES HERE !!

helpingYourAutisticChildWithOCD.relatedTitles = [
  autisticChildWithAnxiety.title,
  autisticTeenWithAnxiety.title,
  helpingYourAutisticChildWithTransitions.title,
];

helpingYourAutisticChildWithTransitions.relatedTitles = [
  autisticChildWithAnxiety.title,
  autisticTeenWithAnxiety.title,
  helpingYourAutisticChildWithOCD.title,
];

demandAvoidance101.relatedTitles = [
  demandAvoidantAdolescent.title,
  demandAvoidanceGuideForTeenagers.title,
];

neurodiversity101.relatedTitles = [
  autisticChildrenWithSchool.title,
  autisticChildWithAnxiety.title,
  autisticTeenWithAnxiety.title,
  autisticChildScreens.title,
  demandAvoidance101.title,
  demandAvoidantAdolescent.title,
  demandAvoidanceGuideForTeenagers.title,
];

demandAvoidantAdolescent.relatedTitles = [
  demandAvoidanceGuideForTeenagers.title,
  demandAvoidance101.title,
];

autisticChildScreens.relatedTitles = [
  autisticChildWithAnxiety.title,
  autisticTeenWithAnxiety.title,
  autisticChildWithTrauma.title,
  childWithSevereAnxiety.title,
];

autisticTeenWithAnxiety.relatedTitles = [
  autisticChildWithAnxiety.title,
  childWithSevereAnxiety.title,
  childWithAnxiety6To13.title,
];

autisticChildWithAnxiety.relatedTitles = [
  autisticTeenWithAnxiety.title,
  childWithSevereAnxiety.title,
  childWithAnxietyUnder8s.title,
  childWithAnxiety6To13.title,
];

helpingYourAutisticChildWithStartingSchool.relatedTitles = [
  autisticChildrenWithSchool.title,
  autisticChildWithAnxiety.title,
];

childWithAnxietyUnder8s.relatedTitles = [
  childWithAnxiety6To13.title,
  childWithSevereAnxiety.title,
];

autisticChildWithTrauma.relatedTitles = [
  afterSchoolMovingOnFromSchoolTrauma.title,
  traumaAndLoss.title,
  autisticChildWithAnxiety.title,
  childWithSevereAnxiety.title,
];

childWithAnxiety6To13.relatedTitles = [
  childWithSevereAnxiety.title,
  childWithAnxietyUnder8s.title,
];

childWithSevereAnxiety.relatedTitles = [
  childWithAnxietyUnder8s.title,
  childWithAnxiety6To13.title,
];

burntOutBySchool.relatedTitles = [
  burnoutAGuideForTeenagers.title,
  myChildIsNotFineAtSchool.title,
  autisticChildrenWithSchool.title,
  thrivingAfterSchoolBreakdown.title,
];

afterSchoolMovingOnFromSchoolTrauma.relatedTitles = [
  burntOutBySchool.title,
  autisticChildWithTrauma.title,
  traumaAndLoss.title,
  burnoutAGuideForTeenagers.title,
];

autisticChildrenWithSchool.relatedTitles = [
  helpingYourAutisticChildWithStartingSchool.title,
  autisticChildWithAnxiety.title,
  autisticTeenWithAnxiety.title,
  burntOutBySchool.title,
  myChildIsNotFineAtSchool.title,
];

myChildIsNotFineAtSchool.relatedTitles = [
  burntOutBySchool.title,
  autisticChildrenWithSchool.title,
  afterSchoolMovingOnFromSchoolTrauma.title,
  thrivingAfterSchoolBreakdown.title,
];

doWeNeedAnEhcp.relatedTitles = [
  weDontHaveAnEhcpWhatToExpectFromSchool.title,
  takingControlOfYourEhcpAnnualReview.title,
  findingYourWayThroughTheEHCPJungle.title,
];

takingControlOfYourEhcpAnnualReview.relatedTitles = [
  weDontHaveAnEhcpWhatToExpectFromSchool.title,
  doWeNeedAnEhcp.title,
  findingYourWayThroughTheEHCPJungle.title,
];

weDontHaveAnEhcpWhatToExpectFromSchool.relatedTitles = [
  takingControlOfYourEhcpAnnualReview.title,
  doWeNeedAnEhcp.title,
  findingYourWayThroughTheEHCPJungle.title,
];

findingYourWayThroughTheEHCPJungle.relatedTitles = [
  weDontHaveAnEhcpWhatToExpectFromSchool.title,
  doWeNeedAnEhcp.title,
  takingControlOfYourEhcpAnnualReview.title,
];

thrivingAfterSchoolBreakdown.relatedTitles = [
  afterSchoolMovingOnFromSchoolTrauma.title,
  burntOutBySchool.title,
  myChildIsNotFineAtSchool.title,
  autisticChildrenWithSchool.title,
];

burnoutAGuideForTeenagers.relatedTitles = [
  demandAvoidanceGuideForTeenagers.title,
  burntOutBySchool.title,
];

demandAvoidanceGuideForTeenagers.relatedTitles = [
  burnoutAGuideForTeenagers.title,
  demandAvoidance101.title,
  demandAvoidantAdolescent.title,
];

workingWithDemandAvoidantChildrenTherapy.relatedTitles = [
  demandAvoidantAdolescent.title,
  demandAvoidance101.title,
  demandAvoidanceGuideForTeenagers.title,
];
traumaAndLoss.relatedTitles = [
  autisticChildWithTrauma.title,
  afterSchoolMovingOnFromSchoolTrauma.title,
];

navigatingTheSenTribunalProcess.relatedTitles = [
  helpingYourChildWithLearningDisabilitiesWithAnxiety.title,
];

helpingYourChildWithLearningDisabilitiesWithAnxiety.relatedTitles = [
  navigatingTheSenTribunalProcess.title,
];

ALDP1.relatedTitles = [
  ALDP2.title,
  ALDP3.title,
  ALDP4.title,
  ALDP5.title,
  ALDP6.title,
  ALDP7.title,
  ALDP8.title,
  ALDP9.title,
  ALDP10.title,
  ALDP1To10.title,
  ALDP1To5.title,
  ALDP6To10.title,
];

ALDP2.relatedTitles = [
  ALDP1.title,
  ALDP3.title,
  ALDP4.title,
  ALDP5.title,
  ALDP6.title,
  ALDP7.title,
  ALDP8.title,
  ALDP9.title,
  ALDP10.title,
  ALDP1To10.title,
  ALDP1To5.title,
  ALDP6To10.title,
];

ALDP3.relatedTitles = [
  ALDP1.title,
  ALDP2.title,
  ALDP4.title,
  ALDP5.title,
  ALDP6.title,
  ALDP7.title,
  ALDP8.title,
  ALDP9.title,
  ALDP10.title,
  ALDP1To10.title,
  ALDP1To5.title,
  ALDP6To10.title,
];

ALDP4.relatedTitles = [
  ALDP1.title,
  ALDP2.title,
  ALDP3.title,
  ALDP5.title,
  ALDP6.title,
  ALDP7.title,
  ALDP8.title,
  ALDP9.title,
  ALDP10.title,
  ALDP1To10.title,
  ALDP1To5.title,
  ALDP6To10.title,
];

ALDP5.relatedTitles = [
  ALDP1.title,
  ALDP2.title,
  ALDP3.title,
  ALDP4.title,
  ALDP6.title,
  ALDP7.title,
  ALDP8.title,
  ALDP9.title,
  ALDP10.title,
  ALDP1To10.title,
  ALDP1To5.title,
  ALDP6To10.title,
];

ALDP6.relatedTitles = [
  ALDP1.title,
  ALDP2.title,
  ALDP3.title,
  ALDP4.title,
  ALDP5.title,
  ALDP7.title,
  ALDP8.title,
  ALDP9.title,
  ALDP10.title,
  ALDP1To10.title,
  ALDP1To5.title,
  ALDP6To10.title,
];

ALDP7.relatedTitles = [
  ALDP1.title,
  ALDP2.title,
  ALDP3.title,
  ALDP4.title,
  ALDP5.title,
  ALDP6.title,
  ALDP8.title,
  ALDP9.title,
  ALDP10.title,
  ALDP1To10.title,
  ALDP1To5.title,
  ALDP6To10.title,
];

ALDP8.relatedTitles = [
  ALDP1.title,
  ALDP2.title,
  ALDP3.title,
  ALDP4.title,
  ALDP5.title,
  ALDP6.title,
  ALDP7.title,
  ALDP9.title,
  ALDP10.title,
  ALDP1To10.title,
  ALDP1To5.title,
  ALDP6To10.title,
];

ALDP9.relatedTitles = [
  ALDP1.title,
  ALDP2.title,
  ALDP3.title,
  ALDP4.title,
  ALDP5.title,
  ALDP6.title,
  ALDP7.title,
  ALDP8.title,
  ALDP10.title,
  ALDP1To10.title,
  ALDP1To5.title,
  ALDP6To10.title,
];

ALDP10.relatedTitles = [
  ALDP1.title,
  ALDP2.title,
  ALDP3.title,
  ALDP4.title,
  ALDP5.title,
  ALDP6.title,
  ALDP7.title,
  ALDP8.title,
  ALDP9.title,
  ALDP1To10.title,
  ALDP1To5.title,
  ALDP6To10.title,
];

ALDP1To10.relatedTitles = [
  ALDP1To5.title,
  ALDP6To10.title,
  ALDP1.title,
  ALDP2.title,
  ALDP3.title,
  ALDP4.title,
  ALDP5.title,
  ALDP6.title,
  ALDP7.title,
  ALDP8.title,
  ALDP9.title,
  ALDP10.title,
];

ALDP1To5.relatedTitles = [
  ALDP6To10.title,
  ALDP1To10.title,
  ALDP1.title,
  ALDP2.title,
  ALDP3.title,
  ALDP4.title,
  ALDP5.title,
  ALDP6.title,
  ALDP7.title,
  ALDP8.title,
  ALDP9.title,
  ALDP10.title,
];

ALDP6To10.relatedTitles = [
  ALDP1To5.title,
  ALDP1To10.title,
  ALDP1.title,
  ALDP2.title,
  ALDP3.title,
  ALDP4.title,
  ALDP5.title,
  ALDP6.title,
  ALDP7.title,
  ALDP8.title,
  ALDP9.title,
  ALDP10.title,
];

EMDR1.relatedTitles = [
  EMDR2.title,
  EMDR3.title,
  EMDR4.title,
  EMDR5.title,
  EMDR6.title,
  EMDR1To6.title,
];

EMDR2.relatedTitles = [
  EMDR1.title,
  EMDR3.title,
  EMDR4.title,
  EMDR5.title,
  EMDR6.title,
  EMDR1To6.title,
];

EMDR3.relatedTitles = [
  EMDR1.title,
  EMDR2.title,
  EMDR4.title,
  EMDR5.title,
  EMDR6.title,
  EMDR1To6.title,
];

EMDR4.relatedTitles = [
  EMDR1.title,
  EMDR2.title,
  EMDR3.title,
  EMDR5.title,
  EMDR6.title,
  EMDR1To6.title,
];

EMDR5.relatedTitles = [
  EMDR1.title,
  EMDR2.title,
  EMDR3.title,
  EMDR4.title,
  EMDR6.title,
  EMDR1To6.title,
];

EMDR6.relatedTitles = [
  EMDR1.title,
  EMDR2.title,
  EMDR3.title,
  EMDR4.title,
  EMDR5.title,
  EMDR1To6.title,
];

EMDR1To6.relatedTitles = [
  EMDR1.title,
  EMDR2.title,
  EMDR3.title,
  EMDR4.title,
  EMDR5.title,
  EMDR6.title,
];

export function lowerCaseAndRemoveWhitespace(input: string) {
  // console.log("TESTING: " + JSON.stringify(input));
  return input.toLowerCase().replace(/\s+/g, "");
}

export function getCourseMetaFromTitle(title: string): CourseMeta | undefined {
  return allCourseMetas.find((meta) =>
    lowerCaseAndRemoveWhitespace(title).startsWith(
      lowerCaseAndRemoveWhitespace(meta.title),
    ),
  );
}

export function getTaggedCourses(courses, tags: string[]) {
  const taggedCourses = allCourseMetas
    .filter((cm) => cm.tags.some((e) => tags.includes(e)))
    //  .sort((a, b) => b.tags.indexOf(tags[0]) - a.tags.indexOf(tags[0]))
    .map((cm) =>
      courses.find((c) => {
        const course = lowerCaseAndRemoveWhitespace(c.data.title).startsWith(
          lowerCaseAndRemoveWhitespace(cm.title),
        );
        return course;
      }),
    );

  // console.log(`For tags ${tags} courses are  ${taggedCourses}`);
  return taggedCourses;
}

export function getTaggedBooks(books, tags: string[]) {
  return books.filter((book) => book.data.tags.some((e) => tags.includes(e)));
}

export function getTaggedWebinars(webinars, tags: string[]) {
  return webinars.filter((webinar) => {
    const eventId = webinar.id;
    const meta = getWebinarMeta(eventId);
    return meta?.tags?.some((t) => tags.includes(t));
  });
}

export function getTaggedPosts(posts, tags: string[]) {
  return posts.filter((post) => post.data.tags?.some((e) => tags.includes(e)));
}
