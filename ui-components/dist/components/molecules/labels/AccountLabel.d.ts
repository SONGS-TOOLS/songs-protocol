import React from "react";
import { IconLabelProps } from "./IconLabel";
import { ThemedIconRendererProps } from "../../atoms/icon-renderer";
interface AccountLabelProps extends Omit<IconLabelProps, "icon" | "children"> {
    address: string;
    name?: string;
    avatar?: string;
    theme?: ThemedIconRendererProps["theme"];
}
declare const AccountLabel: React.FC<AccountLabelProps>;
export default AccountLabel;
