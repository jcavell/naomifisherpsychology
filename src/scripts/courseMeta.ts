import {
  age13To18,
  age5To12,
  tagDemandAvoidance,
  forParents,
  tagAutism,
  tagScreens,
  tagAnxiety,
  tagTrauma,
  tagBurnout,
  tagSchool,
  tagEHCP,
  forTeens,
  forProfessionals,
  tagALDP,
  tagEMDR,
  tagNeurodiversity,
} from "./tags";
import { naomi, abi, eliza } from "./people";

// Course Images
import demandAvoidance101Image from "../images/courses/demand-avoidance-101.png";
import neurodiversity101Image from "../images/courses/neurodiversity-101.png";
import autisticChildScreensImage from "../images/courses/helping-your-autistic-child-develop-a-healthy-relationship-with-screens.png";
import autisticTeenWithAnxietyImage from "../images/courses/helping-your-autistic-teen-with-anxiety.png";
import autisticChildWithAnxietyImage from "../images/courses/helping-your-autistic-child-with-anxiety.png";
import demandAvoidantAdolescentImage from "../images/courses/understanding-and-helping-your-demand-avoidant-adolescent.png";
import childWithAnxietyUnder8sImage from "../images/courses/helping-your-child-with-anxiety-under-8s.png";
import childWithAnxiety6To13Image from "../images/courses/helping-your-child-with-anxiety-6-to-13.png";
import autisticChildWithTraumaImage from "../images/courses/helping-your-autistic-child-with-trauma.png";
import afterSchoolMovingOnFromSchoolTraumaImage from "../images/courses/after-school-moving-on-from-school-trauma.png";
import burntOutBySchoolImage from "../images/courses/burnt-out-by-school.png";
import doWeNeedAnEhcpImage from "../images/courses/do-we-need-an-ehcp.png";
import autisticChildrenWithSchoolImage from "../images/courses/helping-autistic-children-with-school.png";
import childWithSevereAnxietyImage from "../images/courses/helping-your-child-with-severe-anxiety.png";
import myChildIsNotFineAtSchoolImage from "../images/courses/my-child-is-not-fine-at-school.png";
import takingControlOfYourEhcpAnnualReviewImage from "../images/courses/taking-control-of-your-ehcp-annual-review.png";
import teenagerBurnout101Image from "../images/courses/teenager-burnout-101.png";
import weDontHaveAnEhcpWhatToExpectFromSchoolImage from "../images/courses/we-dont-have-an-ehcp-what-to-expect-from-school.png";
import whatIsDemandAvoidanceGuideForTeenagersImage from "../images/courses/what-is-demand-avoidance-a-guide-for-teenagers.png";
import workingWithDemandAvoidantChildrenTherapyImage from "../images/courses/working-with-demand-avoidant-children-low-demand-therapy.png";
import traumaAndLossImage from "../images/courses/helping-your-child-recover-from-trauma-and-loss.png";
import ehcpJungleImage from "../images/courses/finding-your-way-through-the-ehcp-jungle.png";
import thrivingAfterSchoolBreakdownImage from "../images/courses/thriving-after-school-breakdown.png";
import helpingYourAutisticChildWithStartingSchoolImage from "../images/courses/helping-your-autistic-child-with-starting-school.png";

import ALDP1Image from "../images/courses/ALDP-1.png";
import ALDP2Image from "../images/courses/ALDP-2.png";
import ALDP3Image from "../images/courses/ALDP-3.png";
import ALDP4Image from "../images/courses/ALDP-4.png";
import ALDP5Image from "../images/courses/ALDP-5.png";
import ALDP6Image from "../images/courses/ALDP-6.png";
import ALDP7Image from "../images/courses/ALDP-7.png";
import ALDP8Image from "../images/courses/ALDP-8.png";
import ALDP9Image from "../images/courses/ALDP-9.png";
import ALDP10Image from "../images/courses/ALDP-10.png";
import ALDP1To10Image from "../images/courses/ALDP-1-10.png";
import ALDP1To5Image from "../images/courses/ALDP-1-5.png";
import ALDP6To10Image from "../images/courses/ALDP-6-10.png";

import EMDR1Image from "../images/courses/EMDR-1.png";
import EMDR2Image from "../images/courses/EMDR-2.png";
import EMDR3Image from "../images/courses/EMDR-3.png";
import EMDR4Image from "../images/courses/EMDR-4.png";
import EMDR5Image from "../images/courses/EMDR-5.png";
import EMDR6Image from "../images/courses/EMDR-6.png";
import EMDR1To6Image from "../images/courses/EMDR-1-6.png";

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
  tags: [tagDemandAvoidance, age13To18, forParents],
  contributers: [naomi],
  runningTime: "1 hour 17 mins",
  image: demandAvoidantAdolescentImage,
  videoUrl: makeVideoURL("957825416"),
};

