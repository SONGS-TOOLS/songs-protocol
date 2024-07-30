import { FormFieldType } from "@/components/forms/types";

interface CreditItem {
	artist: string;
	role: string;
}

export interface WrappedSongFormFields {
	main_artist: string;
	release_title: string;
	language: string;
	primary_genre: string;
	track: string;
	artwork: string;
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
	description: string;
	recording_location: string;
	upc_ean: string;
	secondary_genre: string;
}
export type WrappedSongFieldType = FormFieldType<WrappedSongFormFields>;
