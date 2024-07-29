import React from "react";
interface ParagraphProps extends React.HTMLAttributes<HTMLParagraphElement> {
    color?: string;
}
declare const Body1: ({ color, children, className, ...props }: ParagraphProps) => React.JSX.Element;
export default Body1;
