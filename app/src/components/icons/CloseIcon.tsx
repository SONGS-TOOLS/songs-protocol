import React, { SVGProps } from "react";

function CloseIcon(props: SVGProps<SVGSVGElement>) {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" data-name="Layer 1" viewBox="0 0 80 80" {...props}>
			<path
				fillRule="evenodd"
				strokeWidth="0"
				d="M1.67 1.67a5.716 5.716 0 018.08 0L40 31.92 70.25 1.67a5.716 5.716 0 018.08 0 5.716 5.716 0 010 8.08L48.08 40l30.25 30.25a5.716 5.716 0 010 8.08 5.716 5.716 0 01-8.08 0L40 48.08 9.75 78.33a5.716 5.716 0 01-8.08 0 5.716 5.716 0 010-8.08L31.92 40 1.67 9.75a5.716 5.716 0 010-8.08z"
			></path>
		</svg>
	);
}

export default CloseIcon;
