// webinarsToCsv.ts
import * as fs from "node:fs";
import getWebinars from "./webinars";
import type { Webinar } from "../types/webinar";
import * as dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

// Get the directory path of the current file
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from the project root
dotenv.config({ path: join(__dirname, "../../.env") });

export const getLowestPrice = (webinar: Webinar): number => {
  if (!webinar.ticket_classes || webinar.ticket_classes.length === 0) {
    return 0;
  }

  // Filter visible tickets with valid cost and sort by price
  const visibleTickets = webinar.ticket_classes
    .filter((ticket) => !ticket.hidden && ticket.cost?.value !== undefined)
    .sort((a, b) => (a.cost?.value || 0) - (b.cost?.value || 0));

  if (visibleTickets.length === 0) {
    return 0;
  }

  // Return the lowest price
  return (visibleTickets[0].cost?.value || 0) / 100; // Converting from pence to pounds
};

async function generateWebinarsCsv(): Promise<void> {
  try {
    // Get webinars data
    const webinars = await getWebinars();

    // Facebook catalog header
    const header = [
      "id",
      "title",
      "description",
      "availability",
      "condition",
      "price",
      "link",
      "image_link",
      "brand",
      "google_product_category",
      "fb_product_category",
      "quantity_to_sell_on_facebook",
      "sale_price",
      "sale_price_effective_date",
      "item_group_id",
      "gender",
      "color",
      "size",
      "age_group",
      "material",
      "pattern",
      "shipping",
      "shipping_weight",
      "gtin",
      "video[0].url",
      "video[0].tag[0]",
      "product_tags[0]",
      "product_tags[1]",
      "product_tags[2]",
      "product_tags[3]",
      "style[0]",
    ].join(",");

    // Process each webinar into CSV rows
    const rows = webinars.map((webinar) => {
      const price = `${getLowestPrice(webinar).toFixed(2)} GBP`;

      return [
        webinar.id,
        `"${webinar.name.text.replace(/"/g, '""')}"`,
        `"${webinar.description.text.replace(/"/g, '""')}"`,
        "in stock",
        "new",
        price,
        webinar.url,
        webinar.logo?.original.url || "",
        "Naomi Fisher Psychology",
        "Education > Educational Resources > Parenting Resources",
        "Services > Education & Learning",
        "1000",
        "", // sale_price
        "", // sale_price_effective_date
        "", // item_group_id
        "unisex", // gender
        "", // color
        "", // size
        "adult", // age_group
        "", // material
        "", // pattern
        "", // shipping
        "", // shipping_weight
        "", // gtin
        webinar.videoData?.url || "", // video url
        "", // video tag
        "online webinar", // product_tag[0]
        "child psychology", // product_tag[1]
        "parent education", // product_tags[2]
        "child development", // product_tags[3]
        "", // style[0]
      ].join(",");
    });

    // Combine header and rows
    const csvContent = [header, ...rows].join("\n");

    // Write to file
    fs.writeFileSync("webinars.csv", csvContent);
    console.log("CSV file generated successfully: webinars.csv");
  } catch (error) {
    console.error("Error generating CSV file:", error);
    throw error;
  }
}

(async () => {
  try {
    await generateWebinarsCsv();
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
})();
