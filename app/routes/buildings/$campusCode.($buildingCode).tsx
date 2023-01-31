import { json, LoaderFunction, MetaFunction } from '@remix-run/node';
import {
	Link,
	ShouldRevalidateFunction,
	useLoaderData,
	useParams,
} from '@remix-run/react';
import { getMiamiBuildings } from '~/lib/ws.miamioh.edu/api';

export const shouldRevalidate: ShouldRevalidateFunction = () => {
	// We send all buildings down the wire on any request for instant navigation
	// so we don't want to ever revalidate
	return false;
};

export const meta: MetaFunction = ({ params }) => {
	return {
		title: `Buildings | ${
			params.buildingCode ? params.buildingCode : params.campusCode
		}`,
		description: 'A list of buildings for Miami University.',
	};
};

type LoaderData = Awaited<ReturnType<typeof getMiamiBuildings>>['data'];

function validateCampusCode(campusCode: string | undefined) {
	if (campusCode === undefined) {
		return undefined;
	}
	if (campusCode !== 'O' && campusCode !== 'H' && campusCode !== 'M') {
		return undefined;
	}
	return campusCode;
}

// Query buildings list from API
// and cache forever because it's unlikely to change
export const loader: LoaderFunction = async ({ request, params }) => {
	const campusCode = validateCampusCode(params.campusCode);

	// Use same API call for all campusCodes to re-use cache
	const buildings = await getMiamiBuildings({});
	if (!buildings) {
		return json({ error: 'Unable to load buildings' }, { status: 500 });
	}

	// remove duplicate buildingCodes for react key
	const uniqueBuildings = buildings.data.filter((building, index, self) => {
		return (
			self.findIndex((b) => b.buildingCode === building.buildingCode) ===
			index
		);
	});

	return json<LoaderData>(uniqueBuildings, {
		headers: {
			'cache-control': 'public, max-age=31536000, immutable',
		},
	});
};

export default function Buildings() {
	const buildings = useLoaderData<LoaderData>();
	const params = useParams();
	const buildingCode = params.buildingCode;
	const campusCode = params.campusCode ?? 'O';

	const buildingsOnCampus = buildings.filter(
		(building) => building.campusCode === campusCode
	);
	console.log({ campusCode });
	console.log({ buildingsOnCampus });

	if (buildingCode) {
		const building = buildings.find(
			(building) => building.buildingCode === buildingCode
		);
		if (!building) {
			throw new Error('Building not found');
		}
		return (
			<div className="prose m-auto">
				<h1>
					{building.buildingName} - {building.buildingCode}
				</h1>
				{/* <Link
					to={`/buildings/${building.campusCode}`}
					className="hover:text-blue-500"
				>
					Back to all {building.campusCode} buildings
				</Link> */}

				<p>{building.buildingAddress}</p>
				<p>Campus: {building.campusCode}</p>
				<p>Lat: {building.latitude}</p>
				<p>Lon: {building.longitude}</p>
				<p>Wifi: {building.wifi ? 'Yes' : 'No'}</p>
				<a
					href={`https://maps.google.com/maps?q=${building.latitude},${building.longitude}`}
					target="_blank"
					rel="noopener noreferrer"
				>
					Get directions
				</a>
				{building.imageURL && (
					<figure>
						{/* <label htmlFor="mn-exports-imports" className="margin-toggle">&#8853;</label><input type="checkbox" id="mn-exports-imports" className="margin-toggle"/><span className="marginnote">From Edward Tufte, <em>Visual Display of Quantitative Information</em>, page 92.</span> */}
						<img
							src={building.imageURL}
							alt={building.buildingName}
							loading="lazy"
						/>
					</figure>
				)}
				{/* <Code data={building} /> */}
			</div>
		);
	}

	return (
		<div className="prose m-auto">
			<h1>Buildings</h1>
			<ul>
				{buildingsOnCampus.map((building) => (
					<li key={building.buildingCode}>
						<Link
							to={`/buildings/${building.campusCode}/${building.buildingCode}`}
						>
							{building.buildingCode} | {building.buildingName}
						</Link>
					</li>
				))}
			</ul>
		</div>
	);
}
