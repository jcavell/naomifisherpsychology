
export const naomi = "Dr Naomi Fisher";
export const abi = "Dr Abigail Fisher";
export const eliza = "Eliza Fricker";
export const kate = "Kate Wakeling";
export const esther = "Esther Jones";

export const getPeople = function (description: string) {
  const people: string[] = [];
  if (description.includes("Naomi")) people.push(naomi);
  if (description.includes("Abi")) people.push(abi);
  if (description.includes("Eliza")) people.push(eliza);
  if (description.includes("Kate")) people.push(kate);
  if (description.includes("Esther")) people.push(esther);

  return people;
};