const demandAvoidance101: CourseMeta = {
  title: "Demand Avoidance 101",
  contributers: [naomi],
  tags: [tagDemandAvoidance, age5To12, age13To18, forParents],
  runningTime: "1 hour 15 mins",
  image: demandAvoidance101Image,
  videoUrl: makeVideoURL("953498420"),
};

export const neurodiversity101: CourseMeta = {
  title: "Neurodiversity 101",
  tags: [tagNeurodiversity, age5To12, age13To18, forParents],
  contributers: [naomi],
  image: neurodiversity101Image,
  runningTime: "1 hour 19 mins",
  videoUrl: makeVideoURL("957813449"),
};

export const autisticChildScreens: CourseMeta = {
  title:
    "Helping Your Autistic Child Develop a Healthy Relationship with Screens",
  tags: [tagAutism, tagScreens, age5To12, age13To18, forParents],
  contributers: [naomi],
  image: autisticChildScreensImage,
  runningTime: "1 hour 16 mins",
  videoUrl: makeVideoURL("957937308"),
};

export const autisticTeenWithAnxiety: CourseMeta = {
  title: "Helping Your Autistic Teen with Anxiety",
  tags: [tagAutism, tagAnxiety, age13To18, forParents],
  contributers: [naomi],
  image: autisticTeenWithAnxietyImage,
  runningTime: "1 hour 22 mins",
};

export const autisticChildWithAnxiety: CourseMeta = {
  title: "Helping Your Autistic Child With Anxiety",
  tags: [tagAutism, tagAnxiety, age5To12, forParents],
  contributers: [naomi],
  image: autisticChildWithAnxietyImage,
  runningTime: "1 hour 7 mins",
};

export const helpingYourAutisticChildWithStartingSchool: CourseMeta = {
  title: "Helping Your Autistic Child with Starting School",
  tags: [tagAutism, tagSchool, age5To12, forParents],
  contributers: [abi],
  image: helpingYourAutisticChildWithStartingSchoolImage,
  runningTime: "",
};

export const childWithAnxietyUnder8s: CourseMeta = {
  title: "Helping Your Child With Anxiety (Under 8s)",
  tags: [tagAnxiety, age5To12, forParents],
  contributers: [naomi],
  image: childWithAnxietyUnder8sImage,
  runningTime: "1 hour 30 mins",
};

export const autisticChildWithTrauma: CourseMeta = {
  title: "Helping Your Autistic Child With Trauma",
  tags: [tagAutism, tagTrauma, age5To12, forParents],
  contributers: [naomi],
  image: autisticChildWithTraumaImage,
  runningTime: "1 hour 33 mins",
};

export const childWithAnxiety6To13: CourseMeta = {
  title: "Helping Your Child With Anxiety (Ages 6 - 13)",
  tags: [tagAnxiety, age5To12, forParents],
  contributers: [naomi],
  image: childWithAnxiety6To13Image,
  runningTime: "1 hour 17 mins",
};

export const childWithSevereAnxiety: CourseMeta = {
  title: "Helping Your Child With Severe Anxiety",
  tags: [tagAnxiety, age5To12, forParents],
  contributers: [naomi],
  image: childWithSevereAnxietyImage,
  runningTime: "1 hour 5 mins",
};

export const burntOutBySchool: CourseMeta = {
  title: "Burnt Out by School",
  tags: [tagBurnout, tagSchool, age5To12, age13To18, forParents],
  contributers: [naomi],
  image: burntOutBySchoolImage,
  runningTime: "1 hour 40 mins",
};

export const afterSchoolMovingOnFromSchoolTrauma: CourseMeta = {
  title: "After School: Helping your Autistic Child Move on from School Trauma",
  tags: [tagTrauma, tagSchool, age5To12, age13To18, forParents],
  contributers: [naomi],
  image: afterSchoolMovingOnFromSchoolTraumaImage,
  runningTime: "2 hours 8 mins",
};

export const autisticChildrenWithSchool: CourseMeta = {
  title: "Helping Autistic Children with School",
  tags: [tagAutism, tagSchool, age5To12, age13To18, forParents],
  contributers: [naomi],
  image: autisticChildrenWithSchoolImage,
  runningTime: "1 hour 29 mins",
};

export const myChildIsNotFineAtSchool: CourseMeta = {
  title: "My Child is not Fine at School",
  tags: [tagSchool, tagBurnout, age5To12, age13To18, forParents],
  contributers: [naomi],
  image: myChildIsNotFineAtSchoolImage,
  runningTime: "1 hour 46 mins",
};

