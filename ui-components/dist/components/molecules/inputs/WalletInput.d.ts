import React, { InputHTMLAttributes } from "react";
export interface WalletInputValue {
    ensName: string;
    address: string;
}
export interface WalletInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> {
    value: WalletInputValue;
    onValueChange: (value: WalletInputValue) => void;
    status?: "default" | "success" | "warning" | "error";
    focusColor?: string;
    label?: string | undefined;
    disabled?: boolean;
    resolveEnsNameFromAddress?: (address: string) => Promise<string | null>;
    resolveAddressFromEnsName?: (ensName: string) => Promise<string | null>;
    onEnsResolved?: (ensName: string) => void;
    onAddressValidated?: (address: string) => void;
    onResolvingError?: (error: Error) => void;
}
export declare const WalletInput: React.ForwardRefExoticComponent<WalletInputProps & React.RefAttributes<HTMLInputElement>>;
