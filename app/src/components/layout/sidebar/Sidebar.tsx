import Link from "next/link";
import Logo from "../../typography/Logo";
import NavItem from "./NavItem";
import PersonIcon from "@/components/icons/PersonIcon";

const navItems = [
	{
		href: "/dashboard/songshares",
		label: "My songshares",
	},
	{
		href: "/dashboard/artists",
		label: "My artist profiles",
	},
	{
		href: "/dashboard/wrapped-songs",
		label: "My Wrapped Songs",
	},
	{
		href: "/dashboard/releases",
		label: "Create new release",
	},
];

const Sidebar = () => {
	return (
		<div className="flex h-full flex-col">
			<div className="h-20">
				<Logo graphic={true} />
			</div>
			<nav className="-mt-2 flex flex-1 flex-col gap-1 font-semibold">
				{navItems.map((navItem) => {
					return <NavItem key={navItem.href} href={navItem.href} label={navItem.label} />;
				})}
			</nav>
			<div>
				<Link className="flex gap-4 px-2 font-semibold text-slate-500" href="#">
					<PersonIcon className="stroke-slate-500" />
					<span>Settings</span>
				</Link>
			</div>
		</div>
	);
};
export default Sidebar;
