import React from "react";
interface ParagraphProps extends React.HTMLAttributes<HTMLParagraphElement> {
    color?: string;
}
declare const Body2: ({ color, children, className, ...props }: ParagraphProps) => React.JSX.Element;
export default Body2;
