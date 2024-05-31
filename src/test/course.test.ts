import { assert, expect, test } from "vitest";

import {
  parseDescriptions,
  getTotalRunningTimeFromDescriptions,
} from "../scripts/courses";

 const descriptions = [
   "h3:Agenda",
   "li:Intro (1 min)",
   "li:What is Demand Avoidance? (15 mins)",
   "p:Total running time: 1 hour 15 mins",
 ];

// Edit an assertion and save to see HMR in action

// test("Math.sqrt()", () => {
//   expect(Math.sqrt(4)).toBe(2);
//   expect(Math.sqrt(144)).toBe(12);
//   expect(Math.sqrt(2)).toBe(Math.SQRT2);
// });

// test("JSON", () => {
//   const input = {
//     foo: "hello",
//     bar: "world",
//   };

//   const output = JSON.stringify(input);

//   expect(output).eq('{"foo":"hello","bar":"world"}');
//   assert.deepEqual(JSON.parse(output), input, "matches original");
// });

test("Parse descriptions", () => {
  const expectedParsedDescription =
    "<h3>Agenda</h3><ul><li>Intro (1 min)</li><li>What is Demand Avoidance? (15 mins)</li></ul><p>Total running time: 1 hour 15 mins</p>";
  const output = parseDescriptions(descriptions);
  expect(output).toBe(expectedParsedDescription);
});

test("Get total running time from descriptions",  () =>{
  const runningTime = getTotalRunningTimeFromDescriptions(descriptions);
  expect(runningTime).eq('1 hour 15 mins');
});
