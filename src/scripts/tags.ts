export const getTags = function (
  title: string = "",
  subtitle: string = "",
  body: string = ""
) {
  const primaryTags = doIt(title);
  const secondaryTags = doIt(subtitle);
  const tertiaryTags = doIt(body);

  const allTags = [...primaryTags, ...secondaryTags, ...tertiaryTags];

  const uniqueTags: string[] = [];

  allTags.forEach(function (el: string) {
    if (uniqueTags.indexOf(el) < 0) uniqueTags.push(el);
  });

  return uniqueTags;
};

const doIt = function (contentToCheck: string) {
  const tags: string[] = [];

  const parentingRegex = new RegExp(
    ["helping your", "parenting"].join("|"),
    "i"
  );

  const pdaRegex = new RegExp(
    ["pda", "demand avoid", "pressure"].join("|"),
    "i"
  );
  const autismRegex = new RegExp(
    ["autism", "autistic", "neurodivergent"].join("|"),
    "i"
  );

  const anxietyRegex = new RegExp(["anxiety", "anxious"].join("|"), "i");
  const traumaRegex = new RegExp(["trauma"].join("|"), "i");
  const screensRegex = new RegExp(["screen", "phone"].join("|"), "i");
  const aggressionRegex = new RegExp(["aggress", "violent"].join("|"), "i");
  const burnoutRegex = new RegExp(["burnout", "burnt out"].join("|"), "i");
  const forTeenRegex = new RegExp(["for teen", "for adolesc"].join("|"), "i");
  const teenRegex = new RegExp(["teen", "adolesc"].join("|"), "i");
  const ehcpRegex = new RegExp(["ehcp"].join("|"), "i");

  const wellbeingRegex = new RegExp(
    ["Looking after yourself", "Look after yourself", "wellbeing"].join("|"),
    "i"
  );

  const writingRegex = new RegExp(["writing"].join("|"), "i");
  const schoolRegex = new RegExp(["school", "academic", "exam"].join("|"), "i");


  if (forTeenRegex.test(contentToCheck)) tags.push("For Teenagers");

  if (contentToCheck.includes("Low Demand Parenting")) {
    tags.push("Low Demand Parenting");
  } 
  if (ehcpRegex.test(contentToCheck)) tags.push("EHCP");
  if (screensRegex.test(contentToCheck)) tags.push("Screens");
  if (aggressionRegex.test(contentToCheck)) tags.push("Aggressive behaviour");

 
  if (!forTeenRegex.test(contentToCheck) && teenRegex.test(contentToCheck)) tags.push("Teenager");

  if (pdaRegex.test(contentToCheck)) tags.push("Demand Avoidance");
  if (autismRegex.test(contentToCheck)) tags.push("Autism");
  if (schoolRegex.test(contentToCheck)) tags.push("School");
  if (traumaRegex.test(contentToCheck)) tags.push("Trauma");
  if (burnoutRegex.test(contentToCheck)) tags.push("Burnout");
  if (anxietyRegex.test(contentToCheck)) tags.push("Anxiety");


  if (wellbeingRegex.test(contentToCheck)) tags.push("Wellbeing");
//   if (writingRegex.test(contentToCheck)) tags.push("Writing");

  if (!contentToCheck.includes("Low Demand Parenting")
    && parentingRegex.test(contentToCheck))
      tags.push("Parenting");

  return tags;
};
