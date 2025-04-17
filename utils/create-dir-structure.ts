import { readdir, stat } from "fs/promises";
import { join } from "path";

async function generateDirStructure(
  dir: string,
  prefix = "",
  isLast = true,
  ignorePatterns = [
    /node_modules/,
    /\.git/,
    /dist/,
    /\.env/,
    /\.json$/,
    /\.(png|jpg|jpeg|gif|svg|webp)$/i,
    /\.DS_Store/,
    /\.md$/,
  ],
): Promise<string> {
  let output = "";

  // Check if path should be ignored
  if (ignorePatterns.some((pattern) => pattern.test(dir))) {
    return output;
  }

  try {
    const files = await readdir(dir);
    const filteredFiles = files.filter(
      (file) => !ignorePatterns.some((pattern) => pattern.test(file)),
    );

    for (let i = 0; i < filteredFiles.length; i++) {
      const file = filteredFiles[i];
      const path = join(dir, file);
      const isLastItem = i === filteredFiles.length - 1;
      const stats = await stat(path);

      output += `${prefix}${isLast ? "└── " : "├── "}${file}\n`;

      if (stats.isDirectory()) {
        output += await generateDirStructure(
          path,
          `${prefix}${isLast ? "    " : "│   "}`,
          isLastItem,
        );
      }
    }
  } catch (error) {
    console.error(`Error processing ${dir}:`, error);
  }

  return output;
}

async function main() {
  const structure = await generateDirStructure("./");
  console.log("Project Structure:\n");
  console.log(structure);
}

main();
