import React from "react";
declare type CustomRadioInputProps = {
    id: string;
    name: string;
    value: string;
    label: string;
    checked: boolean;
    disabled?: boolean;
    onChange: (value: string) => void;
};
export declare const CustomRadioInput: React.FC<CustomRadioInputProps>;
export {};
