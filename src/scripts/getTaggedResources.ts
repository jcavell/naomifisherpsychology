import { getWebinarMeta } from "./webinarMeta";
import { allCourseMetas } from "./courseMeta";
import { lowerCaseAndRemoveWhitespace } from "./courseMeta";

export function getTaggedCourses(courses, tags: string[]) {
  const taggedCourses = allCourseMetas
    .filter((cm) => cm.tags.some((e) => tags.includes(e)))
    //  .sort((a, b) => b.tags.indexOf(tags[0]) - a.tags.indexOf(tags[0]))
    .map((cm) =>
      courses.find((c) => {
        const course = lowerCaseAndRemoveWhitespace(c.data.title).startsWith(
          lowerCaseAndRemoveWhitespace(cm.title)
        );
        return course;
      })
    );

  // console.log(`For tags ${tags} courses are  ${taggedCourses}`);
  return taggedCourses;
}

export function getTaggedBooks(books, tags: string[]) {
  return books.filter((book) => book.data.tags.some((e) => tags.includes(e)));
}

export function getTaggedWebinars(webinars, tags: string[]) {
  return webinars.filter((webinar) => {
    const eventId = webinar.id;
    const meta = getWebinarMeta(eventId);
    return meta?.tags?.some((t) => tags.includes(t));
  });
}

export function getTaggedPosts(posts, tags: string[]) {
  return posts.filter((post) => post.data.tags?.some((e) => tags.includes(e)));
}

export function getCategoryPosts(posts, categories: string[]) {
  return posts.filter((post) => categories.includes(post.data.url));
}
