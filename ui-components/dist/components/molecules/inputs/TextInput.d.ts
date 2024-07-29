import React from "react";
export interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    focusColor?: string;
    disabled?: boolean;
    className?: string;
    status?: "default" | "success" | "warning" | "error";
    required?: boolean;
}
export declare const TextInput: ({ label, focusColor, status, disabled, className, required, ...props }: TextInputProps) => React.JSX.Element;
