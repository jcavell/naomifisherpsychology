import {
  age5To11,
  age11To19,
  tagTrauma,
  tagSEN,
  forParents,
  tagAnxiety,
  tagAutism,
  tagScreens,
  tagALDP,
  tagEHCPs,
  tagSchool,
  tagNeurodiversity,
  tagADHD,
  tagAggression,
  tagBurnout,
  tagDemandAvoidance,
  tagEMDR,
  forProfessionals,
  forTeens,
  tagMentalHealth,
} from "./tags";

import { compiledContent as age5To12Content } from "../content/tags/age-5-12.md";
import { compiledContent as age13To18Content } from "../content/tags/age-13-18.md";
import { compiledContent as anxietyContent } from "../content/tags/anxiety.md";
import { compiledContent as autismContent } from "../content/tags/autism.md";
import { compiledContent as burnoutContent } from "../content/tags/burnout.md";
import { compiledContent as demandAvoidanceContent } from "../content/tags/demand-avoidance.md";
import { compiledContent as ehcpContent } from "../content/tags/ehcps.md";
import { compiledContent as emdrContent } from "../content/tags/emdr.md";
import { compiledContent as forParentsContent } from "../content/tags/for-parents.md";
import { compiledContent as forTeensContent } from "../content/tags/for-teenagers.md";
import { compiledContent as forProfessionalsContent } from "../content/tags/for-professionals.md";
import { compiledContent as aldpContent } from "../content/tags/aldp.md";
import { compiledContent as schoolContent } from "../content/tags/school.md";
import { compiledContent as screensContent } from "../content/tags/screens.md";
import { compiledContent as senContent } from "../content/tags/sen.md";
import { compiledContent as adhdContent } from "../content/tags/adhd.md";
import { compiledContent as aggressionContent } from "../content/tags/aggression.md";
import { compiledContent as neurodiversityContent } from "../content/tags/neurodiversity.md";
import { compiledContent as traumaContent } from "../content/tags/trauma.md";
import { compiledContent as mentalHealthContent } from "../content/tags/mental-health.md";

// Tag Images
import testImage from "../images/tags/test-tag-image.jpg";
import age5To12Image from "../images/tags/age-5-12.png";
import age13To18Image from "../images/tags/age-13-18.png";
import tagEMDRImage from "../images/tags/emdr-logs-on-a-river.png";
import tagAnxietyImage from "../images/tags/tag-anxiety.png";
import tagAutismImage from "../images/tags/tag-autism.png";
import tagBurnoutImage from "../images/tags/tag-burnout.png";
import tagEHCPImage from "../images/tags/tag-ehcp.png";
import forParentsImage from "../images/tags/for-parents.png";
import forTeensImage from "../images/tags/for-teens.png";
import forProfessionalsImage from "../images/tags/emdr-sounds-interesting.png";
import tagTraumaImage from "../images/tags/tag-trauma.png";
import tagNeurodiversityImage from "../images/tags/tag-neurodiversity.png";
import tagSenImage from "../images/tags/tag-sen.png";
import tagSchoolImage from "../images/tags/tag-school.png";
import tagScreensImage from "../images/tags/tag-screens.png";
import tagALDPImage from "../images/courses/ALDP-1-10.webp";
import tagDemandAvoidanceImage from "../images/tags/tag-demand-avoidance.png";
import tagMentalHealthImage from "../images/tags/mental-health.jpg";

type TagMeta = {
  tag: string;
  description: string;
  image: ImageMetadata;
};

const age5To12Meta: TagMeta = {
  tag: age5To11,
  image: age5To12Image,
  description: age5To12Content(),
};

const age13To18Meta: TagMeta = {
  tag: age11To19,
  image: age13To18Image,
  description: age13To18Content(),
};

const anxietyMeta: TagMeta = {
  tag: tagAnxiety,
  image: tagAnxietyImage,
  description: anxietyContent(),
};

const autismMeta: TagMeta = {
  tag: tagAutism,
  image: tagAutismImage,
  description: autismContent(),
};

const burnoutMeta: TagMeta = {
  tag: tagBurnout,
  image: tagBurnoutImage,
  description: burnoutContent(),
};

const demandAvoidanceMeta: TagMeta = {
  tag: tagDemandAvoidance,
  image: tagDemandAvoidanceImage,
  description: demandAvoidanceContent(),
};

const ehcpMeta: TagMeta = {
  tag: tagEHCPs,
  image: tagEHCPImage,
  description: ehcpContent(),
};

const emdrMeta: TagMeta = {
  tag: tagEMDR,
  image: tagEMDRImage,
  description: emdrContent(),
};

const forParentsMeta: TagMeta = {
  tag: forParents,
  image: forParentsImage,
  description: forParentsContent(),
};

const forProfessionalsMeta: TagMeta = {
  tag: forProfessionals,
  image: forProfessionalsImage,
  description: forProfessionalsContent(),
};

const forTeensMeta: TagMeta = {
  tag: forTeens,
  image: forTeensImage,
  description: forTeensContent(),
};

const aldpMeta: TagMeta = {
  tag: tagALDP,
  image: tagALDPImage,
  description: aldpContent(),
};

const schoolMeta: TagMeta = {
  tag: tagSchool,
  image: tagSchoolImage,
  description: schoolContent(),
};

const screensMeta: TagMeta = {
  tag: tagScreens,
  image: tagScreensImage,
  description: screensContent(),
};

const senMeta: TagMeta = {
  tag: tagSEN,
  image: tagSenImage,
  description: senContent(),
};

const traumaMeta: TagMeta = {
  tag: tagTrauma,
  image: tagTraumaImage,
  description: traumaContent(),
};

const aggressionMeta: TagMeta = {
  tag: tagAggression,
  image: testImage,
  description: aggressionContent(),
};

const neurodiversityMeta: TagMeta = {
  tag: tagNeurodiversity,
  image: tagNeurodiversityImage,
  description: neurodiversityContent(),
};

const adhdMeta: TagMeta = {
  tag: tagADHD,
  image: testImage,
  description: adhdContent(),
};

const mentalHealthMeta: TagMeta = {
  tag: tagMentalHealth,
  image: tagMentalHealthImage,
  description: mentalHealthContent(),
};

// !! ADD TAGS HERE !!
const tagsMeta = [
  age5To12Meta,
  age13To18Meta,
  aldpMeta,
  anxietyMeta,
  autismMeta,
  burnoutMeta,
  demandAvoidanceMeta,
  ehcpMeta,
  emdrMeta,
  forParentsMeta,
  forProfessionalsMeta,
  forTeensMeta,
  schoolMeta,
  screensMeta,
  senMeta,
  traumaMeta,
  adhdMeta,
  aggressionMeta,
  neurodiversityMeta,
  mentalHealthMeta,
];

export function getTagMeta(tag: string): TagMeta | undefined {
  return tagsMeta.find((tagMeta) => tag === tagMeta.tag);
}
