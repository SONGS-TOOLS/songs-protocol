import React, { HTMLAttributes, ReactNode } from "react";
interface CardProps extends HTMLAttributes<HTMLDivElement> {
    children?: ReactNode;
    className?: string;
}
declare const Card: React.FC<CardProps>;
export default Card;
