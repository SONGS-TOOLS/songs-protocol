import React from "react";
declare type Icon = React.ReactNode | string;
interface IllustrationRendererProps {
    icon: Icon;
    size: keyof typeof iconSpacing;
    rounded?: boolean;
    customSize?: number;
    className?: string;
    fillColor?: string;
}
declare const iconSpacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
};
declare const IllustrationRenderer: React.FC<IllustrationRendererProps>;
export default IllustrationRenderer;
