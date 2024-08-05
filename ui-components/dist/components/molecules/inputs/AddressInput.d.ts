import React, { ChangeEvent, InputHTMLAttributes } from "react";
import { providers } from "ethers";
export interface AddressInputProps extends InputHTMLAttributes<HTMLInputElement> {
    focusColor?: string;
    onBlurCustom?: (e: ChangeEvent<HTMLInputElement>) => void;
    ensProvider?: providers.BaseProvider | undefined;
    label?: string | undefined;
    defaultValue?: string | undefined;
    showEnsName?: boolean;
    disabled?: boolean;
    status?: 'default' | 'success' | 'warning' | 'error';
}
export declare const AddressInput: (props: AddressInputProps) => React.JSX.Element;
