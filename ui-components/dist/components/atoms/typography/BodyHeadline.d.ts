import React from "react";
interface HeadlineProps extends React.HTMLAttributes<HTMLHeadingElement> {
    color?: string;
}
declare const BodyHeadline: ({ color, children, className, ...props }: HeadlineProps) => React.JSX.Element;
export default BodyHeadline;
