export function Code(props: { data: unknown }) {
	return (
		<pre className="prose">
			<code>{JSON.stringify(props.data, null, 2)}</code>
		</pre>
	);
}
