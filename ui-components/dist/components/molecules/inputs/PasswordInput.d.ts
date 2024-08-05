import React, { InputHTMLAttributes } from "react";
export interface PasswordInputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string | undefined;
    focusColor?: string;
    disabled?: boolean;
    status?: 'default' | 'success' | 'warning' | 'error';
}
export declare const PasswordInput: (props: PasswordInputProps) => React.JSX.Element;
