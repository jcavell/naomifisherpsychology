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

import { marked } from 'marked';

// Import raw markdown files
import age5To12Md from '../content/tags/age-5-12.md?raw';
import age13To18Md from '../content/tags/age-13-18.md?raw';
import anxietyMd from '../content/tags/anxiety.md?raw';
import autismMd from '../content/tags/mental-health.md?raw';
import burnoutMd from '../content/tags/burnout.md?raw';
import demandAvoidanceMd from '../content/tags/demand-avoidance.md?raw';
import ehcpMd from '../content/tags/ehcps.md?raw';
import emdrMd from '../content/tags/emdr.md?raw';
import forParentsMd from '../content/tags/for-parents.md?raw';
import forTeensMd from '../content/tags/for-teenagers.md?raw';
import forProfessionalsMd from '../content/tags/for-professionals.md?raw';
import aldpMd from '../content/tags/aldp.md?raw';
import schoolMd from '../content/tags/school.md?raw';
import screensMd from '../content/tags/screens.md?raw';
import senMd from '../content/tags/sen.md?raw';
import adhdMd from '../content/tags/adhd.md?raw';
import aggressionMd from '../content/tags/aggression.md?raw';
import neurodiversityMd from '../content/tags/neurodiversity.md?raw';
import traumaMd from '../content/tags/trauma.md?raw';
import mentalHealthMd from '../content/tags/mental-health.md?raw';

// Parse markdown content
const age5To12Content = marked.parse(age5To12Md) as string;
const age13To18Content = marked.parse(age13To18Md) as string;
const anxietyContent = marked.parse(anxietyMd) as string;
const autismContent = marked.parse(autismMd) as string;
const burnoutContent = marked.parse(burnoutMd) as string;
const demandAvoidanceContent = marked.parse(demandAvoidanceMd) as string;
const ehcpContent = marked.parse(ehcpMd) as string;
const emdrContent = marked.parse(emdrMd) as string;
const forParentsContent = marked.parse(forParentsMd) as string;
const forTeensContent = marked.parse(forTeensMd) as string;
const forProfessionalsContent = marked.parse(forProfessionalsMd) as string;
const aldpContent = marked.parse(aldpMd) as string;
const schoolContent = marked.parse(schoolMd) as string;
const screensContent = marked.parse(screensMd) as string;
const senContent = marked.parse(senMd) as string;
const adhdContent = marked.parse(adhdMd) as string;
const aggressionContent = marked.parse(aggressionMd) as string;
const neurodiversityContent = marked.parse(neurodiversityMd) as string;
const traumaContent = marked.parse(traumaMd) as string;
const mentalHealthContent = marked.parse(mentalHealthMd) as string;

// Tag Images
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
import tagMentalHealthImage from "../images/tags/mental-health.png";

export function splitContentByPTags(compiledContent: string): string[] {
  // Use a regular expression to split the content on `<p>` tags
  return compiledContent
    .split(/<\/?p>/)
    .map((paragraph) => paragraph.trim())
    .filter((paragraph) => paragraph !== "");
}

type TagMeta = {
  tag: string;
  description: string;
  image: ImageMetadata;
  substackURLs?: string[];
};

const mentalHealthMeta: TagMeta = {
  tag: tagMentalHealth,
  image: tagMentalHealthImage,
  description: mentalHealthContent,
  substackURLs: [
    "https://naomicfisher.substack.com/p/depression-or-burnout",
    "https://naomicfisher.substack.com/p/the-soft-bigotry-of-low-expectations",
    "https://naomicfisher.substack.com/p/mental-health-awareness",
    "https://naomicfisher.substack.com/p/getting-it-right",
    "https://naomicfisher.substack.com/p/behaviour-is-part-of-a-complex-system",
    "https://naomicfisher.substack.com/p/looking-for-a-way-to-improve-teenage",
    "https://naomicfisher.substack.com/p/what-is-behaviour-anyway",
    "https://naomicfisher.substack.com/p/no-excuses",
    "https://naomicfisher.substack.com/p/mum-is-anxious",
    "https://naomicfisher.substack.com/p/you-better-watch-out",
    "https://naomicfisher.substack.com/p/my-house-is-burning-down",
    "https://naomicfisher.substack.com/p/make-better-choices",
  ],
};

const schoolMeta: TagMeta = {
  tag: tagSchool,
  image: tagSchoolImage,
  description: schoolContent,
  substackURLs: [
    "https://naomicfisher.substack.com/p/they-just-dont-care",
    "https://naomicfisher.substack.com/p/less-than-90",
    "https://naomicfisher.substack.com/p/is-he-behind",
    "https://naomicfisher.substack.com/p/why-arent-they-in-school",
    "https://naomicfisher.substack.com/p/why-do-we-do-what-we-do",
    "https://naomicfisher.substack.com/p/under-pressure",
    "https://naomicfisher.substack.com/p/what-about-english-and-maths",
    "https://naomicfisher.substack.com/p/hope",
    "https://naomicfisher.substack.com/p/if-your-behaviour-doesnt-improve",
    "https://naomicfisher.substack.com/p/and-the-winner-is",
    "https://naomicfisher.substack.com/p/the-gem-jar",
    "https://naomicfisher.substack.com/p/five-things-all-young-people-and",
    "https://naomicfisher.substack.com/p/wheres-the-balance",
    "https://naomicfisher.substack.com/p/do-children-fail-school-or-do-schools",
    "https://naomicfisher.substack.com/p/is-this-on-the-test",
    "https://naomicfisher.substack.com/p/but-how-will-they-learn-social-skills",
    "https://naomicfisher.substack.com/p/dont-you-worry-theyll-have-gaps",
    "https://naomicfisher.substack.com/p/are-they-behind",
    "https://naomicfisher.substack.com/p/the-special-unit",
    "https://naomicfisher.substack.com/p/youre-making-it-worse",
    "https://naomicfisher.substack.com/p/show-me-the-evidence",
    "https://naomicfisher.substack.com/p/does-it-matter-how-young-people-feel",
    "https://naomicfisher.substack.com/p/i-cant",
  ],
};

