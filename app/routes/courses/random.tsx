import { LoaderFunction, redirect } from '@remix-run/node';
import db from '~/lib/db/db-client';

export const loader: LoaderFunction = async ({ request }) => {
	const randomCourse = db
		.prepare(
			'SELECT subject, code FROM course_instances ORDER BY RANDOM() LIMIT 1'
		)
		.get();

	return redirect(
		`/courses/list/${randomCourse.subject}/${randomCourse.code}`
	);
};
