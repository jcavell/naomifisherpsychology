// scripts/generateCourses.ts
import { readdir, readFile, writeFile } from "fs/promises";
import { join } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

interface CourseFile {
  title: string;
  checkoutUrl: string;
}

interface CourseData {
  title: string;
  offerId: string;
  internalId: string;
}

// Function to extract offerId from checkoutUrl
function extractOfferId(checkoutUrl: string): string {
  const parts = checkoutUrl.split("/");
  return parts[parts.length - 1];
}

async function processCoursesDirectory() {
  try {
    const projectRoot = join(__dirname, "..");
    const directoryPath = join(
      projectRoot,
      "naomifisherpsychology/src/content/courseCards",
    );
    const files = await readdir(directoryPath);
    const courses: CourseData[] = [];

    for (const file of files) {
      if (file.endsWith(".json")) {
        const filePath = join(directoryPath, file);
        const content = await readFile(filePath, "utf-8");
        const courseData: CourseFile = JSON.parse(content);

        courses.push({
          title: courseData.title,
          offerId: extractOfferId(courseData.checkoutUrl),
          internalId: "",
        });
      }
    }

    const outputPath = join(
      projectRoot,
      "naomifisherpsychology/src/scripts/course-get-internal-id.ts",
    );
    const fileContent = `
// Auto-generated file
export interface CourseData {
    title: string;
    offerId: string;
    internalId: string;
}

export const courses: CourseData[] = ${JSON.stringify(courses, null, 2)};

export function getCourseByOfferId(offerId: string): CourseData | undefined {
    return courses.find(course => course.offerId === offerId);
}
`;

    await writeFile(outputPath, fileContent);
    console.log("Courses file generated successfully!");
  } catch (error) {
    console.error("Error processing courses:", error);
  }
}

// Run the script
processCoursesDirectory();
