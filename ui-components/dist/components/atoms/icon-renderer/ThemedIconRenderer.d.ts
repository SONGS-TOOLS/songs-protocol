import React from "react";
import { IconRendererProps } from "./IconRenderer";
declare type Themes = "citizen" | "agreement" | "dispute" | "neutral";
export interface ThemedIconRendererProps extends Omit<IconRendererProps, "color" | "background"> {
    theme: Themes;
    background?: boolean;
}
declare const ThemedIconRenderer: ({ theme, background, ...props }: ThemedIconRendererProps) => React.JSX.Element;
export default ThemedIconRenderer;
