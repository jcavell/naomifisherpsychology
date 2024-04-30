export const getPeople = function (description: string) {
  const people: string[] = [];
  if (description.includes("Naomi")) people.push("Dr Naomi Fisher");
  if (description.includes("Abi")) people.push("Dr Abigail Fisher");
  if (description.includes("Eliza")) people.push("Eliza Fricker");
  if (description.includes("Kate")) people.push("Kate Wakeling");
  if (description.includes("Esther")) people.push("Esther Jones");

  return people;
};
