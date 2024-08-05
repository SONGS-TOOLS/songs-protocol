"use client";

import artists from "@/app/dashboard/artists/artistsMockData/data.json";
import {
	Card,
	Headline2,
} from "@gordo-d/mufi-ui-components";
import { ArtistFormFields } from "@/app/dashboard/artists/types";
import FeedGrid from "@/components/layout/FeedGrid";
import ArtistHeader from "./components/ArtistHeader";
const artist = artists[0] as ArtistFormFields;

const ArtistPage = () => {
	const placeholderCards = Array(4).fill(0);

	return (
		<div className="h-screen">
			<div className="grid grid-cols-12 gap-4 p-8">
				<ArtistHeader artist={artist} />
				<div className="col-span-12 flex flex-col gap-4">
					<Headline2 className="font-semibold">Wrapped Songs</Headline2>
					<FeedGrid>
						{placeholderCards.map((_, index) => {
							return (
								<Card key={index} className="relative aspect-square overflow-hidden">
									<div className="h-[500] w-[500]"></div>
								</Card>
							);
						})}
					</FeedGrid>
				</div>
			</div>
		</div>
	);
};
export default ArtistPage;
