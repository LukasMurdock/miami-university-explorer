import { useSearchParams } from '@remix-run/react';

/**
 * Append a search param to the current search params.
 */
export function appendSearchParams(key: string, value: string) {
	const [searchParams, setSearchParams] = useSearchParams();
	searchParams.append(key, value);
	setSearchParams(searchParams);
}
