import styles from './styles/app.css';
import type { MetaFunction } from '@remix-run/node';
import {
	Links,
	LiveReload,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
	useCatch,
} from '@remix-run/react';
import { Navigation } from './components/Navigation';
import { Code } from './components/Code';

export const meta: MetaFunction = () => ({
	charset: 'utf-8',
	title: 'Miami University Explorer',
	viewport: 'width=device-width,initial-scale=1',
});

export function links() {
	return [{ rel: 'stylesheet', href: styles }];
}

export function Layout(props: { children: React.ReactNode }) {
	return (
		<div className="p-6">
			<h1 className="text-center font-bold pb-2">
				Miami University Explorer
			</h1>
			<Navigation />
			{props.children}
		</div>
	);
}

export default function App() {
	return (
		<html lang="en">
			<head>
				<Meta />
				<Links />
			</head>
			<body>
				<Layout>
					<Outlet />
				</Layout>
				<ScrollRestoration />
				<Scripts />
				<LiveReload />
			</body>
		</html>
	);
}

export function CatchBoundary() {
	const caught = useCatch();

	const title =
		caught.status === 404 ? 'Not Found' : 'Oops, something went wrong.';

	return (
		<html lang="en">
			<head>
				<title>{title}</title>
				<Meta />
				<Links />
			</head>
			<body>
				<Layout>
					<div className="prose m-auto">
						<h1>
							{caught.status} {title}
						</h1>
						<Code data={caught.data} />
					</div>
				</Layout>
				<Scripts />
			</body>
		</html>
	);
}
