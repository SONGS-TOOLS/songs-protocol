"use client";
import Sidebar from "@/components/layout/sidebar/Sidebar";
import { GridContainer } from "@gordo-d/mufi-ui-components";
import cx from "classnames";

export default function DashboardLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<div className={cx("grid", "grid-cols-12", "w-full")}>
			<div className="relative col-span-2 min-h-screen border-r border-slate-200 p-4">
				<Sidebar />
			</div>
			<div className="col-span-10 h-full max-h-screen min-h-screen overflow-y-scroll px-8 py-4">
				<div className="grid min-h-full grid-rows-dashboard pt-16">{children}</div>
			</div>
		</div>
	);
}
