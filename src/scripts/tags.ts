export const type101 = "101";
export const type102 = "102";

export const age5To12 = "5-12 yrs";
export const age13To18 = "13-18 yrs";

export const forParents = "Parents";
export const forTeens = "Teens";
export const forProfessionals = "Professionals";

export const tagEMDR = "EMDR";

export const tagALDP = "Low Demand Parenting";
export const tagAutism = "Autism";
export const tagNeurodiversity = "Neurodiversity";
export const tagAnxiety = "Anxiety";
export const tagDemandAvoidance = "Demand Avoidance";
export const tagTrauma = "Trauma";
export const tagScreens = "Screens";
export const tagAggression = "Aggression";
export const tagBurnout = "Burnout";

export const tagSchool = "School";
export const tagEHCPs = "EHCPs";
export const tagSEN = "SEN";
export const tagADHD = "ADHD";

export const umbrellaTags = new Map<string, string[]>([
  [tagNeurodiversity, [tagAutism, tagSEN, tagADHD]],
  [tagAutism, [tagNeurodiversity]],
  [tagSEN, [tagEHCPs]],
]);

const tag2regex: Readonly<Record<string, RegExp>> = {
  [tagAutism]: new RegExp(["auti", "neurodiv"].join("|"), "i"),
  [tagDemandAvoidance]: new RegExp(
    ["pda", "demand avoid", "pressure"].join("|"),
    "i"
  ),
  [tagAnxiety]: new RegExp(
    ["anxiety", "anxious", "mental health"].join("|"),
    "i"
  ),
  [tagBurnout]: new RegExp(["burnout", "burnt out"].join("|"), "i"),
  [tagTrauma]: new RegExp(["trauma"].join("|"), "i"),

  [tagSchool]: new RegExp(["school", "academic", "exam"].join("|"), "i"),
  [tagEHCPs]: new RegExp(["ehcp"].join("|"), "i"),
  [tagSEN]: new RegExp(["Special Educational Needs"].join("|"), "i"),

  [tagScreens]: new RegExp(["screen"].join("|"), "i"),
  [tagAggression]: new RegExp(["aggress", "violent"].join("|"), "i"),

  [tagALDP]: new RegExp(["art of low demand parenting"].join("|"), "i"),
};

export const topicTags = [
  tagAutism,
  tagDemandAvoidance,
  tagAnxiety,
  tagBurnout,
  tagTrauma,
  tagSchool,
  tagEHCPs,
  tagSEN,
  tagScreens,
  tagALDP,
  tagEMDR,
];

export const ageTags = [age5To12, age13To18];

export const forTags = [forParents, forTeens, forProfessionals];

export const allTags = [
  Array.from(umbrellaTags.keys()),
  topicTags,
  ageTags,
  forTags,
].flat();

// Not used by courses any more
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

  // console.log("Unique tags: " + uniqueTags);
  return uniqueTags;
};

const doIt = function (contentToCheck: string) {
  return Object.entries(tag2regex)
    .filter((tagAndRegex) => tagAndRegex[1].test(contentToCheck))
    .map((tagAndRegex) => tagAndRegex[0]);
};
