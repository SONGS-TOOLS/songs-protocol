"use client";

import DashboardPageTitle from "@/components/typography/DashboardPageTitle";
import { Headline4 } from "@gordo-d/mufi-ui-components";

const SongsharesPage = () => {
	return (
		<>
			<DashboardPageTitle>My Songshares</DashboardPageTitle>
			<div className="self-center text-center">
				<Headline4>You don't have any Songshares yet</Headline4>
			</div>
		</>
	);
};

export default SongsharesPage;
