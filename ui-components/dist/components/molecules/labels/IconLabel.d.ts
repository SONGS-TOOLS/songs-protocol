import React from "react";
import { LabelProps } from "../../atoms/Label";
export interface IconLabelProps extends Omit<LabelProps, "size"> {
    icon?: React.ReactElement;
    iconPosition?: "left" | "right";
}
declare const IconLabel: React.FC<IconLabelProps>;
export default IconLabel;
