import React, { SVGProps } from "react";

function VerifiedIcon(props: SVGProps<SVGSVGElement>) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="21"
			height="21"
			fill="none"
			viewBox="0 0 21 21"
			{...props}
		>
			<path
				fill="#000"
				d="M18.485 7.175v-2.69c0-1.1-.9-2-2-2h-2.69l-1.9-1.9c-.78-.78-2.05-.78-2.83 0l-1.89 1.9h-2.69c-1.1 0-2 .9-2 2v2.69l-1.9 1.9c-.78.78-.78 2.05 0 2.83l1.9 1.9v2.68c0 1.1.9 2 2 2h2.69l1.9 1.9c.78.78 2.05.78 2.83 0l1.9-1.9h2.68c1.1 0 2-.9 2-2v-2.69l1.9-1.9c.78-.78.78-2.05 0-2.83l-1.9-1.89z"
			></path>
			<path
				fill="#F2F2F2"
				fillRule="evenodd"
				d="M13.683 6c-.524 0-1.027.209-1.396.58l-3.41 3.411-.509-.509a1.968 1.968 0 00-2.793.002 1.968 1.968 0 00.003 2.784l1.9 1.9c.771.77 2.02.77 2.792 0l4.806-4.802c.77-.77.772-2.013.004-2.784A1.968 1.968 0 0013.683 6z"
				clipRule="evenodd"
			></path>
		</svg>
	);
}

export default VerifiedIcon;
