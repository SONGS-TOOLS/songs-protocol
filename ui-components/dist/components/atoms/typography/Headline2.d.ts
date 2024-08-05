import React from "react";
interface HeadlineProps extends React.HTMLAttributes<HTMLHeadingElement> {
    color?: string;
}
declare const Headline2: ({ color, children, ...props }: HeadlineProps) => React.JSX.Element;
export default Headline2;
