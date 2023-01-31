import LRU from 'lru-cache';
type FetchParams = Parameters<typeof fetch>;
export type FetchInput = FetchParams[0];
export type FetchInit = FetchParams[1];

// https://github.com/isaacs/node-lru-cache

// add requestCache to the NodeJS global type
type NodeJSGlobal = typeof global;
interface CustomNodeJsGlobal extends NodeJS.Global {
	requestCache: LRU<unknown, unknown>;
}

// Prevent multiple instances of db in development
declare const global: CustomNodeJsGlobal;

export type CacheSetOptions = {
	ttl?: number;
	maxAge?: number;
	dispose?: (key: string, value: any) => void;
	length?: number;
	stale?: boolean;
	updateAgeOnGet?: boolean;
};

export const requestCache =
	global.requestCache ||
	new LRU({
		max: 500,

		// for use with tracking overall storage size
		maxSize: 5000,
		sizeCalculation: (value, key) => {
			return 1;
		},

		// for use when you need to clean up something when objects
		// are evicted from the cache
		// dispose: (value, key) => {
		// 	freeFromMemoryOrWhatever(value);
		// },

		// how long to live in ms
		ttl: 1000 * 60 * 60 * 24 * 30, // 30 days

		// return stale items before removing from cache?
		allowStale: true,

		updateAgeOnGet: false,
		updateAgeOnHas: false,

		// async method to use for cache.fetch(), for
		// stale-while-revalidate type of behavior
		// fetchMethod: async (key, staleValue, { options, signal }) => {},
	});

// add requestCache to the NodeJS global type in development to reuse
if (process.env.NODE_ENV === 'development') global.requestCache = requestCache;

export async function fetchToCache(
	input: FetchInput,
	init?: FetchInit,
	cache = requestCache,
	options: CacheSetOptions = {}
) {
	const response = await fetch(input, init);
	const clonedResponse = response.clone();
	cache.set(input, clonedResponse, options);
	return response;
}

/**
 * A wrapper around `fetch` that uses a cache.
 * @param input
 * @param init
 * @param cache
 * @param options
 * @returns
 */
export async function fetchRequestsCache(
	input: FetchInput,
	init?: FetchInit,
	cache = requestCache,
	options: CacheSetOptions = {}
): Promise<Response> {
	const cachedResponse = requestCache.get(input);
	if (cachedResponse) {
		console.log(`in cache: ${input}`);
		// type narrow to object with clone function
		if (
			typeof cachedResponse === 'object' &&
			'clone' in cachedResponse &&
			typeof cachedResponse.clone === 'function'
		) {
			return cachedResponse.clone();
		}
		// Cache is not a response, so fetch and update cache
		return fetchToCache(input, init, cache, options);
	}
	console.log(`not in cache: ${input}`);
	console.log(`cache size: ${cache.size}`);
	// list all keys and iterate over the generator
	for (const key of cache.keys()) {
		console.log(key);
	}
	// URL is not in cache, so fetch and update cache
	return fetchToCache(input, init, cache, options);
}

/**
 * A wrapper around `fetchRequestsCache` that returns the response as JSON.
 * @param input
 * @param init
 * @param cache
 * @returns
 */
export async function fetchJSONCache<T>(
	...props: Parameters<typeof fetchRequestsCache>
): Promise<T> {
	const response = fetchRequestsCache(...props);
	return response.then((res) => res.json());
}
