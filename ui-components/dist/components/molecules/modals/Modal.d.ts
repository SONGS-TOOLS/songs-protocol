import React, { FC } from "react";
export interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    isClosingDisabled?: boolean;
    className?: string;
}
export declare const ModalOverlay: React.FC;
export declare const ModalContainer: React.FC<{
    children: React.ReactNode;
    className?: string;
}>;
export declare const Modal: FC<ModalProps>;
