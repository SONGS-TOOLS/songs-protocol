"use client";
import DashboardPageTitle from "@/components/typography/DashboardPageTitle";
import { Button, Headline4 } from "@gordo-d/mufi-ui-components";
import { useRouter } from "next/navigation";

const ArtistsPage = () => {
	const router = useRouter();

	return (
		<>
			<DashboardPageTitle>My artist profiles</DashboardPageTitle>
			<div className="flex flex-col items-center gap-10 self-center text-center">
				<Headline4>You don't have any artist profiles yet</Headline4>
				<Button
					className="min-w-64 font-semibold"
					onClick={() => {
						router.push("/dashboard/artists/create");
					}}
				>
					Add new artist
				</Button>
			</div>
		</>
	);
};

export default ArtistsPage;