export const doWeNeedAnEhcp: CourseMeta = {
  title: "Do we need an EHCP? If we do, what do we do now?",
  tags: [tagEHCP, tagSchool, age5To12, age13To18, forParents],
  contributers: [abi],
  image: doWeNeedAnEhcpImage,
  runningTime: "57 mins",
};

export const takingControlOfYourEhcpAnnualReview: CourseMeta = {
  title: "Taking control of your EHCP Annual Review",
  tags: [tagEHCP, tagSchool, age5To12, age13To18, forParents],
  contributers: [abi],
  image: takingControlOfYourEhcpAnnualReviewImage,
  runningTime: "60 mins",
};

export const weDontHaveAnEhcpWhatToExpectFromSchool: CourseMeta = {
  title: "We don't have an EHCP - what can we Expect from School?",
  tags: [tagEHCP, tagSchool, age5To12, age13To18, forParents],
  contributers: [abi],
  image: weDontHaveAnEhcpWhatToExpectFromSchoolImage,
  runningTime: "1 hour 7 mins",
};

export const findingYourWayThroughTheEHCPJungle: CourseMeta = {
  title: "Finding Your Way Through the EHCP Jungle",
  tags: [tagEHCP, tagSchool, age5To12, age13To18, forParents],
  contributers: [abi, eliza],
  image: ehcpJungleImage,
  runningTime: "1 hour 26 mins",
};

export const thrivingAfterSchoolBreakdown: CourseMeta = {
  title: "Thriving After School Breakdown: An Illustrated Talk",
  tags: [tagSchool, age5To12, age13To18, forParents],
  contributers: [naomi, eliza],
  image: thrivingAfterSchoolBreakdownImage,
  runningTime: "1 hour 36 mins",
};

export const burnoutAGuideForTeenagers: CourseMeta = {
  title: "Teenager Burnout 101",
  tags: [tagBurnout, age13To18, forTeens],
  contributers: [naomi],
  image: teenagerBurnout101Image,
  runningTime: "1 hour 10 mins",
};

export const whatIsDemandAvoidanceGuideForTeenagers: CourseMeta = {
  title: "What is Demand Avoidance? A Guide for Teenagers",
  tags: [tagDemandAvoidance, age13To18, forTeens],
  contributers: [naomi],
  image: whatIsDemandAvoidanceGuideForTeenagersImage,
  runningTime: "1 hour 12 mins",
};

export const workingWithDemandAvoidantChildrenTherapy: CourseMeta = {
  title:
    "Working with Demand Avoidant Children: The Art and Science of Low Demand Therapy",
  tags: [tagDemandAvoidance, age5To12, age13To18, forProfessionals],
  contributers: [naomi],
  image: workingWithDemandAvoidantChildrenTherapyImage,
  runningTime: "1 hour 5 minutes",
};

export const ALDP1: CourseMeta = {
  title: "The Art of Low Demand Parenting: Activate Your Parenting",
  tags: [tagALDP, age5To12, age13To18, forParents],
  contributers: [naomi, eliza],
  image: ALDP1Image,
  runningTime: "1 hour 30 mins",
};

export const ALDP2: CourseMeta = {
  title: "The Art of Low Demand Parenting: Communication",
  tags: [tagALDP, age5To12, age13To18, forParents],
  contributers: [naomi, eliza],
  image: ALDP2Image,
  runningTime: "1 hour 30 mins",
};

export const ALDP3: CourseMeta = {
  title: "The Art of Low Demand Parenting: Behaviour",
  tags: [tagALDP, age5To12, age13To18, forParents],
  contributers: [naomi, eliza],
  image: ALDP3Image,
  runningTime: "1 hour 30 mins",
};

export const ALDP4: CourseMeta = {
  title: "The Art of Low Demand Parenting: Emotions",
  tags: [tagALDP, age5To12, age13To18, forParents],
  contributers: [naomi, eliza],
  image: ALDP4Image,
  runningTime: "1 hour 30 mins",
};

export const ALDP5: CourseMeta = {
  title: "The Art of Low Demand Parenting: The Real World",
  tags: [tagALDP, age5To12, age13To18, forParents],
  contributers: [naomi, eliza],
  image: ALDP5Image,
  runningTime: "1 hour 30 mins",
};

export const ALDP6: CourseMeta = {
  title: "The Art of Low Demand Parenting: Other People",
  tags: [tagALDP, age5To12, age13To18, forParents],
  contributers: [naomi, eliza],
  image: ALDP6Image,
  runningTime: "1 hour 30 mins",
};

export const ALDP7: CourseMeta = {
  title: "The Art of Low Demand Parenting: Screens",
  tags: [tagALDP, tagScreens, age5To12, age13To18, forParents],
  contributers: [naomi, eliza],
  image: ALDP7Image,
  runningTime: "1 hour 30 mins",
};

