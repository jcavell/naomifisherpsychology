import { assert, expect, test } from "vitest";
import { anxiety, demandAvoidance, forTeens } from "../scripts/tags";
import {
  aldpCategory,
  anxietyCategory,
  autismCategory,
  forTeensCategory,
  getCategoriesFromTags,
  getCategoryForName,
} from "../scripts/courseCategories";

// Edit an assertion and save to see HMR in action

test("Math.sqrt()", () => {
  expect(Math.sqrt(4)).toBe(2);
  expect(Math.sqrt(144)).toBe(12);
  expect(Math.sqrt(2)).toBe(Math.SQRT2);
});

test("JSON", () => {
  const input = {
    foo: "hello",
    bar: "world",
  };

  const output = JSON.stringify(input);

  expect(output).eq('{"foo":"hello","bar":"world"}');
  assert.deepEqual(JSON.parse(output), input, "matches original");
});

test("Autism and Anxiety categories returned from demand avoidance and anxiety tags", () => {
  const tags = [demandAvoidance, anxiety];

  const categories = getCategoriesFromTags(tags);

  expect(categories).toEqual([autismCategory, anxietyCategory]);
});

test("Autism and for teenager catgories", () => {
  const tags = [demandAvoidance, forTeens];

  const categories = getCategoriesFromTags(tags);

  expect(categories).toEqual([forTeensCategory, autismCategory]);
});

test('Create aldp category from name', () => {
  const category = getCategoryForName('The Art of Low Demand Parenting');
  expect(category).toEqual(aldpCategory);
});
