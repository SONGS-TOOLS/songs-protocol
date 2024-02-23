import cx from "classnames";
import React from "react";

export interface GridProps {
	id?: string;
	children: React.ReactNode;
}

const Grid = ({ id, children }: GridProps) => (
	<section
		id={id}
		className={cx(
			"flex flex-col w-full md:w-auto md:grid grid-flow-row grid-cols-1 auto-rows-auto gap-y-10",
			"lg:grid-cols-lg lg:gap-10'",
			"xl:grid-cols-xl",
			"z-10",
		)}
	>
		{children}
	</section>
);

export default Grid;
