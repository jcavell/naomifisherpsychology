import {
  age5To12,
  age13To18,
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
} from "./tags";

import { compiledContent as age5To12Content } from "../content/tags/age-5-12.md";
import { compiledContent as age13To18Content } from "../content/tags/anxiety.md";
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

// Tag Images
import testImage from "../images/tags/test-tag-image.jpg";

type TagMeta = {
  tag: string;
  description: string;
  image: ImageMetadata;
};

const age5To12Meta: TagMeta = {
  tag: age5To12,
  image: testImage,
  description: age5To12Content(),
};

const age13To18Meta: TagMeta = {
  tag: age13To18,
  image: testImage,
  description: age13To18Content(),
};

const anxietyMeta: TagMeta = {
  tag: tagAnxiety,
  image: testImage,
  description: anxietyContent(),
};

const autismMeta: TagMeta = {
  tag: tagAutism,
  image: testImage,
  description: autismContent(),
};

const burnoutMeta: TagMeta = {
  tag: tagBurnout,
  image: testImage,
  description: burnoutContent(),
};

const demandAvoidanceMeta: TagMeta = {
  tag: tagDemandAvoidance,
  image: testImage,
  description: demandAvoidanceContent(),
};

const ehcpMeta: TagMeta = {
  tag: tagEHCPs,
  image: testImage,
  description: ehcpContent(),
};

const emdrMeta: TagMeta = {
  tag: tagEMDR,
  image: testImage,
  description: emdrContent(),
};

const forParentsMeta: TagMeta = {
  tag: forParents,
  image: testImage,
  description: forParentsContent(),
};

const forProfessionalsMeta: TagMeta = {
  tag: forProfessionals,
  image: testImage,
  description: forProfessionalsContent(),
};

const forTeensMeta: TagMeta = {
  tag: forTeens,
  image: testImage,
  description: forTeensContent(),
};

const aldpMeta: TagMeta = {
  tag: tagALDP,
  image: testImage,
  description: aldpContent(),
};

const schoolMeta: TagMeta = {
  tag: tagSchool,
  image: testImage,
  description: schoolContent(),
};

const screensMeta: TagMeta = {
  tag: tagScreens,
  image: testImage,
  description: screensContent(),
};

const senMeta: TagMeta = {
  tag: tagSEN,
  image: testImage,
  description: senContent(),
};

const traumaMeta: TagMeta = {
  tag: tagTrauma,
  image: testImage,
  description: traumaContent(),
};

const aggressionMeta: TagMeta = {
  tag: tagAggression,
  image: testImage,
  description: aggressionContent(),
};

const neurodiversityMeta: TagMeta = {
  tag: tagNeurodiversity,
  image: testImage,
  description: neurodiversityContent(),
};

const adhdMeta: TagMeta = {
  tag: tagADHD,
  image: testImage,
  description: adhdContent(),
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
];

export function getTagMeta(tag: string): TagMeta | undefined {
  return tagsMeta.find((tagMeta) => tag === tagMeta.tag);
}
