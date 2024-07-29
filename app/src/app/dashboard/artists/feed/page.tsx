"use client";
import DashboardPageTitle from "@/components/typography/DashboardPageTitle";
import artists from "@/app/dashboard/artists/artistsMockData/data.json";
import FeedGrid from "@/components/layout/FeedGrid";
import Image from "next/image";
import { Body3, Card, Headline3, Headline4 } from "@gordo-d/mufi-ui-components";
import { useMemo } from "react";
import Link from "next/link";
import PencilIcon from "@/components/icons/PencilIcon";
import UnderlinedAnchor from "@/components/typography/UnderlinedAnchor";
const FeedArtistsPage = () => {
	const placeholderCards = useMemo(() => {
		//make total number of cards multiple of 4 + 4 extra

		const missing = artists.length % 4;
		const placeholderCards = Array(missing + 4).fill(0);
		return placeholderCards;
	}, [artists]);

	return (
		<>
			<div>
				<div className="flex justify-between">
					<DashboardPageTitle>My artists</DashboardPageTitle>
				</div>
			</div>
			<div className="py-10">
				<FeedGrid>
					{artists.map((artist) => {
						//REPLACE KEY WITH ID ONCE STORED IN DATABASE
						return (
							<div key={artist.name}>
								<Card className="relative overflow-hidden !p-0">
									<Image
										width={500}
										height={500}
										src={artist.profile_picture}
										alt={`Profile picture of ${artist.name}`}
										className="absolute left-0 top-0 aspect-square w-full object-cover"
									/>
									<div className="relative">
										<div className="bg-box-vignete">
											<div className="relative left-0 top-0 flex aspect-square h-full w-full flex-col justify-between p-4">
												<div>
													<Body3 color="white">
														<UnderlinedAnchor href={`/dashboard/artists/edit/${artist.name}`}>
															Edit artist
														</UnderlinedAnchor>
													</Body3>
												</div>
												<Headline4 className="font-semibold leading-none" color="white">
													<Link href={`/artists/${artist.name}`}>{artist.name}</Link>
												</Headline4>
											</div>
										</div>
										{/* <div className="grid grid-cols-2 py-2 text-center">
										<div className="border-r">View</div>
										<div>Edit</div>
									</div> */}
									</div>
								</Card>
							</div>
						);
					})}

					{placeholderCards.map((_, index) => {
						return (
							<Card key={index} className="relative aspect-square overflow-hidden">
								<div className="h-[500] w-[500]"></div>
							</Card>
						);
					})}
				</FeedGrid>
			</div>
		</>
	);
};

export default FeedArtistsPage;
