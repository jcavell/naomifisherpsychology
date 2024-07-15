import {
  agePrimary,
  ageSecondary,
  ageTween,
  tagTrauma,
  tagSEN,
  forParents,
  tagAnxiety,
  tagAutism,
  tagScreens,
  tagALDP,
} from "./tags";

import { naomi, abi, eliza } from "./people";

// Webinar Images
import testImage from "../images/courses/test.jpeg";
import testImage2 from "../images/courses/test2.jpeg";

import aldpHolidaysImage from "../images/courses/ALDP-Holidays.png";
import autisticChildOCDImage from "../images/courses/helping-your-autistic-child-with-ocd.png";
import aldpScreensImage from "../images/courses/ALDP-7.png";

type WebinarMeta = {
  id: string;
  tags: string[];
  contributers: string[];
  image?: ImageMetadata;
};

export const webinar_helping_your_child_recover_from_trauma_and_loss: WebinarMeta =
  {
    id: "909728952787",
    tags: [tagTrauma, agePrimary, forParents],
    contributers: [naomi],
    image: testImage,
  };

const webinar_nagivating_the_sen_tribunal_process: WebinarMeta = {
  id: "911308828237",
  tags: [tagSEN, forParents],
  contributers: [abi],
  image: testImage2,
};

const webinar_Helping_Your_Child_with_Learning_Disabilities_with_Anxiety: WebinarMeta =
  {
    id: "912635556517",
    tags: [tagAnxiety, tagSEN, forParents],
    contributers: [naomi],
  };

const webinar_Helping_Your_Autistic_Child_Develop_a_Healthy_Relationship_with_Screens: WebinarMeta =
  {
    id: "922751934877",
    tags: [tagScreens, tagAutism,   agePrimary, ageTween, forParents],
    contributers: [naomi],
  };

  const webinar_aldp_holidays: WebinarMeta = {
    id: "933220877767",
    tags: [tagALDP, agePrimary, ageSecondary, forParents],
    contributers: [naomi, eliza],
    image: aldpHolidaysImage
  };

   const helping_your_autistic_child_with_ocd: WebinarMeta = {
     id: "934324007257",
     tags: [tagAutism, tagAnxiety, agePrimary, ageTween, forParents],
     contributers: [naomi],
     image: autisticChildOCDImage,
   };

      const aldp_screens: WebinarMeta = {
        id: "943055974807",
        tags: [tagALDP, tagScreens, agePrimary, ageSecondary, forParents],
        contributers: [naomi, eliza],
        image: aldpScreensImage,
      };


// !! ADD WEBINAR HERE !!
export function getWebinarMeta(eventId: string): WebinarMeta | undefined {
  return [
    webinar_helping_your_child_recover_from_trauma_and_loss,
    webinar_nagivating_the_sen_tribunal_process,
    webinar_Helping_Your_Child_with_Learning_Disabilities_with_Anxiety,
    webinar_Helping_Your_Autistic_Child_Develop_a_Healthy_Relationship_with_Screens,
    webinar_aldp_holidays,
    helping_your_autistic_child_with_ocd,
    aldp_screens
  ].find((webMeta) => eventId === webMeta.id);
}
