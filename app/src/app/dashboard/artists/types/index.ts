import { FormFieldType } from "@/components/forms/types";
export interface ArtistFormFields {
	name: string;
	email: string;
	has_spotify_link: boolean;
	has_apple_music_link: boolean;
	spotify: string;
	apple_music: string;
	verification_request: boolean;
	verified: boolean;
	profile_picture?: string;
	bio?: string;
	pro_number?: string;
	facebook?: string;
	instagram?: string;
	x?: string;
	tiktok?: string;
	vk?: string;
	snapchat?: string;
	songkick?: string;
	youtube?: string;
	soundcloud?: string;
	wikipedia?: string;
	website?: string;
	phone_number?: string;
}

export type ArtistFieldType = FormFieldType<ArtistFormFields>;
