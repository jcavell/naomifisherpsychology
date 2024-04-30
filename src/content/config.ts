// Import utilities from `astro:content`
import { z, defineCollection } from "astro:content";
// Define a `type` and `schema` for each collection

const peopleCollection = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    image: z.object({
      url: z.string(),
      alt: z.string(),
    }),
    tags: z.array(z.string()),
  }),
});

const courseCheckoutsSchema = z.object({
  type: z.string(),
  url: z.string(),
  descriptions: z.string().array(),
  testimonials: z.string().array(),
});

const courseCardsCollection = defineCollection({
  type: "data",
  schema: z.object({
    type: z.string(),
    categoryUrl: z.string(),
    categoryPosition: z.number(),
    title: z.string(),
    imageURL: z.string(),
    description: z.string(),
    price: z.string(),
    checkoutUrl: z.string(),
    checkout: courseCheckoutsSchema.optional(),
    people: z.string().array().optional(),
    tags: z.string().array().optional()
  }),
});

const courseCheckoutsCollection = defineCollection({
  type: "data",
  schema: courseCheckoutsSchema,
});

// Export a single `collections` object to register your collection(s)
export const collections = {
  people: peopleCollection,
  courseCards: courseCardsCollection,
  courseCheckouts: courseCheckoutsCollection,
};
