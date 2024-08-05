import Image from "next/image";
import { ArtistComponentProps } from "../types";
import { Headline1 } from "@gordo-d/mufi-ui-components";

const ArtistHeader = ({ artist }: ArtistComponentProps) => {
	return (
		<div className="flex flex-col items-start gap-2">
			<div className="relative h-96 w-full overflow-hidden">
				{artist.profile_picture && (
					<Image
						className="absolute left-0 top-0 h-full w-full object-cover"
						src={artist.profile_picture}
						width={1200}
						height={1200}
						alt={`Profile picture of ${artist.name}`}
					/>
				)}
				<div className="bg-box-vignete-bottom-xl relative flex h-full w-full items-end p-8">
					<Headline1 color="white" className="font-semibold leading-none">
						{artist.name}
					</Headline1>
				</div>
			</div>
		</div>
	);
};
export default ArtistHeader;
