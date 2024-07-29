import React from "react";
declare type IconSizes = "extra-small" | "small" | "medium" | "large" | "custom";
export interface IconRendererProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "className"> {
    icon: React.FC<React.SVGProps<SVGSVGElement>>;
    size?: IconSizes;
    rounded?: boolean;
    color?: string;
    background?: string;
    iconClass?: string;
    containerClass?: string;
}
declare const IconRenderer: ({ icon: Icon, size, rounded, color, background, iconClass, containerClass }: IconRendererProps) => React.JSX.Element;
export default IconRenderer;
