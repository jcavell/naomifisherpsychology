import {
  age11To18,
  age5To12,
  tagDemandAvoidance,
  forParents,
  allAges,
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
  tagEMDR
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

type CourseMeta = {
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
  tags: [tagDemandAvoidance, age11To18, forParents],
  contributers: [naomi],
  runningTime: "1 hour 20 mins",
  image: demandAvoidantAdolescentImage,
  videoUrl: makeVideoURL("957825416"),
};

const demandAvoidance101: CourseMeta = {
  title: "Demand Avoidance 101",
  contributers: [naomi],
  tags: [tagDemandAvoidance, forParents, allAges],
  runningTime: "1 hour 15 mins",
  image: demandAvoidance101Image,
  videoUrl: makeVideoURL("953498420"),
};

export const neurodiversity101: CourseMeta = {
  title: "Neurodiversity 101",
  tags: [tagAutism, allAges, forParents],
  contributers: [naomi],
  image: neurodiversity101Image,
  runningTime: "1 hour 19 mins",
  videoUrl: makeVideoURL("957813449"),
};

export const autisticChildScreens: CourseMeta = {
  title:
    "Helping Your Autistic Child Develop a Healthy Relationship with Screens",
  tags: [tagAutism, tagScreens, allAges, forParents],
  contributers: [naomi],
  image: autisticChildScreensImage,
  runningTime: "1 hour 16 mins",
  videoUrl: makeVideoURL("957937308"),
};

export const autisticTeenWithAnxiety: CourseMeta = {
  title: "Helping Your Autistic Teen with Anxiety",
  tags: [tagAutism, tagAnxiety, age11To18, forParents],
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

export const childWithAnxietyUnder8s: CourseMeta = {
  title: "Helping Your Child With Anxiety (Under 8s)",
  tags: [tagAnxiety, age5To12, forParents],
  contributers: [naomi],
  image: childWithAnxietyUnder8sImage,
  runningTime: "TBC",
};

export const autisticChildWithTrauma: CourseMeta = {
  title: "Helping Your Autistic Child With Trauma",
  tags: [tagAutism, tagTrauma, age5To12, forParents],
  contributers: [naomi],
  image: autisticChildWithTraumaImage,
  runningTime: "TBC",
};

export const childWithAnxiety6To13: CourseMeta = {
  title: "Helping Your Child With Anxiety (Ages 6 - 13)",
  tags: [tagAnxiety, age5To12, forParents],
  contributers: [naomi],
  image: childWithAnxiety6To13Image,
  runningTime: "TBC",
};

export const childWithSevereAnxiety: CourseMeta = {
  title: "Helping Your Child With Severe Anxiety",
  tags: [tagAnxiety, age5To12, forParents],
  contributers: [naomi],
  image: childWithSevereAnxietyImage,
  runningTime: "TBC",
};

export const burntOutBySchool: CourseMeta = {
  title: "Burnt Out by School",
  tags: [tagBurnout, tagSchool, age5To12, age11To18, forParents],
  contributers: [naomi],
  image: burntOutBySchoolImage,
  runningTime: "TBC",
};

export const afterSchoolMovingOnFromSchoolTrauma: CourseMeta = {
  title: "After School: Helping your Autistic Child Move on from School Trauma",
  tags: [tagTrauma, tagSchool, age5To12, age11To18, forParents],
  contributers: [naomi],
  image: afterSchoolMovingOnFromSchoolTraumaImage,
  runningTime: "TBC",
};

export const autisticChildrenWithSchool: CourseMeta = {
  title: "Helping Autistic Children with School",
  tags: [tagAutism, tagSchool, age5To12, age11To18, forParents],
  contributers: [naomi],
  image: autisticChildrenWithSchoolImage,
  runningTime: "TBC",
};

export const myChildIsNotFineAtSchool: CourseMeta = {
  title: "My Child is not Fine at School",
  tags: [tagSchool, tagBurnout, age5To12, age11To18, forParents],
  contributers: [naomi],
  image: myChildIsNotFineAtSchoolImage,
  runningTime: "TBC",
};

export const doWeNeedAnEhcp: CourseMeta = {
  title: "Do we need an EHCP? If we do, what do we do now?",
  tags: [tagEHCP, tagSchool, age5To12, age11To18, forParents],
  contributers: [abi],
  image: doWeNeedAnEhcpImage,
  runningTime: "TBC",
};

export const takingControlOfYourEhcpAnnualReview: CourseMeta = {
  title: "Taking control of your EHCP Annual Review",
  tags: [tagEHCP, tagSchool, age5To12, age11To18, forParents],
  contributers: [abi],
  image: takingControlOfYourEhcpAnnualReviewImage,
  runningTime: "TBC",
};

export const weDontHaveAnEhcpWhatToExpectFromSchool: CourseMeta = {
  title: "We don't have an EHCP - what can we Expect from School?",
  tags: [tagEHCP, tagSchool, age5To12, age11To18, forParents],
  contributers: [abi],
  image: weDontHaveAnEhcpWhatToExpectFromSchoolImage,
  runningTime: "TBC",
};

export const teenagerBurnout101: CourseMeta = {
  title: "Teenager Burnout 101",
  tags: [tagBurnout, age11To18, forTeens],
  contributers: [naomi],
  image: teenagerBurnout101Image,
  runningTime: "TBC",
};

export const whatIsDemandAvoidanceGuideForTeenagers: CourseMeta = {
  title: "What is Demand Avoidance? A Guide for Teenagers",
  tags: [tagDemandAvoidance, age11To18, forTeens],
  contributers: [naomi],
  image: whatIsDemandAvoidanceGuideForTeenagersImage,
  runningTime: "TBC",
};

export const workingWithDemandAvoidantChildrenTherapy: CourseMeta = {
  title: "Working with Demand Avoidant Children: The Art and Science of Low Demand Therapy",
  tags: [tagDemandAvoidance, age5To12, age11To18, forProfessionals],
  contributers: [naomi],
  image: workingWithDemandAvoidantChildrenTherapyImage,
  runningTime: "TBC",
};

export const ALDP1: CourseMeta = {
  title:
    "The Art of Low Demand Parenting: Activate Your Parenting",
  tags: [tagALDP, age5To12, age11To18, forParents],
  contributers: [naomi, eliza],
  image: ALDP1Image,
  runningTime: "TBC",
};

export const ALDP2: CourseMeta = {
  title: "The Art of Low Demand Parenting: Communication",
  tags: [tagALDP, age5To12, age11To18, forParents],
  contributers: [naomi, eliza],
  image: ALDP2Image,
  runningTime: "TBC",
};

export const ALDP3: CourseMeta = {
  title: "The Art of Low Demand Parenting: Behaviour",
  tags: [tagALDP, age5To12, age11To18, forParents],
  contributers: [naomi, eliza],
  image: ALDP3Image,
  runningTime: "TBC",
};

export const ALDP4: CourseMeta = {
  title: "The Art of Low Demand Parenting: Emotions",
  tags: [tagALDP, age5To12, age11To18, forParents],
  contributers: [naomi, eliza],
  image: ALDP4Image,
  runningTime: "TBC",
};

export const ALDP5: CourseMeta = {
  title: "The Art of Low Demand Parenting: The Real World",
  tags: [tagALDP, age5To12, age11To18, forParents],
  contributers: [naomi, eliza],
  image: ALDP5Image,
  runningTime: "TBC",
};

export const ALDP6: CourseMeta = {
  title: "The Art of Low Demand Parenting: Other People",
  tags: [tagALDP, age5To12, age11To18, forParents],
  contributers: [naomi, eliza],
  image: ALDP6Image,
  runningTime: "TBC",
};

export const ALDP7: CourseMeta = {
  title: "The Art of Low Demand Parenting: Screens",
  tags: [tagALDP, tagScreens, age5To12, age11To18, forParents],
  contributers: [naomi, eliza],
  image: ALDP7Image,
  runningTime: "TBC",
};

export const ALDP8: CourseMeta = {
  title: "The Art of Low Demand Parenting: School",
  tags: [tagALDP, tagSchool, age5To12, age11To18, forParents],
  contributers: [naomi, eliza],
  image: ALDP8Image,
  runningTime: "TBC",
};

export const ALDP9: CourseMeta = {
  title: "The Art of Low Demand Parenting: What About The Future?",
  tags: [tagALDP, age5To12, age11To18, forParents],
  contributers: [naomi, eliza],
  image: ALDP9Image,
  runningTime: "TBC",
};

export const ALDP10: CourseMeta = {
  title: "The Art of Low Demand Parenting: What About Me?",
  tags: [tagALDP, age5To12, age11To18, forParents],
  contributers: [naomi, eliza],
  image: ALDP10Image,
  runningTime: "TBC",
};

export const ALDP1To10: CourseMeta = {
  title: "All 10 in the Art of Low Demand Parenting series",
  tags: [tagALDP, tagSchool, tagScreens, age5To12, age11To18, forParents],
  contributers: [naomi, eliza],
  image: ALDP1To10Image,
  runningTime: "TBC",
};

export const ALDP1To5: CourseMeta = {
  title: "First 5 in The Art of Low Demand Parenting series",
  tags: [tagALDP, age5To12, age11To18, forParents],
  contributers: [naomi, eliza],
  image: ALDP1To5Image,
  runningTime: "TBC",
};

export const ALDP6To10: CourseMeta = {
  title: "6-10 in The Art of Low Demand Parenting series",
  tags: [tagALDP, tagSchool, tagScreens, age5To12, age11To18, forParents],
  contributers: [naomi, eliza],
  image: ALDP6To10Image,
  runningTime: "TBC",
};

export const EMDR1: CourseMeta = {
  title: "EMDR Refresher Training - Assessment Phase",
  tags: [tagEMDR, forProfessionals],
  contributers: [naomi],
  image: EMDR1Image,
  runningTime: "TBC",
};

export const EMDR2: CourseMeta = {
  title: "EMDR Refresher Training - Blocked Processing",
  tags: [tagEMDR, forProfessionals],
  contributers: [naomi],
  image: EMDR2Image,
  runningTime: "TBC",
};

export const EMDR3: CourseMeta = {
  title: "EMDR Refresher Training - Cognitive Interweaves",
  tags: [tagEMDR, forProfessionals],
  contributers: [naomi],
  image: EMDR3Image,
  runningTime: "TBC",
};

export const EMDR4: CourseMeta = {
  title: "EMDR Refresher Training - Preparation Phase",
  tags: [tagEMDR, forProfessionals],
  contributers: [naomi],
  image: EMDR4Image,
  runningTime: "TBC",
};

export const EMDR5: CourseMeta = {
  title: "EMDR Refresher Training - Desensitisation Phase",
  tags: [tagEMDR, forProfessionals],
  contributers: [naomi],
  image: EMDR5Image,
  runningTime: "TBC",
};

export const EMDR6: CourseMeta = {
  title: "EMDR Refresher Training - Phases 5-8",
  tags: [tagEMDR, forProfessionals],
  contributers: [naomi],
  image: EMDR6Image,
  runningTime: "TBC",
};

export const EMDR1To6: CourseMeta = {
  title: "EMDR Refresher Training Bundle - All 6 mini courses",
  tags: [tagEMDR, forProfessionals],
  contributers: [naomi],
  image: EMDR1To6Image,
  runningTime: "TBC",
};

// !! ADD NEW COURSES HERE !!
const allCourses = [
  demandAvoidance101,
  neurodiversity101,
  autisticChildScreens,
  autisticTeenWithAnxiety,
  autisticChildWithAnxiety,
  childWithAnxietyUnder8s,
  autisticChildWithTrauma,
  demandAvoidantAdolescent,
  childWithAnxiety6To13,
  childWithSevereAnxiety,
  burntOutBySchool,
  afterSchoolMovingOnFromSchoolTrauma,
  autisticChildrenWithSchool,
  myChildIsNotFineAtSchool,
  doWeNeedAnEhcp,
  takingControlOfYourEhcpAnnualReview,
  weDontHaveAnEhcpWhatToExpectFromSchool,
  teenagerBurnout101,
  whatIsDemandAvoidanceGuideForTeenagers,
  workingWithDemandAvoidantChildrenTherapy,
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
  ALDP1To10,
  ALDP1To5,
  ALDP6To10,
  EMDR1,
  EMDR2,
  EMDR3,
  EMDR4,
  EMDR5,
  EMDR6,
  EMDR1To6,
];

// !! ADD RELATED COURSES HERE !!
demandAvoidance101.relatedTitles = [
  demandAvoidantAdolescent.title,
  neurodiversity101.title,
];
neurodiversity101.relatedTitles = [demandAvoidance101.title];
demandAvoidantAdolescent.relatedTitles = [demandAvoidance101.title];
autisticTeenWithAnxiety.relatedTitles = [autisticChildWithAnxiety.title];
autisticChildWithAnxiety.relatedTitles = [autisticTeenWithAnxiety.title];
autisticTeenWithAnxiety.relatedTitles = [autisticChildWithAnxiety.title];


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
