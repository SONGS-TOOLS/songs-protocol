import { WrappedSongFieldType } from "../types";
export const requiredWrappedSongFields: WrappedSongFieldType[] = [
	{
		type: "selectInput",
		name: "main_artist",
		label: "Main artist",
		rules: {
			required: "Main artist is required",
		},
		options: [],
	},
	{
		type: "textInput",
		name: "release_title",
		label: "Release title",
		rules: {
			required: "Release title is required",
		},
	},
	{
		type: "selectInput",
		name: "language",
		label: "Language",
		rules: {
			required: "Language is required",
		},
		options: [
			{
				value: "Spanish",
				label: "Spanish",
			},
			{
				value: "English",
				label: "English",
			},
		],
	},
	{
		type: "textInput",
		name: "primary_genre",
		label: "Primary genre",
		rules: {
			required: "Primary genre is required",
		},
	},
	{
		type: "audioFileInput",
		name: "track",
		label: "Track file (FLAC)",
		rules: {
			required: "Track is required",
		},
	},
];
export const optionalWrappedSongFields: WrappedSongFieldType[] = [
	{
		type: "imageFileInput",
		name: "artwork",
		label: "Artwork",
	},
	{
		type: "textInput",
		name: "featuring_artist",
		label: "Featuring Artist",
	},
	{
		type: "numberInput",
		name: "production_year",
		label: "Production year",
	},
	{
		type: "checkboxInput",
		name: "previously_released",
		label: "Previously released",
	},
	{
		type: "textInput",
		name: "producer",
		label: "Producer",
	},
	{
		type: "textInput",
		name: "copyright",
		label: "Copyright",
	},
	{
		type: "textAreaInput",
		name: "lyrics",
		label: "Lyrics",
	},
	{
		type: "textInput",
		name: "isrc",
		label: "ISRC",
	},
	{
		type: "textInput",
		name: "iswc",
		label: "ISWC",
	},
	{
		type: "repeater",
		name: "credits",
		label: "Credits",
		fields: [
			{
				type: "textInput",
				name: "artist",
				label: "Artist",
				rules: {
					required: "Artist is required",
				},
			},
			{
				type: "textInput",
				name: "role",
				label: "Role",
			},
		],
	},
	{
		type: "textInput",
		name: "tiktok_start_time",
		label: "Start time for TikTok",
	},
	{
		type: "textInput",
		name: "recording_location",
		label: "Recording Location",
	},
	{
		type: "textInput",
		name: "upc_ean",
		label: "UPC / EAN Code",
	},
	{
		type: "textInput",
		name: "secondary_genre",
		label: "Secondary Genre",
	},
];
