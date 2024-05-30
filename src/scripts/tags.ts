export const type101 = "101";
export const type102 = "102";
export const ageTeen = "Teen";
export const age5To12 = "5-12";
export const forParents = "Parents";
export const forTeens = "Teens";
export const forProfessionals = "Professionals";
export const aldp = "Low Demand Parenting";
export const autism = "Autism";
export const neurodiversity = "Neurodiversity";
export const anxiety = "Anxiety";
export const demandAvoidance = "Demand Avoidance";
export const trauma = "Trauma";
export const screens = "Screens";
export const aggression = "Aggression";
export const burnout = "Burnout";
export const school = "School";
export const ehcp = "EHCP";

const tag2regex: Readonly<Record<string, RegExp>> = {
  [autism]: new RegExp(["auti", "neurodiv"].join("|"), "i"),
  [demandAvoidance]: new RegExp(
    ["pda", "demand avoid", "pressure"].join("|"),
    "i"
  ),
  [anxiety]: new RegExp(["anxiety", "anxious"].join("|"), "i"),
  [burnout]: new RegExp(["burnout", "burnt out"].join("|"), "i"),
  [trauma]: new RegExp(["trauma"].join("|"), "i"),

  [school]: new RegExp(["school", "academic", "exam"].join("|"), "i"),
  [ehcp]: new RegExp(["ehcp"].join("|"), "i"),

  [forTeens]: new RegExp(["for teen", "for adolesc"].join("|"), "i"),
  [ageTeen]: new RegExp(["teen", "adolesc"].join("|"), "i"),

  [screens]: new RegExp(["screen", "phone"].join("|"), "i"),
  [aggression]: new RegExp(["aggress", "violent"].join("|"), "i"),

  [aldp]: new RegExp(["art of low demand parenting"].join("|"), "i"),
};

export const coreTags = [autism, demandAvoidance, anxiety, burnout, trauma, school, ehcp, screens, aldp];
export const ageTags = [age5To12, ageTeen]
export const forTags = [forParents, forTeens, forProfessionals]

export const getAllTags = function(){
  return Object.keys(tag2regex);
}

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


