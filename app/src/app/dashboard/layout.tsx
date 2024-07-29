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
		<div className="absolute grid max-h-screen w-full grid-cols-12 overflow-hidden">
			<div className="relative col-span-2 min-h-screen border-r border-slate-200 p-4">
				<Sidebar />
			</div>
			<div className="col-span-10 h-full max-h-screen min-h-screen overflow-y-scroll px-8 py-4">
				<div className="grid min-h-full grid-rows-dashboard pt-16">{children}</div>
			</div>
		</div>
	);
}
