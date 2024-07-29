import React from "react";
interface ParagraphProps extends React.HTMLAttributes<HTMLParagraphElement> {
    color?: string;
}
declare const Body3: ({ color, children, className, ...props }: ParagraphProps) => React.JSX.Element;
export default Body3;
