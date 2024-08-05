import React from "react";
import { DropzoneOptions } from "react-dropzone";
export interface DropInputProps {
    label?: string;
    showFiles?: boolean;
    acceptedFiles?: File[];
    dropzoneConfig?: DropzoneOptions;
    className?: string;
    required?: boolean;
    name?: string;
}
export declare const DropInput: ({ label, showFiles, acceptedFiles, dropzoneConfig, className, required, name, ...props }: DropInputProps) => React.JSX.Element;
