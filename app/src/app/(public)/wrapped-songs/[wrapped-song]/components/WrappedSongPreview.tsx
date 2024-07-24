import { WrappedSongMetadataType } from "@/app/dashboard/wrapped-songs/types";
import { Headline2, Headline4 } from "@gordo-d/mufi-ui-components";
import Image from "next/image";
import AudioPlayerTest from "@/components/media/audioPlayer/AudioPlayer";
import dynamic from "next/dynamic";

const AudioPlayer = dynamic(() => import("@/components/media/audioPlayer/AudioPlayer"), {
	ssr: false,
	loading: () => <AudioPlayerTest src=""></AudioPlayerTest>,
});
interface WrappedSongPreviewProps {
	wrappedSong: WrappedSongMetadataType;
}

const WrappedSongPreview = ({ wrappedSong }: WrappedSongPreviewProps) => {
	return (
		<div className="sticky top-0 grid h-screen w-full grid-rows-12 justify-center p-20">
			<div className="relative row-span-10 h-full">
				{wrappedSong.image && (
					<Image
						className="rounded-base aspect-square h-full w-auto object-cover"
						src={wrappedSong.image}
						width={1200}
						height={1200}
						alt={`Artwork for Wrapped Song ${wrappedSong.name}`}
					/>
				)}
			</div>
			<div className="row-start-11 row-end-13 grid grid-cols-2 items-end">
				<div>
					<Headline2>{wrappedSong.name}</Headline2>
					<Headline4>
						{
							wrappedSong.attributes.find((attribute) => attribute.trait_type === "Main artist")
								?.value
						}
					</Headline4>
				</div>
				<div className="">
					<AudioPlayer src={wrappedSong.animation_url} />
				</div>
			</div>
		</div>
	);
};
export default WrappedSongPreview;
