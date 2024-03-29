/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./app/**/*.{js,ts,jsx,tsx}'],
	theme: {
		extend: {
			keyframes: ({ theme }) => ({
				rerender: {
					'0%': {
						['border-color']: theme('colors.vercel.pink'),
					},
					'40%': {
						['border-color']: theme('colors.vercel.pink'),
					},
				},
				highlight: {
					'0%': {
						background: theme('colors.vercel.pink'),
						color: theme('colors.white'),
					},
					'40%': {
						background: theme('colors.vercel.pink'),
						color: theme('colors.white'),
					},
				},
				shimmer: {
					'100%': {
						transform: 'translateX(100%)',
					},
				},
				translateXReset: {
					'100%': {
						transform: 'translateX(0)',
					},
				},
				fadeToTransparent: {
					'0%': {
						opacity: 1,
					},
					'40%': {
						opacity: 1,
					},
					'100%': {
						opacity: 0,
					},
				},
			}),
		},
	},
	plugins: [
		require('@tailwindcss/typography'),
		require('@tailwindcss/forms'),
	],
};
