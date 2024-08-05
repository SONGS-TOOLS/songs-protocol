import React, { HTMLAttributes } from "react";
export interface LabelProps extends HTMLAttributes<HTMLDivElement> {
    size?: "medium" | "small";
    color?: string;
    background?: string;
    border?: string;
}
declare const Label: React.FC<LabelProps>;
export default Label;
