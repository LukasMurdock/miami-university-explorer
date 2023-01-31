import z from 'zod';
import { CourseSections } from '../lib/ws.miamioh.edu/api-types';

function hashId(crn: string, term: string): number {
	const max_termId = 999999;
	const encoding = Number(term) * max_termId + Number(crn);
	return encoding % 100000;
}

export const CourseInstanceSchema = z.object({
	id: z.number(), // hash crn and term for a 5 digit number -> 20252
	crn: z.string().min(5), // 22472 -> Course registration number (CRN)
	campus: z.union([z.literal('O'), z.literal('H'), z.literal('M')]), // O | H | M
	subject: z.string().min(3), // CSE
	code: z.string().min(3), // 252, 111L Not a number
	title: z.string(), // courseTitle, Business Computing
	term: z.string().min(6), // 202220
	section: z.string().min(1), // A
	description: z.string().nullable(), //
	instructionType: z.string().nullable(), // Lecture
	credits: z.number().nullable(), // 3
	enrollmentMax: z.number().nullable(), // 50
});

export type CourseInstance = z.infer<typeof CourseInstanceSchema>;

function encodeStringForSQL(str: string): string {
	return str.replace(/'/g, "''");
}

export function convertCourseSectionsToDbRow(
	courseSections: CourseSections['courseSections']
): CourseInstance[] {
	const conversions = courseSections.reduce(
		(acc, courseSection) => {
			const courseInstance = CourseInstanceSchema.safeParse({
				// courseId is not unique over years
				id: hashId(courseSection.courseId, courseSection.academicTerm),
				crn: courseSection.courseId,
				campus: courseSection.campusCode,
				subject: courseSection.courseSubjectCode,
				code: courseSection.courseNumber,
				title: courseSection.courseTitle,
				term: courseSection.academicTerm,
				section: courseSection.courseSectionCode,
				description:
					encodeStringForSQL(courseSection.courseDescription) ?? '',
				instructionType: courseSection.instructionalType,
				credits: Number(courseSection.creditHoursHigh),
				enrollmentMax: Number(courseSection.enrollmentCountMax),
			});
			if (courseInstance.success) {
				acc[0].push(courseInstance.data);
			} else {
				acc[1].push(courseInstance.error);
			}
			return acc;
		},
		[[], []] as [CourseInstance[], z.ZodError[]]
	);

	console.group(conversions[1].length + ' errors found');
	for (const error of conversions[1]) {
		console.log(error);
	}
	console.groupEnd();

	return conversions[0];
}

export function groupCoursesByTerm(
	courses: CourseInstance[]
): Record<string, CourseInstance[]> {
	const groupedByTerm = courses.reduce((acc, courseInstance) => {
		const term = courseInstance.term;
		if (!acc[term]) {
			acc[term] = [];
		}
		acc[term].push(courseInstance);
		return acc;
	}, {} as Record<string, CourseInstance[]>);

	// sort by section
	Object.keys(groupedByTerm).forEach((term) => {
		groupedByTerm[term].sort((a, b) => {
			if (a.section < b.section) return -1;
			if (a.section > b.section) return 1;
			return 0;
		});
	});

	return groupedByTerm;
}
