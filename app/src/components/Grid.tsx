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
			"w-full md:w-auto md:grid grid-flow-row grid-cols-1 gap-6 auto-rows-auto gap-y-10",
			"md:grid-cols-12 md:gap-10'",
			"lg:grid-cols-12 lg:gap-10'",
			"xl:grid-cols-12",
			"z-10",
		)}
	>
		{children}
	</section>
);

export default Grid;
