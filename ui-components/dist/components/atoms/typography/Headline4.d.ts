import React, { HTMLAttributes } from "react";
interface HeadlineProps extends HTMLAttributes<HTMLHeadingElement> {
    color?: string;
}
declare const Headline4: ({ color, children, className, ...props }: HeadlineProps) => React.JSX.Element;
export default Headline4;
