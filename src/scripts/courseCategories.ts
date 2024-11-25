import {
    forProfessionals,
    forTeens,
    tagALDP,
    tagAnxiety,
    tagAutism,
    tagBurnout,
    tagDemandAvoidance,
    tagEHCPs,
    tagEMDR,
    tagNeurodiversity,
    tagSchool,
    tagSEN,
    tagTrauma,
} from "./tags";

import {getCoursesWithTagWithoutOtherTags, getLatestCourses} from "./courses.ts";

const latestCourses = await getLatestCourses();

const autismCourses = await getCoursesWithTagWithoutOtherTags([
    tagAutism,
    tagNeurodiversity,
]);

const demandAvoidanceCourses = await getCoursesWithTagWithoutOtherTags([
    tagDemandAvoidance,
]);

const anxietyCourses = await getCoursesWithTagWithoutOtherTags([
    tagAnxiety,
    tagTrauma,
]);

const burnoutCourses = await getCoursesWithTagWithoutOtherTags([tagBurnout]);

const schoolCourses = await getCoursesWithTagWithoutOtherTags(
    [tagSchool],
    [tagEHCPs, tagALDP, tagSEN]
);

const ehcpCourses = await getCoursesWithTagWithoutOtherTags([tagEHCPs]);

const senCourses = await getCoursesWithTagWithoutOtherTags([tagSEN]);

const lowDemandParentingCourses = await getCoursesWithTagWithoutOtherTags([
    tagALDP,
]);

const forTeensCourses = await getCoursesWithTagWithoutOtherTags([forTeens]);

const forProfessionalsCourses = await getCoursesWithTagWithoutOtherTags([
    forProfessionals,
    tagEMDR,
]);

export const latestCat = 'Latest Courses';

export const category2courses:ReadonlyMap<string, any> = new Map([
    [tagAutism, autismCourses],
    [tagAnxiety, anxietyCourses],
    [tagDemandAvoidance, demandAvoidanceCourses],
    [tagBurnout, burnoutCourses],
    [tagSchool, schoolCourses],
    [forTeens, forTeensCourses],
    [forProfessionals, forProfessionalsCourses],
    [tagALDP, lowDemandParentingCourses],
    [tagEHCPs, ehcpCourses],
    [tagSEN, senCourses],
    // [latestCat, latestCourses]
]);