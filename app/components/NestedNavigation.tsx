import { NavLink } from '@remix-run/react';

type NestedNavigationItem = {
	label: string;
	href: string;
	items?: NestedNavigationItem[];
};

function NestedNavigationItem(props: { item: NestedNavigationItem }) {
	return (
		<li>
			<NavLink
				to={props.item.href}
				className={({ isActive }) =>
					`px-10 py-2 block hover:bg-gray-100 rounded-md transition-colors ${
						isActive ? 'bg-gray-50' : undefined
					}`
				}
			>
				{props.item.label}
			</NavLink>
			{props.item.items && (
				<ul className="flex justify-center space-x-1">
					{props.item.items.map((item) => (
						<NestedNavigationItem key={item.href} item={item} />
					))}
				</ul>
			)}
		</li>
	);
}

export function NestedNavigation(props: {
	navigation: NestedNavigationItem[];
}) {
	return (
		<nav>
			<ul className="flex justify-center space-x-1">
				{props.navigation.map((item) => (
					<NestedNavigationItem key={item.href} item={item} />
				))}
			</ul>
		</nav>
	);
}
