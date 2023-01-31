import { NavLink } from '@remix-run/react';

function ButtonNavItem(props: { href: string; text: string }) {
	return (
		<li>
			<NavLink
				to={props.href}
				className={({ isActive }) =>
					`px-10 py-2 block hover:bg-gray-100 rounded-md transition-colors ${
						isActive ? 'bg-gray-50' : undefined
					}`
				}
			>
				{props.text}
			</NavLink>
		</li>
	);
}

function NavItem(props: { href: string; text: string }) {
	return (
		<NavLink
			to={props.href}
			className={({ isActive }) =>
				`underline ${
					isActive
						? 'text-blue-500'
						: 'text-black hover:text-blue-600'
				}`
			}
		>
			{props.text}
		</NavLink>
	);
}

export function Navigation() {
	return (
		<nav>
			<dl className="flex justify-center space-x-2">
				<dt>Courses:</dt>
				<dd>
					<NavItem href="/courses/search" text="Search" />
				</dd>
				<dd>
					<NavItem href="/courses/list" text="List" />
				</dd>
				<dd>
					<NavItem href="/courses/random" text="Random" />
				</dd>
			</dl>
			<dl className="flex justify-center space-x-2">
				<dt>Buildings:</dt>
				<dd>
					<NavItem href="/buildings" text="List" />
				</dd>
			</dl>
		</nav>
	);
}

export function ButtonNav(props: { items: { href: string; text: string }[] }) {
	return (
		<nav>
			<ul className="flex justify-center space-x-1">
				{props.items.map((item) => (
					<ButtonNavItem
						key={item.href}
						href={item.href}
						text={item.text}
					/>
				))}
			</ul>
		</nav>
	);
}
