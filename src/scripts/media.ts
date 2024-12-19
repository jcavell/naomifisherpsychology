import { eliza, naomi } from "./people.ts";
import {
  tagALDP,
  tagDemandAvoidance,
  tagMentalHealth,
  tagSchool,
  tagScreens,
} from "./tags.ts";
import defaultImage from "../images/static/1080w/nf-oxford.webp";
import elizaAndNaomiImage from "../images/static/1080w/eliza-and-naomi-books.webp";
import eggsImage from "../images/media/eggs.avif";
import naomiStandingByWallImage from "../images/static/naomi-standing-by-brightly-coloured-wall-2.png";
import schoolsOutImage from "../images/media/schools-out.webp";
import childrenAtDesksImage from "../images/media/children-at-desks.jpg";
import therapyImage from "../images/media/therapy.jpg";
import justOneThing from "../images/media/just-one-thing.webp";

export enum MediaType {
  PODCAST = "Podcast",
  ARTICLE = "Article",
}
export type Media = {
  title: string;
  subtitle: string;
  description: string;
  publication: string;
  image: ImageMetadata;
  imageAlt: string;
  date: Date;
  type: MediaType;
  url: string;
  contributors: string[];
  tags: string[];
};

const iNewsDontPunishBadBehaviour: Media = {
  title:
    "I’m a child psychologist – why parents shouldn’t punish bad behaviour",
  subtitle:
    "Sticker charts and 'the naughty step' are about controlling children's behaviour - try reducing the pressure on them instead",
  description:
    "In this article for I News Naomi discusses why sticker charts and 'the naughty step' are about controlling children's behaviour - try reducing the pressure on them instead.",
  publication: "iNews",
  image: defaultImage,
  imageAlt: "Dr Naomi Fisher",
  date: new Date("2024-11-12"),
  type: MediaType.ARTICLE,
  url: "https://inews.co.uk/inews-lifestyle/child-psychologist-punish-bad-behaviour-3373814",
  contributors: [naomi],
  tags: [tagALDP, tagDemandAvoidance],
};

const sendParentingWhenTheNaughtyStep: Media = {
  title:
    "Challenging Traditional Parenting: Low Demand Strategies for Neurodivergent Children",
  subtitle: "",
  description:
    'What if traditional parenting methods are doing more harm than good? Join us as we welcome Dr. Naomi Fisher and Eliza Fricker, co-authors of the enlightening new book "When the Naughty Step Makes Things Worse," to challenge popular parenting wisdom. ',
  publication: "Send Parenting",
  image: elizaAndNaomiImage,
  imageAlt: "Eliza and Naomi with books",
  date: new Date("2024-11-12"),
  type: MediaType.PODCAST,
  url: "https://sendparenting.com/episodes/when-the-naughty-step",
  contributors: [naomi, eliza],
  tags: [tagALDP],
};

const letKidsSleepInTheirClothes: Media = {
  title: "Have breakfast for dinner, let kids sleep in their clothes",
  subtitle:
    "Feeling frazzled and drained at the end of the day? Try these expert micro-habits",
  description:
    "Play a video game with your teen. Yes, even if they’ve not done their homework. Teens come alive in the evenings, so schedule time to play a video game or do something fun together to help to build a long-lasting connection.",
  publication: "The Guardian",
  image: eggsImage,
  imageAlt: "Plate with just an egg",
  date: new Date("2024-11-15"),
  type: MediaType.ARTICLE,
  url: "https://www.theguardian.com/lifeandstyle/2024/nov/15/14-easy-tips-for-better-evenings",
  contributors: [naomi],
  tags: [tagALDP],
};

const mentalHealthBook: Media = {
  title: "The ever-changing psychology of mental health",
  subtitle:
    "Clinical Psychologist Dr Naomi Fisher with a theme from her new book",
  description:
    "A couple of years ago, I noticed something new in the reports I was reading about the adolescents I worked with. 'As part of her ADHD, Amelia also has RSD', a typical report might say. Or 'Bethan's RSD makes it hard for her to establish friendships and she is socially isolated'.",
  publication: "The Psychologist",
  image: naomiStandingByWallImage,
  imageAlt: "Naomi standing by a wall in Brighton",
  date: new Date("2024-07-23"),
  type: MediaType.ARTICLE,
  url: "https://www.bps.org.uk/psychologist/ever-changing-psychology-mental-health",
  contributors: [naomi],
  tags: [tagMentalHealth],
};

const schoolsOut: Media = {
  title: "School’s out…",
  subtitle: "",
  description:
    "Naomi Fisher considers the arguments for self-directed education.",
  publication: "The Psychologist",
  image: schoolsOutImage,
  imageAlt: "Children playing",
  date: new Date("2020-02-03"),
  type: MediaType.ARTICLE,
  url: "https://www.bps.org.uk/psychologist/schools-out",
  contributors: [naomi],
  tags: [tagSchool],
};

const howAndWhy: Media = {
  title: "The ‘how’ and ‘why’ of the classroom",
  subtitle: "",
  description:
    "Naomi Fisher questions government proclamations in favour of a ‘traditional’ learning environment.",
  publication: "The Psychologist",
  image: childrenAtDesksImage,
  imageAlt: "Children sitting at desks",
  date: new Date("2021-03-10"),
  type: MediaType.ARTICLE,
  url: "https://www.bps.org.uk/psychologist/how-and-why-classroom",
  contributors: [naomi],
  tags: [tagSchool],
};

const buildingHealthyDigitalRelationships: Media = {
  title: "Building Healthy Digital Relationships with Your Kids",
  subtitle: "",
  description:
    "In this episode of the podcast Just One Thing For Parents, we tackle the question of how parents can help their children develop a healthy relationship with screens.",
  publication: "Just One Thing For Parents",
  image: justOneThing,
  imageAlt: "Just One Thing logo with lightbulb",
  date: new Date("2024-11-08"),
  type: MediaType.PODCAST,
  url: "https://podcasts.apple.com/gb/podcast/episode-23-building-healthy-digital-relationships-with/id1721175343?i=1000676205634",
  contributors: [naomi],
  tags: [tagScreens, tagALDP],
};

const sideEffectsOfSchool: Media = {
  title: "The Side Effects of School",
  subtitle: "A Crisis in Mental Health Can’t Be Solved Through Therapy",
  description:
    "We’re facing a crisis in young people’s mental health.  Every day I get emails from several parents, asking if I can help their children.  They tell me how distressed their children are, how they are harming themselves and how they don’t know how to help.  There are so many that I can’t see most of them.",
  publication: "Progressive Education",
  image: therapyImage,
  imageAlt: "Man and teenager talking in therapy",
  date: new Date("2024-04-09"),
  type: MediaType.ARTICLE,
  url: "https://www.progressiveeducation.org/the-side-effects-of-school-a-crisis-in-mental-health-cant-be-solved-through-therapy-by-dr-naomi-fisher/",
  contributors: [naomi],
  tags: [tagSchool, tagMentalHealth],
};

export const allMedia = [
  iNewsDontPunishBadBehaviour,
  sendParentingWhenTheNaughtyStep,
  letKidsSleepInTheirClothes,
  buildingHealthyDigitalRelationships,
  mentalHealthBook,
  sideEffectsOfSchool,
  howAndWhy,
  schoolsOut,
];
