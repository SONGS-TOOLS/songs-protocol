"use client";
import Link, { LinkProps } from "next/link";
import { HTMLAttributes } from "react";
import cx from "classnames";
import { usePathname } from "next/navigation";
import { Body1 } from "@gordo-d/mufi-ui-components";

interface NavItemProps extends LinkProps {
	href: string;
	label: string;
}

const NavItem = ({ href, label, ...props }: NavItemProps) => {
	const pathname = usePathname();
	const active = pathname === href;
	return (
		<Link
			className={cx({
				"rounded-sm px-2 py-2": true,
				"hover:bg-slate-100": !active,
				"bg-slate-100": active,
			})}
			href={href}
		>
			{/* <Link href={href}>{label}</Link> */}
			<Body1
				color={active ? "black" : "slate-500"}
				// className={cx({
				// 	"text-slate-500": !active,
				// 	"text-black": active,
				// })}
			>
				{label}
			</Body1>
		</Link>
	);
};
export default NavItem;
