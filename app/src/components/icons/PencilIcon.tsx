import React, { SVGProps } from "react";

const PencilIcon = (props: SVGProps<SVGSVGElement>) => {
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
				clipRule="evenodd"
				d="M17.6719 2.28613L21.9145 6.52877L6.86445 21.5788L2.62181 17.3362L17.6719 2.28613Z"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M2.621 17.3359L0.5 23.6999L6.864 21.5789L2.621 17.3359V17.3359Z"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M21.9139 6.52746L17.6719 2.28546L18.3789 1.57846C19.556 0.441548 21.4271 0.457807 22.5843 1.61501C23.7415 2.77221 23.7578 4.64333 22.6209 5.82046L21.9139 6.52746Z"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
};

export default PencilIcon;
