import { LoaderFunction, redirect } from '@remix-run/node';
import { NavLink, Outlet } from '@remix-run/react';

function NavItem({ to, children }: { to: string; children: React.ReactNode }) {
	return (
		<li>
			<NavLink
				to={to}
				className={({ isActive }) =>
					`${
						'underline ' +
						(isActive
							? 'text-blue-500'
							: 'text-black hover:text-blue-600')
					}`
				}
			>
				{children}
			</NavLink>
		</li>
	);
}

export default function Buildings() {
	return (
		<div>
			<nav className="max-w-prose m-auto">
				<ul className="flex space-x-2">
					<NavItem to="/buildings/O">Oxford</NavItem>
					<NavItem to="/buildings/H">Hamilton</NavItem>
					<NavItem to="/buildings/M">Middletown</NavItem>
				</ul>
			</nav>
			<Outlet />
		</div>
	);
}
