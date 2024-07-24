import React, { SVGProps } from "react";

const PlayIcon = (props: SVGProps<SVGSVGElement>) => {
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
			<path d="M58.6 31.5L4.9.5C3.8-.1 2.7-.1 1.6.5.5 1.1 0 2.2 0 3.5v62.1c0 1.2.5 2.4 1.6 3 .5.3 1.1.5 1.7.5.6 0 1.2-.2 1.7-.5l53.7-31c1.1-.6 1.7-1.8 1.7-3 0-1.3-.7-2.5-1.8-3.1z"></path>
		</svg>
	);
};

export default PlayIcon;
