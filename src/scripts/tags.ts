export const type101 = "101";
export const type102 = "102";

export const agePrimary = "Preteen";
export const ageTween = "Tween";
export const ageSecondary = "Teen";

export const forParents = "Parents and carers";
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
export const tagEHCP = "EHCP";
export const tagSEN = "SEN";
export const tagADHD = "ADHD";

export const umbrellaTags = new Map<string, string[]>([
  [tagNeurodiversity, [tagAutism, tagSEN, tagADHD]],
  [tagAutism, [tagNeurodiversity]],
  [tagSEN, [tagEHCP]]
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
  [tagEHCP]: new RegExp(["ehcp"].join("|"), "i"),
  [tagSEN]: new RegExp(["Special Educational Needs"].join("|"), "i"),

  [tagScreens]: new RegExp(["screen"].join("|"), "i"),
  [tagAggression]: new RegExp(["aggress", "violent"].join("|"), "i"),

  [tagALDP]: new RegExp(["art of low demand parenting"].join("|"), "i"),
};

export const coreTags = [
  tagAutism,
  tagDemandAvoidance,
  tagAnxiety,
  tagBurnout,
  tagTrauma,
  tagSchool,
  tagEHCP,
  tagSEN,
  tagScreens,
  tagALDP,
  tagEMDR,
];

export const ageTags = [agePrimary, ageTween, ageSecondary];

export const forTags = [forParents, forTeens, forProfessionals];

export const allTags = [Array.from(umbrellaTags.keys()), coreTags, ageTags, forTags].flat();

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
