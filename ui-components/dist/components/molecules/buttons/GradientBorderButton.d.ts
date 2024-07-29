import React from "react";
export interface GradientBorderButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    label?: string;
    size?: "medium" | "small" | "compact";
    disabled?: boolean;
    loading?: boolean;
    borderWidth?: number;
    gradient?: string;
    backgroundColor?: string;
}
declare const GradientBorderButton: React.FC<GradientBorderButtonProps>;
export default GradientBorderButton;
