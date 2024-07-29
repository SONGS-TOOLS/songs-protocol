import Image from "next/image";
import { ArtistComponentProps } from "../types";
import { Body2, Body3, Card, Headline1 } from "@gordo-d/mufi-ui-components";
import { socialLinks, socialsDictionary } from "@/app/(public)/artists/[artist]/dictionary";
import UnderlinedAnchor from "@/components/typography/UnderlinedAnchor";
import LinkArrow from "@/components/icons/LinkArrow";

const ArtistHeader = ({ artist }: ArtistComponentProps) => {
	return (
		<div className="col-span-12 grid grid-cols-12 items-start gap-2">
			<div className="relative col-span-12 h-48 w-48 overflow-hidden">
				{artist.profile_picture && (
					<Image
						className="h-full w-full rounded-full object-cover"
						src={artist.profile_picture}
						width={1200}
						height={1200}
						alt={`Profile picture of ${artist.name}`}
					/>
				)}
			</div>
			<div className="items-star relative col-span-7 flex h-full w-full flex-col gap-4">
				<Headline1 className="font-semibold leading-none">{artist.name}</Headline1>
				<div className="col-span-7 flex flex-col gap-4">
					<div>
						<Body2>{artist.bio}</Body2>
					</div>
					<div>
						<div className="flex flex-wrap gap-4">
							{socialLinks.map((socialLink) => {
								return (
									artist[socialLink] && (
										<div className="flex items-center">
											<Body3 color="slate-500" key={socialLink}>
												<UnderlinedAnchor href={artist[socialLink]}>
													{socialsDictionary[socialLink]}
												</UnderlinedAnchor>
											</Body3>
											<LinkArrow className="fill-slate-500" />
										</div>
									)
								);
							})}
						</div>
					</div>
				</div>
			</div>
			<div className="col-start-10 col-end-13 self-end">
				<Card className="flex flex-col gap-4">
					<div className="flex justify-between">
						<div>Wrapped Songs</div>
						<div>0</div>
					</div>
					<hr />
					<div className="flex justify-between">
						<div>Wallet address</div>
						<div>0x20da7...b2fc</div>
					</div>
				</Card>
			</div>
		</div>
	);
};
export default ArtistHeader;
