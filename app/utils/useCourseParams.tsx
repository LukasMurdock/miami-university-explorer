import { useSearchParams } from '@remix-run/react';

/**
 * A wrapper around useSearchParams that returns the search params as an object
 * with the keys termId, campusCode, and query.
 */
export function useCourseSearchParams() {
	const [searchParams, setSearchParams] = useSearchParams();
	const termId = searchParams.get('termId');
	const campusCode = searchParams.get('campusCode');
	const query = searchParams.get('q');

	return {
		searchParams,
		setSearchParams,
		termId,
		campusCode,
		query,
	};
}
