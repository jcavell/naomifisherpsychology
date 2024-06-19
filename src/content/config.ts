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

const courseQuotesCollection = defineCollection({
  type: "content",
  schema: z.array(
    z.object({
      text: z.string(),
      author: z.string().optional(),
      title: z.string().optional(),
    })
  ),
});

const booksCollection = defineCollection({
  type: "content",
  schema: z.object({
    id: z.number(),
    uri: z.string(),
    title: z.string(),
    subtitle: z.string(),
    description: z.string(),
    summary: z.string(),
    publisher: z.string(),
    pubDate: z.string(),
    rrp: z.string(),
    paperbackIsbn: z.string(),
    ebookIsbn: z.string(),
    audiobookIsbn: z.string(),
    pages: z.number(),
    amazonUrl: z.string(),
    amazonSampleUrl: z.string(),
    amazonPrice: z.string(),
    audibleUrl: z.string(),
    audiblePrice: z.string(),
    kindleUrl: z.string(),
    kindlePrice: z.string(),
    googleUrl: z.string(),
    googleSampleUrl: z.string(),
    googlePrice: z.string(),
    people: z.array(z.string()),
    tags: z.array(z.string()),
    toc: z.array(z.string()),
    audiobookLength: z.string(),
    dimensions: z.string(),
    blackwellUrl: z.string(),
    blackwellPrice: z.string(),
    waterstonesUrl: z.string(),
    waterstonesPrice: z.string(),
    appleBooksUrl: z.string(),
    appleBooksPrice: z.string(),
    koboUrl: z.string(),
    koboPrice: z.string(),
    ebooksUrl: z.string(),
    ebooksPrice: z.string(),
    koboAudiobookUrl: z.string(),
    koboAudiobookPrice: z.string(),
    psychologicalTherapiesUrl: z.string(),
    psychologicalTherapiesPrice: z.string(),
    xigxagAudiobookUrl: z.string(),
    xigxagAudiobookPrice: z.string(),
    vimeoEmbedUrl: z.string(),
    excerptUrl: z.string(),
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
    imageFileName: z.string(),
    description: z.string(),
    price: z.string(),
    checkoutUrl: z.string(),
    checkout: courseCheckoutsSchema.optional(),
    people: z.string().array().optional(),
    tags: z.string().array().optional(),
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
  books: booksCollection,
  // coursequotes: courseQuotesCollection,
};
