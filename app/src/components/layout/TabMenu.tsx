import { HTMLAttributes, SetStateAction } from "react";
import cx from "classnames";
import React from "react";
import { Body2, Body3 } from "@gordo-d/mufi-ui-components";

interface TabMenuItem {
	label: string;
}

interface TabMenuProps extends HTMLAttributes<HTMLUListElement> {
	className?: string;
	items: TabMenuItem[];
	setTab: React.Dispatch<React.SetStateAction<number>>;
	tab: number;
}
const TabMenu = ({ className, items, setTab, tab, ...props }: TabMenuProps) => {
	return (
		<ul className={`mt-4 grid w-max gap-4 ${className}`}>
			{items.map((item, index) => {
				return (
					<li
						key={`tab-item-${index}-${item.label}`}
						className={cx({
							"font-semibold underline": index === tab,
							"cursor-pointer": true,
						})}
						onClick={() => {
							setTab(index);
						}}
					>
						<Body3> {item.label}</Body3>
					</li>
				);
			})}
		</ul>
	);
};
export default TabMenu;
