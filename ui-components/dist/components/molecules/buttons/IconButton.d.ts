import React from "react";
import { ButtonProps } from "./Button";
export interface IconButtonProps extends ButtonProps {
    leftIcon?: React.FC<{
        className?: string;
    }>;
    rightIcon?: React.FC<{
        className?: string;
    }>;
}
declare const IconButton: ({ leftIcon: LeftIcon, rightIcon: RightIcon, size, disabled, border, className, children, ...props }: IconButtonProps) => React.JSX.Element;
export default IconButton;