export const ALDP8: CourseMeta = {
  title: "The Art of Low Demand Parenting: School",
  tags: [tagALDP, tagSchool, age5To12, age13To18, forParents],
  contributers: [naomi, eliza],
  image: ALDP8Image,
  runningTime: "1 hour 30 mins",
};

export const ALDP9: CourseMeta = {
  title: "The Art of Low Demand Parenting: What About The Future?",
  tags: [tagALDP, age5To12, age13To18, forParents],
  contributers: [naomi, eliza],
  image: ALDP9Image,
  runningTime: "1 hour 30 mins",
};

export const ALDP10: CourseMeta = {
  title: "The Art of Low Demand Parenting: What About Me?",
  tags: [tagALDP, age5To12, age13To18, forParents],
  contributers: [naomi, eliza],
  image: ALDP10Image,
  runningTime: "1 hour 30 mins",
};

export const ALDP1To10: CourseMeta = {
  title: "All 10 in the Art of Low Demand Parenting series",
  tags: [tagALDP, tagSchool, tagScreens, age5To12, age13To18, forParents],
  contributers: [naomi, eliza],
  image: ALDP1To10Image,
  runningTime: "22 hours 30 mins (approx)",
};

export const ALDP1To5: CourseMeta = {
  title: "First 5 in The Art of Low Demand Parenting series",
  tags: [tagALDP, age5To12, age13To18, forParents],
  contributers: [naomi, eliza],
  image: ALDP1To5Image,
  runningTime: "7 hours 30 mins",
};

export const ALDP6To10: CourseMeta = {
  title: "6-10 in The Art of Low Demand Parenting series",
  tags: [tagALDP, tagSchool, tagScreens, age5To12, age13To18, forParents],
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
  tags: [tagTrauma, age5To12, age13To18],
  contributers: [naomi],
  image: traumaAndLossImage,
  runningTime: "1 hour 49 mins",
};

// !! ADD NEW COURSES HERE !!
// Most recent first
export const allCourses = [
  autisticChildWithTrauma,
  takingControlOfYourEhcpAnnualReview,
  demandAvoidance101,
  demandAvoidantAdolescent,
  neurodiversity101,
  autisticTeenWithAnxiety,
  autisticChildWithAnxiety,
  autisticChildScreens,
  childWithAnxietyUnder8s,
  childWithAnxiety6To13,
  childWithSevereAnxiety,
  burntOutBySchool,
  afterSchoolMovingOnFromSchoolTrauma,
  autisticChildrenWithSchool,
  myChildIsNotFineAtSchool,
  doWeNeedAnEhcp,
  weDontHaveAnEhcpWhatToExpectFromSchool,
  burnoutAGuideForTeenagers,
  whatIsDemandAvoidanceGuideForTeenagers,
  traumaAndLoss,
  workingWithDemandAvoidantChildrenTherapy,
  findingYourWayThroughTheEHCPJungle,
  thrivingAfterSchoolBreakdown,
  helpingYourAutisticChildWithStartingSchool,
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
  traumaAndLoss,
  workingWithDemandAvoidantChildrenTherapy,
  neurodiversity101,
  autisticTeenWithAnxiety,
];

// !! ADD RELATED COURSES HERE !!

demandAvoidance101.relatedTitles = [
  demandAvoidantAdolescent.title,
  whatIsDemandAvoidanceGuideForTeenagers.title,
];

neurodiversity101.relatedTitles = [
  autisticChildrenWithSchool.title,
  autisticChildWithAnxiety.title,
  autisticTeenWithAnxiety.title,
  autisticChildScreens.title,
  demandAvoidance101.title,
  demandAvoidantAdolescent.title,
  whatIsDemandAvoidanceGuideForTeenagers.title,
];

demandAvoidantAdolescent.relatedTitles = [
  whatIsDemandAvoidanceGuideForTeenagers.title,
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
  whatIsDemandAvoidanceGuideForTeenagers.title,
  burntOutBySchool.title,
];

whatIsDemandAvoidanceGuideForTeenagers.relatedTitles = [
  burnoutAGuideForTeenagers.title,
  demandAvoidance101.title,
  demandAvoidantAdolescent.title,
];

workingWithDemandAvoidantChildrenTherapy.relatedTitles = [
  demandAvoidantAdolescent.title,
  demandAvoidance101.title,
  whatIsDemandAvoidanceGuideForTeenagers.title,
];
traumaAndLoss.relatedTitles = [
  autisticChildWithTrauma.title,
  afterSchoolMovingOnFromSchoolTrauma.title,
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
  return allCourses.find((meta) =>
    lowerCaseAndRemoveWhitespace(title).startsWith(
      lowerCaseAndRemoveWhitespace(meta.title)
    )
  );
}
