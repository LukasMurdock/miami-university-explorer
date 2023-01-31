import { json, LoaderFunction, MetaFunction } from '@remix-run/node';
import { useLoaderData, useParams } from '@remix-run/react';
import { Code } from '~/components/Code';
import db from '~/lib/db/db-client';
import { formatTermId } from '~/lib/ws.miamioh.edu/api-constants';
import { fetchRecentCourseSections } from '~/lib/ws.miamioh.edu/course-wrapper';
import {
	convertCourseSectionsToDbRow,
	CourseInstance,
	groupCoursesByTerm,
} from '~/models/courseInstance';

export const meta: MetaFunction<LoaderData> = ({ data, params }) => {
	return {
		title: `${params.subjectCode} ${params.courseCode} | Miami University Explorer`,
		description: `A list of sections for ${params.subjectCode} ${params.courseCode} at Miami University.`,
	};
};

type LoaderData = {
	terms: Record<string, CourseInstance[]>;
};

function fourOhFour(subjectCode: string, courseCode: string) {
	throw new Response(
		`No course instances found for ${subjectCode} ${courseCode}`,
		{
			status: 404,
		}
	);
}

function sendJson(data: LoaderData) {
	return json(data, {
		headers: {
			// cache for 100 days on the cdn
			'Cache-Control': `public, max-age=${100 * 24 * 60 * 60}`,
		},
	});
}

async function refreshCourse(
	subjectCode: string,
	courseCode: string
): Promise<CourseInstance[]> {
	const fetchedSections = await fetchRecentCourseSections(
		subjectCode,
		courseCode
	);

	if (fetchedSections.length === 0) {
		throw fourOhFour(subjectCode, courseCode);
	}

	// for every courseSection, insert into db
	const addToDb = convertCourseSectionsToDbRow(fetchedSections);

	if (addToDb.length === 0) {
		throw fourOhFour(subjectCode, courseCode);
	}
	console.log(
		'upserting',
		addToDb.length,
		'course instances for',
		subjectCode,
		courseCode
	);
	// for every courseSection, insert into db
	addToDb.forEach((courseInstance) => {
		db.model.courseInstance.upsert(courseInstance);
	});

	return addToDb;
}

export const loader: LoaderFunction = async ({ request, params }) => {
	const subjectCode = params.subjectCode;
	const courseCode = params.courseCode;
	if (!subjectCode) throw new Error('subjectCode is required');
	if (!courseCode) throw new Error('courseCode is required');
	const url = new URL(request.url);
	const refreshRequested = url.searchParams.get('refresh') === 'true';

	if (refreshRequested) {
		console.log('refresh requested for', subjectCode, courseCode);
		const refreshed = await refreshCourse(subjectCode, courseCode);
		return sendJson({ terms: groupCoursesByTerm(refreshed) });
	}

	const data = db
		.prepare(
			'SELECT * FROM course_instances WHERE subject = ? AND code = ? ORDER BY term DESC, section ASC'
		)
		.all(subjectCode, courseCode) as CourseInstance[];

	if (data.length === 0) {
		const fetchedSections = await fetchRecentCourseSections(
			subjectCode,
			courseCode
		);

		if (fetchedSections.length === 0) {
			throw fourOhFour(subjectCode, courseCode);
		}

		// for every courseSection, insert into db
		const addToDb = convertCourseSectionsToDbRow(fetchedSections);

		if (addToDb.length === 0) {
			throw fourOhFour(subjectCode, courseCode);
		}

		// for every courseSection, insert into db
		addToDb.forEach((courseInstance) => {
			db.model.courseInstance.create(courseInstance);
		});

		return sendJson({ terms: groupCoursesByTerm(addToDb) });
	}

	const groupedByTerm = groupCoursesByTerm(data);

	return sendJson({ terms: groupedByTerm });
};

export default function SubjectList() {
	const loaderData = useLoaderData<LoaderData>();
	const params = useParams();
	const terms = Object.entries(loaderData.terms);
	const firstCourseInstance = terms[0][1][0];

	return (
		<div className="prose m-auto">
			<h1>
				{params.subjectCode} {params.courseCode} —{' '}
				{firstCourseInstance.title}
			</h1>
			<p>{firstCourseInstance.description}</p>
			<h2>Sections</h2>
			<dl>
				{terms.map(([term, courseInstances]) => (
					<div key={term}>
						<p className="text-sm">{formatTermId(term)}</p>
						{courseInstances.map((courseInstance) => (
							<dl
								key={courseInstance.id}
								className="grid grid-cols-4"
							>
								<dt>{courseInstance.section}</dt>
								<dd>CRN: {courseInstance.id}</dd>
								<dd>Seats: {courseInstance.enrollmentMax}</dd>
								<dd>Credits: {courseInstance.credits}</dd>
							</dl>
						))}
					</div>
				))}
			</dl>
		</div>
	);
}
