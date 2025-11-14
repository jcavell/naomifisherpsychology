// Import utilities from `astro:content`
import { z, defineCollection } from "astro:content";
import type { CourseMeta } from "./scripts/courseMeta.ts";
import { glob } from 'astro/loaders';

// People Schema
const PeopleSchema = z.object({
  title: z.string(),
  image: z.object({
    url: z.string(),
    alt: z.string(),
  }),
  tags: z.array(z.string()),
});
type People = z.infer<typeof PeopleSchema>;

// Course Quotes Schema
const QuoteSchema = z.object({
  text: z.string(),
  author: z.string().optional()
});

type Quote = z.infer<typeof QuoteSchema>;



// Books Schema
const BookSchema = z.object({
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
  amazonPrice: z.string(),
  audibleUrl: z.string(),
  audiblePrice: z.string(),
  kindleUrl: z.string(),
  kindlePrice: z.string(),
  googleUrl: z.string(),
  googlePrice: z.string(),
  people: z.array(z.string()),
  tags: z.array(z.string()),
  toc: z.array(z.string()),
  audiobookLength: z.string(),
  hasAudiobookSample: z.boolean(),
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
});

type Book = z.infer<typeof BookSchema>;

// Course Checkouts Schema
const CourseCheckoutSchema = z.object({
  type: z.string(),
  url: z.string(),
  descriptions: z.string().array(),
  testimonials: z.string().array(),
});

type CourseCheckout = z.infer<typeof CourseCheckoutSchema>;

const CourseMetaSchema = z.custom<CourseMeta>((data) => {
  return data !== undefined; // Add your validation logic here
});
// Course Cards Schema
const CourseCardSchema = z.object({
  type: z.string(),
  categoryUrl: z.string(),
  categoryPosition: z.number(),
  title: z.string(),
  imageURL: z.string(),
  imageFileName: z.string(),
  description: z.string(),
  price: z.string(), // Kajabi price
  priceInPence: z.number().optional(), // converted to price in pence
  checkoutUrl: z.string(),
  offerId: z.string().optional(),
  checkout: CourseCheckoutSchema.optional(),
  people: z.string().array().optional(),
  tags: z.string().array().optional(),
  meta: CourseMetaSchema.optional(),
});
type CourseCard = z.infer<typeof CourseCardSchema>;


// Blog Schema
const BlogSchema = z.object({
  url: z.string(),
  pubDate: z.object({
    day: z.string(),
    month: z.string(),
    year: z.string()
  }),
  title: z.string(),
  subtitle: z.string().optional(),
  images: z.array(z.string()),
  paragraphs: z.array(z.string()),
  imageFileName: z.string().optional(),
  imagePrefix: z.string().optional(),
  imageExtension: z.string().optional(),
});

type Blog = z.infer<typeof BlogSchema>;

const blogCollection = defineCollection({
  schema: BlogSchema,
  loader: glob({
    pattern: "**/*.json",
    base: './src/content/blog'
  })
});



// Define collections using the schemas
// const peopleCollection = defineCollection({
//   type: "content",
//   schema: PeopleSchema,
// });

const courseQuotesCollection = defineCollection({
  loader: glob({
    pattern: "**/*.json",
    base: './src/content/course-quotes'
  }),
  schema: z.array(QuoteSchema),
});

const webinarQuotesCollection = defineCollection({
  loader: glob({
    pattern: "**/*.json",
    base: './src/content/webinar-quotes'
  }),
  schema: z.array(QuoteSchema),
});

const staticQuotesCollection = defineCollection({
  loader: glob({
    pattern: "**/*.json",
    base: './src/content/static-pages-quotes'
  }),
  schema: z.array(QuoteSchema),
});

const booksCollection = defineCollection({
  loader: glob({
    pattern: "**/*.md",
    base: './src/content/books'
  }),
  schema: BookSchema,
});

const courseCardsCollection = defineCollection({
  loader: glob({
    pattern: "**/*.json",
    base: './src/content/courseCards'
  }),
  schema: CourseCardSchema,
});

const courseCheckoutsCollection = defineCollection({
  loader: glob({
    pattern: "**/*.json",
    base: './src/content/courseCheckouts'
  }),
  schema: CourseCheckoutSchema,
});

// Markdown-only collections (no schema needed)
const booksMoreInfoCollection = defineCollection({
  loader: glob({
    pattern: "**/*.md",
    base: './src/content/books-more-info'
  }),
});

const bookExcerptsCollection = defineCollection({
  loader: glob({
    pattern: "**/*.md",
    base: './src/content/book-excerpts'
  }),
});

const bookQuotesCollection = defineCollection({
  loader: glob({
    pattern: "**/*.json",
    base: './src/content/book-quotes'
  }),
  schema: z.array(QuoteSchema),
});

const bookReviewsCollection = defineCollection({
  loader: glob({
    pattern: "**/*.json",
    base: './src/content/book-reviews'
  }),
  schema:  z.array(QuoteSchema),
});

export type { People, Quote, Book, CourseCheckout, CourseCard };

// Export a single `collections` object to register your collection(s)
export const collections = {
  // people: peopleCollection,
  courseCards: courseCardsCollection,
  courseCheckouts: courseCheckoutsCollection,
  books: booksCollection,
  "course-quotes": courseQuotesCollection,
  "webinar-quotes": webinarQuotesCollection,
  "static-pages-quotes": staticQuotesCollection,
  blog: blogCollection,
  "books-more-info": booksMoreInfoCollection,
  "book-excerpts": bookExcerptsCollection,
  "book-quotes": bookQuotesCollection,
  "book-reviews": bookReviewsCollection,
};
