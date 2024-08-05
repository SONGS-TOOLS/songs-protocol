import { FormFieldType, Option } from "@/components/forms/types";
import { WrappedSongMetadataType } from "../../wrapped-songs/types";

export interface ReleaseFormFields {
	wrapped_song: { label: string; value: WrappedSongMetadataType };
	main_artist: string;
	release_title: string;
	language: string;
	genre: string;
	track: string | File;
	artwork: string;
	release_date: string;
	dsp: Option[];
	release_worldwide: boolean;
	countries_blacklist: Option[];
	itunes_price: Option;
	pre_order_date: string;
}

export type ReleaseFieldType = FormFieldType<ReleaseFormFields>;
