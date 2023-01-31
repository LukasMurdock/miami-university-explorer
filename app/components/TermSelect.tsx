type TermSelectProps = {
	terms: {
		termId: string;
		name: string;
		current: boolean;
	}[];
	onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
};

// The format is 'Winter 2022-23'
// This function groups terms by year
// and sorts them by termId
// e.g. 'Fall 2021-22' -> 'Fall'
function groupTermsByYear(terms: TermSelectProps['terms']) {
	const termsByYear: Record<string, TermSelectProps['terms']> = {};
	terms.forEach((term) => {
		const [season, year] = term.name.split(' ');
		if (!termsByYear[year]) {
			termsByYear[year] = [];
		}
		termsByYear[year].push({
			termId: term.termId,
			name: season,
			current: term.current,
		});
	});
	// Sort term years
	Object.keys(termsByYear).sort((a, b) => {
		return a.localeCompare(b);
	});
	// Sort terms by termId
	for (const year in termsByYear) {
		termsByYear[year].sort((a, b) => {
			return a.termId.localeCompare(b.termId);
		});
	}
	return termsByYear;
}

export function TermSelect(props: TermSelectProps) {
	const termsByYear = groupTermsByYear(props.terms);

	return (
		<div className="flex flex-col">
			<label
				htmlFor="termId"
				className="text-sm font-medium text-gray-700"
			>
				Term
			</label>
			<select
				id="termId"
				name="termId"
				className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black sm:text-sm"
				defaultValue={props.terms.find((term) => term.current)?.termId}
				onChange={props.onChange}
			>
				{/* list all years as optgroup */}
				{Object.keys(termsByYear).map((year) => {
					return (
						<optgroup key={year} label={year}>
							{termsByYear[year].map((term) => {
								return (
									<option
										key={term.termId}
										value={term.termId}
									>
										{term.name}
									</option>
								);
							})}
						</optgroup>
					);
				})}
			</select>
		</div>
	);
}
