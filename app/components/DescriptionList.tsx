type DescriptionListItemProps = {
	title: string;
	description: string | number;
};

export function DescriptionList(props: { list: DescriptionListItemProps[] }) {
	return (
		<dl className="sm:divide-y sm:divide-gray-200">
			{props.list.map((item) => {
				return (
					<DescriptionListItem
						key={item.title}
						title={item.title}
						description={item.description}
					/>
				);
			})}
		</dl>
	);
}

function DescriptionListItem({ title, description }: DescriptionListItemProps) {
	return (
		<div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
			<dt className="text-sm font-medium text-gray-500">{title}</dt>
			<dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
				{description}
			</dd>
		</div>
	);
}
