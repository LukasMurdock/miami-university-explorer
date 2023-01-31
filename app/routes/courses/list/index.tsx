import { json, LoaderFunction, MetaFunction } from '@remix-run/node';
import { Link, useLoaderData } from '@remix-run/react';
import db from '~/lib/db/db-client';

export const meta: MetaFunction<LoaderData> = ({ data, params }) => {
	return {
		title: `Subjects | Miami University Explorer`,
		description: 'A list of subjects from Miami University.',
	};
};

type LoaderData = { subjects: string[] };

export const loader: LoaderFunction = async ({ request, params }) => {
	// query for unique subject codes in course_instances
	const data = db
		.prepare(
			'SELECT DISTINCT subject FROM course_instances ORDER BY subject'
		)
		.all() as { subject: string }[];

	const subjects = data.map((row) => row.subject);

	return json(
		{ subjects },
		{
			headers: {
				// cache for 1 day in the browser
				'Cache-Control': 'public, max-age=86400',
			},
		}
	);
};

export default function SubjectList() {
	const loaderData = useLoaderData<LoaderData>();
	return (
		<div className="prose m-auto">
			<h1>Subjects</h1>
			{loaderData.subjects.map((subject) => (
				<li key={subject}>
					<Link to={`/courses/list/${subject}`}>{subject}</Link>
				</li>
			))}
		</div>
	);
}
