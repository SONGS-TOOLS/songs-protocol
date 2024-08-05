import React, { SVGProps } from "react";

const PersonIcon = (props: SVGProps<SVGSVGElement>) => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			fill="none"
			viewBox="0 0 24 24"
			{...props}
		>
			<path
				fillRule="evenodd"
				strokeLinecap="round"
				strokeLinejoin="round"
				d="M12 23.5c6.351 0 11.5-5.149 11.5-11.5S18.351.5 12 .5.5 5.649.5 12 5.649 23.5 12 23.5z"
				clipRule="evenodd"
			></path>
			<path
				fillRule="evenodd"
				strokeLinecap="round"
				strokeLinejoin="round"
				d="M12 13a4.25 4.25 0 100-8.5 4.25 4.25 0 000 8.5z"
				clipRule="evenodd"
			></path>
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				d="M18.318 18.5a6.988 6.988 0 00-12.634 0"
			></path>
		</svg>
	);
};

export default PersonIcon;
