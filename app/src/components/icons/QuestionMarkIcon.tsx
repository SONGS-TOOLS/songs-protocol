import React, { SVGProps } from "react";

const QuestionMarkIcon = (props: SVGProps<SVGSVGElement>) => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			x="0"
			y="0"
			enableBackground="new 0 0 32 32"
			version="1.1"
			viewBox="0 0 32 32"
			xmlSpace="preserve"
			{...props}
		>
			<circle cx="16" cy="16" r="15.5" className="fill-white"></circle>
			<path d="M16 1c8.3 0 15 6.7 15 15s-6.7 15-15 15S1 24.3 1 16 7.7 1 16 1m0-1C7.2 0 0 7.2 0 16s7.2 16 16 16 16-7.2 16-16S24.8 0 16 0z"></path>
			<path d="M10.6 12.1c.5-1.2 1.2-2.2 2.2-2.9 1-.7 2.1-1.1 3.5-1.1s2.6.4 3.6 1c1 .7 1.5 1.8 1.5 3.3.1 1.2-.9 2.4-1.6 3.2-.3.3-.5.5-.9.8-.3.3-.6.5-.7.7 0 .1-.1.2-.3.3l-.3.3c-.1.1-.1.2-.2.3-.2.3-.3.4-.3.8 0 .2-.1.3-.1.5h-2.8c-.1-.4-.1-.7-.1-.9 0-.6.2-1.2.4-1.6.1-.2.2-.4.4-.7l.5-.5.6-.6.2-.2c.6-.6 1.1-1 1.3-1.3s.3-.6.3-.9c0-.7-.6-1.3-1.6-1.3-1.2 0-2.1.8-2.7 2.1l-2.9-1.3zm3.1 9.8c0-1.1.8-1.9 1.9-1.9 1.1 0 1.9.8 1.9 1.9 0 .6-.2 1-.5 1.4-.4.4-.8.5-1.4.5-1.1 0-1.9-.8-1.9-1.9z"></path>
		</svg>
	);
};

export default QuestionMarkIcon;
