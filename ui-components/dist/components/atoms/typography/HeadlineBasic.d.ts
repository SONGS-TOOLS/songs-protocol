import React, { HTMLAttributes } from "react";
interface HeadlineProps extends HTMLAttributes<HTMLHeadingElement> {
    color?: string;
}
declare const HeadlineBasic: ({ color, children, className, ...props }: HeadlineProps) => React.JSX.Element;
export default HeadlineBasic;
