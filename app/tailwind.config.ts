import type { Config } from "tailwindcss";
// import designSystemConfig from '../ui-components/tailwind.config.js';

const config: Config = {
	// ...designSystemConfig,
	content: [
		"./node_modules/flowbite-react/lib/**/*.js",
		"./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/components/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/app/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		extend: {
			backgroundImage: {
				"gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
				"gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
				"brand-gradient": `linear-gradient(
									235deg,
									#76acf5 5%,
									#b8bad4 20%,
									#fbbab7 36%,
									#fecd8a 49%,
									#f9df7d 64%,
									#a9e6c8 79%,
									#31d0e9 90%
									);`,
			},
			boxShadow: {
				right: "2px 0 20px rgba(0, 0, 0, 0.1)",
			},
			gridTemplateRows: {
				dashboard: "auto 1fr",
			},
			// ...designSystemConfig.theme
		},
	},
	fontFamily: {
		base: ["Noto Sans", "ui-sans-serif", "system-ui"],
		title: ["mundial", "ui-sans-serif", "system-ui"],
	},
	plugins: [
		// require("flowbite/plugin")
	],
};
export default config;
