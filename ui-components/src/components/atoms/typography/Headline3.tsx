import React, { HTMLAttributes } from 'react';
import cx from 'classnames';

interface HeadlineProps extends HTMLAttributes<HTMLHeadingElement> {
	color?: string;
	className?: string;
}

const Headline3 = ({ color, children, className, ...props }: HeadlineProps) => {
	return (
		<h3
			{...props}
			className={cx(
				'text-3xl md:text-4xl md:font-bold font-semibold',
				color && `text-${color}`,
				className,
			)}
		>
			{children}
		</h3>
	);
};

export default Headline3;
