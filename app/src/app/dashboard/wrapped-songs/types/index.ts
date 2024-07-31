import { FormFieldType } from "@/components/forms/types";

interface CreditItem {
	artist: string;
	role: string;
}

export interface WrappedSongAttributes {
	main_artist: string;
	language: string;
	primary_genre: string;
	featuring_artist: string;
	production_year: string;
	previously_released: boolean;
	producer: string;
	copyright: string;
	lyrics: string;
	isrc: string;
	iswc: string;
	credits: CreditItem[];
	tiktok_start_time: string;
	recording_location: string;
	upc_ean: string;
	secondary_genre: string;
	track_duration: string;
}

export interface WrappedSongFormFields extends WrappedSongAttributes {
	release_title: string;
	track: string | File;
	artwork: string;
	description: string;
}

export type WrappedSongFieldType = FormFieldType<WrappedSongFormFields>;

export interface AttributeType {
	trait_type:
		| "Main artist"
		| "Language"
		| "Primary genre"
		| "Featuring artist"
		| "Production year"
		| "Previously released"
		| "Producer"
		| "Copyright"
		| "Lyrics"
		| "ISRC"
		| "ISWC"
		| `Credit ${number}`
		| "TikTok start time"
		| "Recording location"
		| "UPC / EAN Code"
		| "Secondary genre"
		| "Track duration";
	value: string | boolean;
}
export interface WrappedSongMetadataType {
	name: string;
	description: string;
	external_url: string;
	image: string;
	animation_url: string;
	attributes: AttributeType[];
}
