import React, { MouseEventHandler, ReactNode } from "react";
export interface TableProps {
    columns: string[];
    data: ReactNode[][];
    clickHandlers?: MouseEventHandler[];
    className?: string;
}
export declare const Table: ({ columns, data, clickHandlers, className }: TableProps) => React.JSX.Element;
