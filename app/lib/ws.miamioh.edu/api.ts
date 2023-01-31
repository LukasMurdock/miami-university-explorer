import { fetchJSONCache } from '../request-cache';
import {
	Building,
	ApiRequest,
	ApiTerm,
	CourseSections,
	CampusCode,
} from './api-types';

export async function getMiamiBuildings(props: { campusCode?: CampusCode }) {
	const baseUrl = 'http://ws.miamioh.edu/api/building/v1';
	const params = new URLSearchParams();
	if (props.campusCode) {
		params.set('campusCode', props.campusCode);
	}
	const endpoint = `${baseUrl}?${params}`;
	return await fetchJSONCache<ApiRequest<Building[]>>(
		endpoint,
		undefined,
		undefined,
		{
			ttl: 1000 * 60 * 60 * 24 * 365, // 1 year
		}
	);
}

export async function searchMiamiCourses(input: {
	termId: number;
	campusCode: string;
	subject: string;
	/**
	 * courseNumber is not a number! (e.g., `150E` is a valid courseNumber)
	 */
	courseNumber: string;
	courseSectionCode?: string;
}) {
	const base_url = `http://ws.miamioh.edu/courseSectionV2/${input.termId}.json`;
	const parameters = new URLSearchParams({
		campusCode: input.campusCode,
		courseSubjectCode: input.subject,
		courseNumber: input.courseNumber,
		courseSectionCode: input.courseSectionCode ?? '',
	});

	const endpoint = base_url + '?' + String(parameters);

	// If we're in development, cache queries
	if (process.env.NODE_ENV === 'development') {
		return await fetchJSONCache<CourseSections>(
			endpoint,
			undefined,
			undefined,
			{
				ttl: 1000 * 60 * 60 * 24 * 30, // 30 days
			}
		);
	}

	const response = await fetch(endpoint);
	const data = await response.json();
	return data as CourseSections;
}

/**
 * @see http://ws.miamioh.edu/api/swagger-ui/#!/academicTerm/get_academic_banner_v2_academicTerms
 */
export async function getAcademicTerms(ops: {
	termId: string;
	next: number;
	previous: number;
}) {
	const endpoint =
		'http://ws.miamioh.edu/api/academic/banner/v2/academicTerms';
	const params = new URLSearchParams({
		termId: ops.termId,
		next: String(ops.next),
		previous: String(ops.previous),
	});

	return fetchJSONCache<ApiRequest<ApiTerm[]>>(
		`${endpoint}?${params}`,
		{
			headers: {
				Accept: 'application/json',
			},
		},
		undefined,
		{
			ttl: 1000 * 60 * 60 * 24 * 30, // cache for 30 days
		}
	);
	// const response = await fetch(`${endpoint}?${params}`, {
	// 	headers: {
	// 		Accept: 'application/json',
	// 	},
	// });
	// const data = await response.json();
	// return data as {
	// 	data: ApiTerm[];
	// };
}

export async function getCurrentAcademicTerm() {
	return await fetchJSONCache<ApiRequest<ApiTerm>>(
		'https://ws.miamioh.edu/api/academic/banner/v2/academicTerms/current.json',
		undefined,
		undefined,
		{
			ttl: 1000 * 60 * 60 * 24 * 30, // cache for 30 days
		}
	);
}

// - Year `2023`
// - Term `20`
// - Campus Code `O`
// - Course Subject Code `MKT`
// - Course Section Code `C`
// - Course Number

export async function getNextAcademicTerm() {
	return await fetchJSONCache<ApiRequest<ApiTerm>>(
		'https://ws.miamioh.edu/api/academic/banner/v2/academicTerms/next.json',
		undefined,
		undefined,
		{
			ttl: 1000 * 60 * 60 * 24 * 30, // cache for 30 days
		}
	);
}
