import React, { InputHTMLAttributes } from "react";
export interface TextAreaInputProps extends InputHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    focusColor?: string;
    disabled?: boolean;
    status?: "default" | "success" | "warning" | "error";
    required?: boolean;
}
export declare const TextAreaInput: (props: TextAreaInputProps) => React.JSX.Element;
