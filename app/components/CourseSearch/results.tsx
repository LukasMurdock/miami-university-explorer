import { ParseError } from '~/lib/ws.miamioh.edu/course-wrapper';
import { Parse, Result } from '~/routes/courses/search';
import { DescriptionList } from '../DescriptionList';
import { generateFieldMapping } from './fields';

export function CourseSearchResults(props: {
	results: Result[];
	fields: string[];
}) {
	return (
		<div className="space-y-2">
			{props.results.map((result) => {
				if (result.success) {
					return (
						<CourseCard
							key={result.query}
							result={result}
							fields={props.fields}
						/>
					);
				} else {
					return (
						<ParseErrorCard key={result.query} result={result} />
					);
				}
			})}
		</div>
	);
}

function ParseErrorCard({ result }: { result: ParseError }) {
	return (
		<div className="rounded-md border border-red-500 p-4">
			<p className="truncate text-sm font-bold text-red-500">
				{result.query}
			</p>
			<DescriptionList
				list={result.errors.map((error) => {
					return {
						title: 'Error',
						description: error,
					};
				})}
			/>
		</div>
	);
}

function CourseCard({ result, fields }: { result: Parse; fields: string[] }) {
	if (fields.length === 0) {
		fields.push('enrollmentCountAvailable', '');
	}

	if (
		!result?.data?.courseSections ||
		result?.data?.courseSections?.length === 0
	) {
		return (
			<div className="rounded-md border p-4">
				<p className="truncate text-sm">
					No results for{' '}
					<span className="rounded-md bg-gray-50 p-1">
						{result.query}
					</span>
				</p>
			</div>
		);
	}

	const generatedFields = result.data.courseSections.map((result) => ({
		section: result,
		fields: generateFieldMapping(result).filter((field) =>
			fields.includes(field.key)
		),
	}));

	return (
		<>
			{generatedFields.map((result) => {
				return (
					<div
						key={result.section.courseId}
						className="rounded-md border p-4"
					>
						<p className="truncate text-sm font-bold">
							{result.section.courseCode}
						</p>
						<DescriptionList list={result.fields} />
					</div>
				);
			})}
		</>
	);
}
