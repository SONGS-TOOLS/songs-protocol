import React, { HTMLAttributes } from "react";
export interface RoundedHandlerProps extends HTMLAttributes<HTMLDivElement> {
    icon: React.ReactElement;
    iconPosition?: "left" | "right";
}
declare const RoundedHandler: React.FC<RoundedHandlerProps>;
export default RoundedHandler;
