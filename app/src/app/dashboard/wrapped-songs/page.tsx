"use client";

import DashboardPageTitle from "@/components/typography/DashboardPageTitle";
import { Button, Headline4 } from "@gordo-d/mufi-ui-components";
import { useRouter } from "next/navigation";

const WrappedSongsPage = () => {
	const router = useRouter();
	return (
		<>
			<DashboardPageTitle>My Wrapped Songs</DashboardPageTitle>
			<div className="flex flex-col items-center gap-10 self-center text-center">
				<Headline4>You don't have any Wrapped Songs yet</Headline4>
				<Button
					className="min-w-64 font-semibold"
					onClick={() => {
						router.push("/dashboard/wrapped-songs/create");
					}}
				>
					Create new Wrapped Song
				</Button>
			</div>
		</>
	);
};

export default WrappedSongsPage;
