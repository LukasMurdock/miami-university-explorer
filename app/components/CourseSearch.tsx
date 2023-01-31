import { useSearchParams } from '@remix-run/react';

/**
 * Iterates over the search params and returns a list of hidden inputs
 * to keep the current search params when submitting a form.
 *
 * Filters out the `q` param.
 */
function HiddenParams(props: { params: URLSearchParams }) {
	return (
		<>
			{Array.from(props.params.entries())
				// Filter out q param
				.filter((param) => param[0] !== 'q')
				.map((param) => {
					return (
						<input
							key={param[1]}
							type="hidden"
							name={param[0]}
							value={param[1]}
						/>
					);
				})}
		</>
	);
}

export function CourseSearch(props: { searchParams: URLSearchParams }) {
	return (
		<div className="selection:bg-red-500 selection:text-white">
			<HiddenParams params={props.searchParams} />
			<label htmlFor="search-course" className="sr-only">
				Search a course
			</label>
			<input
				type="search"
				name="q"
				autoComplete="off"
				id="search-course"
				className="block w-full uppercase caret-red-500 rounded-full border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
				defaultValue={props.searchParams.get('q') ?? ''}
				placeholder="MKT 335, MKT 335 C"
				enterKeyHint="search"
			/>
			<p className="py-1.5 text-xs text-gray-500">
				Comma separated search
			</p>
		</div>
	);
}
