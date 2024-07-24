import { CreditItem, WrappedSongFieldType } from "../types";
import roleOptions from "./rolesOptions.json";
import languageOptions from "./languageOptions.json";
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
		options: languageOptions,
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
				type: "selectInput",
				name: "role",
				label: "Role",
				options: roleOptions,
			},
		],
	},
	{
		type: "minutesSecondsInput",
		name: "tiktok_start_time",
		label: "Start time for TikTok",
		placeholder: "00:00",
		rules: {
			pattern: {
				value: /^([0-9][0-9]):([0-9][0-9])$/,
				message: "Start time must be in the format MM:SS (e.g., 01:30)",
			},
			validate: (value: string | boolean | File | CreditItem | CreditItem[], formValues) => {
				if (typeof value !== "string") return true;
				if (value === "") return true;
				const [minutes, seconds] = value.split(":").map(Number);
				if (isNaN(minutes) || isNaN(seconds) || minutes >= 60 || seconds >= 60) {
					return "Minutes and seconds must be less than 60";
				}
				// const trackDuration = formValues.track_duration;
				// console.log(formValues);
				// const [trackMinutes, trackSeconds] = trackDuration.split(":").map(Number);
				// const startTimeInSeconds = minutes * 60 + seconds;
				// const trackDurationInSeconds = trackMinutes * 60 + trackSeconds;
				// console.log("TRACK DURATION IN SECONDS", trackDurationInSeconds);
				// console.log("Start time in seconds", startTimeInSeconds);
				// if (startTimeInSeconds >= trackDurationInSeconds) {
				// 	return "Start time cannot be greater than or equal to track duration";
				// }
				return true;
			},
		},
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
