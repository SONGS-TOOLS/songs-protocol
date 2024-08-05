import { ArtistFieldType } from "../types";

export const requiredArtistFields: ArtistFieldType[] = [
	{
		type: "textInput",
		name: "name",
		label: "Name",
		rules: {
			required: "Your name is required",
		},
	},
	{
		type: "textInput",
		name: "email",
		label: "Email address",
		rules: {
			required: "Your email is required",
			pattern: {
				// REGEX FOR VALIDATING MAIL ADDRESS
				value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
				message: "Invalid email address",
			},
		},
	},
	{
		type: "conditionalTextInput",
		checkbox: {
			name: "has_spotify_link",
			label: "This artist is already on Spotify",
			tooltip: "If you don't have an artist account on Spotify we will create one for you.",
		},
		fields: [
			{
				type: "textInput",
				name: "spotify",
				label: "Spotify link",
				rules: {
					required: "Your spotify profile link is required",
					pattern: {
						// REGEX FOR VALIDATING SPOTIFY URL
						value: /^https:\/\/open\.spotify\.com\/(?:[a-zA-Z\-]+\/)?artist\/[a-zA-Z0-9]+$/i,
						message: "Invalid Spotify link",
					},
				},
			},
		],
		name: "spotify",
		label: "Spotify link",
	},
	{
		type: "conditionalTextInput",
		checkbox: {
			name: "has_apple_music_link",
			label: "This artist is already on Apple Music",
		},
		fields: [
			{
				type: "textInput",
				name: "apple_music",
				label: "Apple Music link",
				rules: {
					required: "Your Apple Music profile link is required",
					pattern: {
						// REGEX FOR VALIDATING SPOTIFY URL
						value: /^https?:\/\/music\.apple\.com\/[a-zA-Z]{2}\/artist\/[a-zA-Z0-9\-]+\/\d+$/i,
						message: "Invalid Apple Music link",
					},
				},
			},
		],
		name: "apple_music",
		label: "Apple Music link",
	},
];
export const requiredArtistFieldsForNewArtist: ArtistFieldType[] = [
	...requiredArtistFields,
	{
		type: "checkboxInput",
		name: "verification_request",
		label: "Submit this artist for verification in order to create releases",
	},
];

export const optionalArtistFields: ArtistFieldType[] = [
	{
		type: "imageFileInput",
		name: "profile_picture",
		label: "Profile picture",
		defaultImageSrc: "/songs-sphere.png",
		rounded: true,
	},
	{
		type: "textAreaInput",
		name: "bio",
		label: "Bio",
	},
	{
		type: "textInput",
		name: "phone_number",
		label: "Phone number",
	},
	{
		type: "numberInput",
		name: "pro_number",
		label: "Pro number",
	},
	{
		type: "textInput",
		name: "facebook",
		label: "Facebook account url",
	},
	{
		type: "textInput",
		name: "instagram",
		label: "Instagram account url",
	},
	{
		type: "textInput",
		name: "x",
		label: "X account url",
	},
	{
		type: "textInput",
		name: "tiktok",
		label: "TikTok account url",
	},
	{
		type: "textInput",
		name: "vk",
		label: "VK account url",
	},
	{
		type: "textInput",
		name: "snapchat",
		label: "Snapchat account url",
	},
	{
		type: "textInput",
		name: "songkick",
		label: "Songkick account url",
	},
	{
		type: "textInput",
		name: "youtube",
		label: "YouTube account url",
	},
	{
		type: "textInput",
		name: "soundcloud",
		label: "SoundCloud account url",
	},
	{
		type: "textInput",
		name: "wikipedia",
		label: "Wikipedia page url",
	},
	{
		type: "textInput",
		name: "website",
		label: "Website url",
	},
];
