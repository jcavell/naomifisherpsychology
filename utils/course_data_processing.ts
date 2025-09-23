// scripts/generateCourses.ts
import { readdir, readFile, writeFile, access } from "fs/promises";
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

function extractOfferId(checkoutUrl: string): string {
  const parts = checkoutUrl.split("/");
  return parts[parts.length - 1];
}

async function loadExistingCourses(filePath: string): Promise<CourseData[]> {
  try {
    // Just import the damn file directly
    const module = await import(filePath);
    if (module.courses && Array.isArray(module.courses)) {
      console.log(`✓ Loaded ${module.courses.length} existing courses`);
      return module.courses;
    }
  } catch (error) {
    console.log("No existing file found, creating new one");
  }
  return [];
}

async function processCoursesDirectory() {
  const projectRoot = process.cwd(); // Use current working directory (project root)
  const directoryPath = join(projectRoot, "src/content/courseCards");
  const outputPath = join(projectRoot, "src/scripts/course-get-internal-id.ts");

  // Step 1: Load existing courses - NEVER MODIFY THESE
  const existingCourses = await loadExistingCourses(outputPath);
  const existingOfferIds = new Set(existingCourses.map(c => c.offerId));

  // Step 2: Find new courses from JSON files
  const files = await readdir(directoryPath);
  const newCourses: CourseData[] = [];

  for (const file of files) {
    if (!file.endsWith(".json")) continue;

    const content = await readFile(join(directoryPath, file), "utf-8");
    const courseData: CourseFile = JSON.parse(content);
    const offerId = extractOfferId(courseData.checkoutUrl);

    // Only add if this offerId doesn't already exist
    if (!existingOfferIds.has(offerId)) {
      newCourses.push({
        title: courseData.title,
        offerId: offerId,
        internalId: ""
      });
    }
  }

  // Step 3: Output = existing (unchanged) + new only
  const allCourses = [...existingCourses, ...newCourses];

  const fileContent = `// Auto-generated file
export interface CourseData {
    title: string;
    offerId: string;
    internalId: string;
}

export const courses: CourseData[] = ${JSON.stringify(allCourses, null, 2)};

export function getCourseByOfferId(offerId: string): CourseData | undefined {
    return courses.find(course => course.offerId === offerId);
}
`;

  await writeFile(outputPath, fileContent);

  console.log(`Existing: ${existingCourses.length}, Added: ${newCourses.length}`);
}

processCoursesDirectory();