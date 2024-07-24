import Link, { LinkProps } from "next/link";
import React, { ReactNode } from "react";

export interface UnderlinedAnchorProps extends LinkProps {
	children: ReactNode;
}
const UnderlinedAnchor: React.FC<UnderlinedAnchorProps> = ({ children, ...props }) => {
	return (
		<Link className="underline" {...props}>
			{children}
		</Link>
	);
};

export default UnderlinedAnchor;
