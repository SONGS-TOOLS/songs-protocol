import { Headline3 } from "@gordo-d/mufi-ui-components";
import { ReactNode } from "react";

interface DashboardPageTitleProps {
	children: ReactNode;
}

const DashboardPageTitle = ({ children }: DashboardPageTitleProps) => {
	return (
		<Headline3 className="text-3xl font-semibold !leading-none md:text-4xl">{children}</Headline3>
	);
};
export default DashboardPageTitle;