const anxietyMeta: TagMeta = {
  tag: tagAnxiety,
  image: tagAnxietyImage,
  description: anxietyContent,
  substackURLs: [
    "https://naomicfisher.substack.com/p/mum-is-anxious",
    "https://naomicfisher.substack.com/p/you-better-watch-out",
    "https://naomicfisher.substack.com/p/hemmed-in-by-our-feelings",
    "https://naomicfisher.substack.com/p/not-now-its-for-later",
    "https://naomicfisher.substack.com/p/stepping-back-to-school",
    "https://naomicfisher.substack.com/p/will-it-make-my-childs-separation",
  ],
};

const demandAvoidanceMeta: TagMeta = {
  tag: tagDemandAvoidance,
  image: tagDemandAvoidanceImage,
  description: demandAvoidanceContent,
  substackURLs: [
    "https://naomicfisher.substack.com/p/its-not-what-you-say-its-the-way",
    "https://naomicfisher.substack.com/p/being-able-to-say-no-allows-children",
    "https://naomicfisher.substack.com/p/a-bit-strict",
    "https://naomicfisher.substack.com/p/the-right-to-refuse",
    "https://naomicfisher.substack.com/p/the-art-of-quitting",
    "https://naomicfisher.substack.com/p/not-saying-no",
    "https://naomicfisher.substack.com/p/too-much-for-me",
    "https://naomicfisher.substack.com/p/why-wont-they-open-their-gifts",
  ],
};

const autismMeta: TagMeta = {
  tag: tagAutism,
  image: tagAutismImage,
  description: autismContent,
  substackURLs: [
    "https://naomicfisher.substack.com/p/why-i-dont-tell-children-they-have",
    "https://naomicfisher.substack.com/p/behind-the-mask",
    "https://naomicfisher.substack.com/p/why-being-autistic-is-nothing-like",
    "https://naomicfisher.substack.com/p/getting-it-right",
    "https://naomicfisher.substack.com/p/why-i-dont-tell-children-that-the",
    "https://naomicfisher.substack.com/p/creating-a-life",
    "https://naomicfisher.substack.com/p/does-exposure-therapy-work-for-autistic",
  ],
};

const burnoutMeta: TagMeta = {
  tag: tagBurnout,
  image: tagBurnoutImage,
  description: burnoutContent,
};

const screensMeta: TagMeta = {
  tag: tagScreens,
  image: tagScreensImage,
  description: screensContent,
  substackURLs: ["https://naomicfisher.substack.com/p/screens-screens-screens"],
};

const traumaMeta: TagMeta = {
  tag: tagTrauma,
  image: tagTraumaImage,
  description: traumaContent,
  substackURLs: ["https://naomicfisher.substack.com/p/learning-to-feel-safe"],
};

const age5To12Meta: TagMeta = {
  tag: age5To11,
  image: age5To12Image,
  description: age5To12Content,
};

const age13To18Meta: TagMeta = {
  tag: age11To19,
  image: age13To18Image,
  description: age13To18Content,
};

const ehcpMeta: TagMeta = {
  tag: tagEHCPs,
  image: tagEHCPImage,
  description: ehcpContent,
};

const emdrMeta: TagMeta = {
  tag: tagEMDR,
  image: tagEMDRImage,
  description: emdrContent,
};

const forParentsMeta: TagMeta = {
  tag: forParents,
  image: forParentsImage,
  description: forParentsContent,
};

const forProfessionalsMeta: TagMeta = {
  tag: forProfessionals,
  image: forProfessionalsImage,
  description: forProfessionalsContent,
};

const forTeensMeta: TagMeta = {
  tag: forTeens,
  image: forTeensImage,
  description: forTeensContent,
};

const aldpMeta: TagMeta = {
  tag: tagALDP,
  image: tagALDPImage,
  description: aldpContent,
};

const senMeta: TagMeta = {
  tag: tagSEN,
  image: tagSenImage,
  description: senContent,
};

const aggressionMeta: TagMeta = {
  tag: tagAggression,
  image: tagMentalHealth,
  description: aggressionContent,
};

const neurodiversityMeta: TagMeta = {
  tag: tagNeurodiversity,
  image: tagNeurodiversityImage,
  description: neurodiversityContent,
};

const adhdMeta: TagMeta = {
  tag: tagADHD,
  image: tagMentalHealth,
  description: adhdContent,
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