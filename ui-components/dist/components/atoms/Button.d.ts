import React from "react";
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    label?: string;
    size?: "medium" | "small" | "compact";
    border?: string;
    disabled?: boolean;
    loading?: boolean;
}
declare const Button: React.FC<ButtonProps>;
export default Button;
