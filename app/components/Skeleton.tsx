const roundedOptions = {
	sm: 'rounded-sm',
	md: 'rounded-md',
	lg: 'rounded-lg',
	'2xl': 'rounded-2xl',
	full: 'rounded-full',
};

type SkeletonProps = {
	children?: React.ReactNode;
	width?: number;
	height?: number;
	rounded?: keyof typeof roundedOptions;
};

export function Skeleton(props: SkeletonProps) {
	return (
		<div
			style={{
				width: props.width && `${props.width}px`,
				height: props.height && `${props.height}px`,
			}}
		>
			<div
				className={
					`${props.rounded && roundedOptions[props.rounded]} ` +
					'relative h-full w-full overflow-hidden bg-zinc-100/80 p-4 before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.5s_infinite] before:bg-gradient-to-r before:from-transparent before:via-black/10 before:to-transparent'
				}
			>
				{props.children}
			</div>
		</div>
	);
}
