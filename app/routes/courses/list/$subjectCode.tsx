import { json, LoaderFunction, MetaFunction } from '@remix-run/node';
import { Link, useLoaderData, useParams } from '@remix-run/react';
import db from '~/lib/db/db-client';

type LoaderData = {
	coursesWithSubject: {
		id: number;
		code: string;
		title: string;
		credits: string;
	}[];
};

export const meta: MetaFunction<LoaderData> = ({ data, params }) => {
	return {
		title: `${params.subjectCode} Courses | Miami University Explorer`,
		description: 'A list of courses for Miami University.',
	};
};

export const loader: LoaderFunction = async ({ request, params }) => {
	const subjectCode = params.subjectCode;
	if (!subjectCode) throw new Error('subjectCode is required');
	// TODO: validate subjectCode
	// TODO: handle course id

	// query for subjectCode in course_instances
	const data = db
		.prepare(
			'SELECT DISTINCT id, code, title, credits FROM course_instances WHERE subject = ? GROUP BY code'
		)
		.all(subjectCode) as {
		id: number;
		code: string;
		title: string;
		credits: string;
	}[];

	if (data.length === 0) {
		throw new Response(`No course instances found for ${subjectCode}`, {
			status: 404,
		});
	}

	return json<LoaderData>(
		{ coursesWithSubject: data },
		{
			headers: {
				// cache for 1 day on the cdn
				'Cache-Control': 'public, max-age=86400',
			},
		}
	);
};

export default function SubjectList() {
	const loaderData = useLoaderData<LoaderData>();
	const params = useParams();

	return (
		<div className="prose m-auto">
			<h1>{params.subjectCode} Courses</h1>
			{loaderData.coursesWithSubject.map((course) => (
				<li key={course.id}>
					<Link
						to={`/courses/list/${params.subjectCode}/${course.code}`}
					>
						{course.code} - {course.title} ({course.credits})
					</Link>
				</li>
			))}
			{/* <Code data={loaderData} /> */}
		</div>
	);
}
