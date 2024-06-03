import { age5To12, tagTrauma, tagSEN, forParents, tagAnxiety } from "./tags";

import { naomi, abi } from "./people";

// Webinar Images
import testImage from "../images/courses/test.jpeg";
import testImage2 from "../images/courses/test2.jpeg";

type WebinarMeta = {
  id: string;
  tags: string[];
  contributers: string[];
  image?: ImageMetadata;
};

export const webinar_helping_your_child_recover_from_trauma_and_loss: WebinarMeta =
  {
    id: "909728952787",
    tags: [tagTrauma, age5To12, forParents],
    contributers: [naomi],
    image: testImage,
  };

const webinar_nagivating_the_sen_tribuanl_process: WebinarMeta = {
  id: "911308828237",
  tags: [tagSEN, forParents],
  contributers: [abi],
  image: testImage2,
};

const webinar_helping_your_child_with_learning_disabilities_with_anxiety: WebinarMeta =
  {
    id: "912635556517",
    tags: [tagAnxiety, tagSEN, forParents],
    contributers: [naomi],
  };

export function getWebinarMeta(eventId: string): WebinarMeta | undefined {
  return [
    webinar_helping_your_child_recover_from_trauma_and_loss,
    webinar_nagivating_the_sen_tribuanl_process,
    webinar_helping_your_child_with_learning_disabilities_with_anxiety,
  ].find((webMeta) => eventId === webMeta.id);
}
