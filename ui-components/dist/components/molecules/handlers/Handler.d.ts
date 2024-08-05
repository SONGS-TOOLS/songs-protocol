import React, { HTMLAttributes } from "react";
import { ThemedIconRendererProps } from "../../atoms";
export interface HandlerProps extends HTMLAttributes<HTMLDivElement> {
    primaryIcon?: React.FC<React.SVGProps<SVGSVGElement>>;
    actionIcon?: React.FC<React.SVGProps<SVGSVGElement>>;
    theme?: ThemedIconRendererProps["theme"];
    disabled?: boolean;
}
declare const Handler: React.FC<HandlerProps>;
export default Handler;
