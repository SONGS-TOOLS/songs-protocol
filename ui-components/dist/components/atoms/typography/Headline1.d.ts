import React, { HTMLAttributes } from "react";
interface HeadlineProps extends HTMLAttributes<HTMLHeadingElement> {
    color?: string;
}
declare const Headline1: ({ color, children, ...props }: HeadlineProps) => React.JSX.Element;
export default Headline1;
