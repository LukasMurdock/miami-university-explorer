type SelectProps = {
	label: string;
	name: string;
	options: {
		/** Must be unique. Used as key. */
		value: string;
		label: string;
	}[];
	defaultOption?: string;
	onChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
};

export function Select(props: SelectProps) {
	return (
		<div className="flex flex-col">
			<label
				htmlFor={props.name}
				className="text-sm font-medium text-gray-700"
			>
				{props.label}
			</label>
			<select
				id={props.name}
				name={props.name}
				className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black sm:text-sm"
				defaultValue={props.defaultOption}
				onChange={props.onChange}
			>
				{props.options.map((option) => {
					return (
						<option key={option.value} value={option.value}>
							{option.label}
						</option>
					);
				})}
			</select>
		</div>
	);
}
