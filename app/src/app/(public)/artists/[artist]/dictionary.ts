import { ArtistFormFields } from "@/app/dashboard/artists/types";

export const socialsDictionary: {
	[K in keyof Pick<
		ArtistFormFields,
		| "spotify"
		| "apple_music"
		| "facebook"
		| "instagram"
		| "x"
		| "tiktok"
		| "vk"
		| "snapchat"
		| "songkick"
		| "youtube"
		| "soundcloud"
		| "wikipedia"
	>]: string;
} = {
	spotify: "Spotify",
	apple_music: "Apple Music",
	facebook: "Facebook",
	instagram: "Instagram",
	x: "X",
	tiktok: "TikTok",
	vk: "VK",
	snapchat: "Snapchat",
	songkick: "Songkick",
	youtube: "YouTube",
	soundcloud: "SoundCloud",
	wikipedia: "Wikipedia",
};
export const socialLinks: (keyof Pick<
	ArtistFormFields,
	| "spotify"
	| "apple_music"
	| "facebook"
	| "instagram"
	| "x"
	| "tiktok"
	| "vk"
	| "snapchat"
	| "songkick"
	| "youtube"
	| "soundcloud"
	| "wikipedia"
>)[] = [
	"spotify",
	"apple_music",
	"facebook",
	"instagram",
	"x",
	"tiktok",
	"vk",
	"snapchat",
	"songkick",
	"youtube",
	"soundcloud",
	"wikipedia",
];
