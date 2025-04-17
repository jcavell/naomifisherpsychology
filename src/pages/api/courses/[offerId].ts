import type { BasketItem } from "../../../types/basket-item";
import { getCourseByOfferId } from "../../../scripts/courses";

export const prerender = false;

const now = new Date();
const oneYearFromNow = new Date(now.setFullYear(now.getFullYear() + 1));

export async function GET({ params }) {
  const { offerId } = params;

  const course = await getCourseByOfferId(offerId);

  if (!course) {
    return new Response("Course not found", {
      headers: { "Content-Type": "application/json" },
      status: 404,
    });
  }

  const checkoutItem: BasketItem = {
    id: course.data.offerId!,
    product_type: "course",
    is_course: true,
    is_webinar: false,
    product_id: course.data.offerId!,
    product_name: course.data.title,
    product_description: course.data.description,
    product_images: [course.data.imageURL],
    variant_id: "",
    variant_name: "Course",
    currency: "GBP", // Assuming GBP is default
    price: 100 * parseFloat(course.data.price.replace(/[^0-9.]/g, "")), // Remove currency symbol and convert to number
    formatted_price: course.data.price,
    added_at: new Date().toISOString(),
    expires_at: oneYearFromNow.toISOString(),
    quantity: 1,
    vatable: false,
  };

  return new Response(JSON.stringify(checkoutItem), {
    headers: { "Content-Type": "application/json" },
    status: 200,
  });
}
