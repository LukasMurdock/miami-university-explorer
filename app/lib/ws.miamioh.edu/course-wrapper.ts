import { searchMiamiCourses } from './api';
import { fetchSelectableTerms } from './term-wrapper';

export type ParseSuccess = {
	success: true;
	subjectCode: string;
	courseNumber: string;
	sectionCode: string | undefined;
	query: string;
};

export type ParseError = {
	success: false;
	errors: string[];
	query: string;
};

type CourseParsed = {
	success: true;
	subjectCode: string;
	courseNumber: string;
	sectionCode: string | undefined;
	query: string;
};

type CourseParseError = { success: false; errors: string[]; query: string };

type ParsedCourse = CourseParsed | CourseParseError;

function parseCourse(string: string): ParsedCourse {
	const [subjectCode, courseNumber, sectionCode] = string.split(' ');
	let errors: string[] = [];
	if (!courseNumber) {
		errors.push('No course number');
	}

	if (errors.length === 0) {
		return {
			success: true,
			subjectCode,
			courseNumber,
			sectionCode,
			query: string,
		};
	} else {
		return {
			success: false,
			errors,
			query: string,
		};
	}
}

//
export function parseCourses(string: string): (ParseSuccess | ParseError)[] {
	const courses = separateCourses(string);
	return courses.map(parseCourse);
}

export function partitionedParseCourses(string: string) {
	const courses = separateCourses(string);
	return courses.reduce(
		(acc, curr) => {
			const parse = parseCourse(curr);
			if (parse.success) {
				acc.success.push(parse);
			} else {
				acc.errors.push(parse);
			}
			acc.all.push(parse);
			return acc;
		},
		{
			success: [] as ParseSuccess[],
			errors: [] as ParseError[],
			all: [] as (ParseSuccess | ParseError)[],
		}
	);
}

function separateCourses(string: string) {
	return string.split(',').map((string) => string.trim());
}

export async function fetchRecentCourseSections(
	subjectCode: string,
	courseCode: string
) {
	const recentTerms = await fetchSelectableTerms({ next: 1, previous: 4 });

	console.log(recentTerms);
	// for all terms, fetch the sections
	const sections = await Promise.all(
		recentTerms.map((term) =>
			searchMiamiCourses({
				termId: Number(term.termId),
				campusCode: 'O',
				courseNumber: courseCode,
				subject: subjectCode,
			})
		)
	);
	// combine all the sections into one array
	return sections.map((section) => section.courseSections).flat();
}
