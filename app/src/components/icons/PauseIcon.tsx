import React, { SVGProps } from "react";

const PauseIcon = (props: SVGProps<SVGSVGElement>) => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			x="0"
			y="0"
			enableBackground="new 0 0 60.4 69.1"
			version="1.1"
			viewBox="0 0 60.4 69.1"
			xmlSpace="preserve"
			{...props}
		>
			<path d="M4.9.5C4.4.2 3.8 0 3.2 0c-.5 0-1.1.2-1.6.5C.5 1.1 0 2.2 0 3.5v62.1c0 1.2.5 2.4 1.6 3 .5.3 1.1.5 1.7.5.6 0 1.1-.2 1.7-.5 1.1-.6 1.6-1.8 1.6-3V3.5C6.5 2.2 6 1.1 4.9.5zM58.8.5c-.5-.3-1.1-.5-1.7-.5-.6 0-1.1.1-1.7.5-1.1.6-1.6 1.8-1.6 3v62.1c0 1.2.5 2.4 1.6 3 .5.3 1.1.5 1.7.5.6 0 1.1-.2 1.7-.5 1.1-.6 1.6-1.8 1.6-3V3.5c0-1.3-.5-2.4-1.6-3z"></path>
		</svg>
	);
};

export default PauseIcon;
