import { eliza, naomi } from "./people.ts";
import { tagALDP, tagDemandAvoidance } from "./tags.ts";
import defaultImage from "../images/static/1080w/nf-oxford.webp";
import elizaAndNaomiImage from "../images/static/1080w/eliza-and-naomi-books.webp";

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

export const allMedia = [
  iNewsDontPunishBadBehaviour,
  sendParentingWhenTheNaughtyStep,
];
