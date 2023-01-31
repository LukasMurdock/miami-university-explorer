import { json, LoaderFunction, redirect } from '@remix-run/node';
import {
	Form,
	ShouldRevalidateFunction,
	useLoaderData,
	useNavigation,
	useSearchParams,
} from '@remix-run/react';
import { CourseSearch } from '~/components/CourseSearch';
import { CourseSearchResults } from '~/components/CourseSearch/results';
import { CoursesFilter } from '~/components/CoursesFilter';
import { Skeleton } from '~/components/Skeleton';
import db from '~/lib/db/db-client';
import { searchMiamiCourses } from '~/lib/ws.miamioh.edu/api';
import { CourseSections } from '~/lib/ws.miamioh.edu/api-types';
import {
	ParseError,
	partitionedParseCourses,
} from '~/lib/ws.miamioh.edu/course-wrapper';
import { fetchSelectableTerms } from '~/lib/ws.miamioh.edu/term-wrapper';
import { convertCourseSectionsToDbRow } from '~/models/courseInstance';
import { useFieldsModal } from '~/utils/useFieldsModal';

// https://remix.run/docs/en/v1/route/should-revalidate#ignoring-search-params
// export const shouldRevalidate: ShouldRevalidateFunction = ({
// 	defaultShouldRevalidate,
// 	currentParams,
// 	nextParams,
// }) => {
// 	// Ignore revalidation when the fields change
// 	if (currentParams.fields !== nextParams.fields) {
// 		return false;
// 	}
// 	// Ignore revalidation when none of the core search params change
// 	// if (
// 	// 	currentParams.q === nextParams.q &&
// 	// 	currentParams.campusCode === nextParams.campusCode &&
// 	// 	currentParams.termId === nextParams.termId
// 	// ) {
// 	// 	return false;
// 	// }
// 	return defaultShouldRevalidate;
// 	// return true;
// };

export type Parse = {
	success: true;
	data: CourseSections;
	query: string;
};

export type Result = Parse | ParseError;

type LoaderData = {
	terms: {
		termId: string;
		name: string;
		current: boolean;
	}[];
	results?: Result[];
};

export const loader: LoaderFunction = async ({ request }) => {
	const url = new URL(request.url);
	const fields = url.searchParams.getAll('fields');
	const termId = url.searchParams.get('termId');
	const campusCode = url.searchParams.get('campusCode');
	const selectableTerms = await fetchSelectableTerms();
	// If no required params, redirect to default search
	if (!termId || !campusCode) {
		// Set default termId
		if (!termId) {
			const nextTerm =
				selectableTerms[
					selectableTerms.findIndex((term) => term.current)
				];
			if (!nextTerm) throw new Error('No current term found');
			// const currentTerm = await getCurrentAcademicTerm()
			url.searchParams.set('termId', nextTerm.termId);
		}
		// Set default campus code
		if (!campusCode) {
			url.searchParams.set('campusCode', 'O');
		}

		// Set default fields
		// if (!fields.length) {
		// 	url.searchParams.append('fields', 'title');
		// 	url.searchParams.append('fields', 'description');
		// 	url.searchParams.append('fields', 'courseId');
		// }
		return redirect(`/courses/search?${url.searchParams}`);
	}

	const query = url.searchParams.get('q');

	// const currentTerm = selectableTerms.find((term) => term.current);
	// if (!currentTerm) throw new Error('No current term found');

	if (!query) {
		return json<LoaderData>({
			terms: selectableTerms,
		});
	}

	// Partition queries to parallelize requests
	const parsed = partitionedParseCourses(query);

	// Parallelize requests
	const queries = await Promise.all(
		parsed.success.map((course) => {
			return searchMiamiCourses({
				termId: Number(termId),
				campusCode: campusCode,
				subject: course.subjectCode,
				courseNumber: course.courseNumber,
				courseSectionCode: course.sectionCode,
			});
		})
	);

	// Format queried data
	const successfulQueries = queries.map((queryCourse, index) => {
		// convert to db model
		const addToDb = convertCourseSectionsToDbRow(
			queryCourse.courseSections
		);
		// for every courseSection, insert into db
		addToDb.forEach((courseInstance) => {
			db.model.courseInstance.upsert(courseInstance);
		});

		return {
			success: true as true,
			query: parsed.success[index].query,
			data: queryCourse,
		};
	});

	return json<LoaderData>(
		{
			terms: selectableTerms,
			// Rejoin partitioned data
			results: [...parsed.errors, ...successfulQueries],
		},
		{
			headers: {
				'Cache-Control':
					'public, max-age=10, s-maxage=3600, stale-while-revalidate=86400',
			},
		}
	);
};

export default function Courses() {
	const loaderData = useLoaderData<LoaderData>();
	const navigation = useNavigation();
	const [searchParams] = useSearchParams();
	const termId = searchParams.get('termId');
	const campusCode = searchParams.get('campusCode');
	// const fields = searchParams.getAll('fields');
	const isLoading = navigation.state === 'loading';
	const isSubmitting = navigation.state === 'submitting';
	const fieldsModal = useFieldsModal();

	if (!termId || !campusCode) throw new Error('No params');

	return (
		<div className="max-w-2xl m-auto">
			<div className="p-1" />
			<CoursesFilter
				selectableTerms={loaderData.terms}
				fieldsModal={fieldsModal}
			/>
			<div className="p-1" />
			<Form>
				<CourseSearch searchParams={searchParams} />
			</Form>
			<div className="p-2" />
			{loaderData.results ? (
				isLoading || isSubmitting ? (
					<Skeleton rounded="md">
						<div className="p-3" />
					</Skeleton>
				) : (
					<CourseSearchResults
						// Remix serialization type issue workaround
						results={loaderData.results as Result[]}
						fields={fieldsModal.selectedFields}
					/>
				)
			) : null}
		</div>
	);
}
