import { ActionMeta, SingleValue } from "react-select";
import { ReleaseFieldType } from "../types";
import { Option } from "@/components/forms/types";
import { WrappedSongMetadataType } from "../../wrapped-songs/types";
import dspOptions from "./dspOptions.json";

export type ReleaseFieldWithWrappedSongType = Omit<ReleaseFieldType, "options"> & {
	options: {
		label: string;
		value: WrappedSongMetadataType;
	}[];
};

export const requiredReleaseFields: ReleaseFieldType[] = [
	{
		type: "selectInput",
		name: "wrapped_song",
		label: "Wrapped Song",
		rules: {
			required: "A Wrapped Song is required",
		},
		options: [],
		customOnChange: (val: { label: string; value: WrappedSongMetadataType }, { setValue }) => {
			if (val) {
				setValue("artwork", val.value.image);
			}
		},
	},
	{
		type: "imageFileInput",
		name: "artwork",
		label: "Artwork",
		rules: {
			required: "Artwork is required",
		},
	},
	{
		type: "textInput",
		name: "release_date",
		label: "Release date",
		placeholder: "DD/MM/YYYY",
		rules: {
			required: "Release date is required",
			pattern: {
				value: /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[012])\/\d\d\d\d$/,
				message: "Date must be in DD/MM/YYYY format",
			},
			validate: (value) => {
				const [day, month, year] = (value as string).split("/").map(Number);
				const inputDate = new Date(year, month - 1, day);
				const today = new Date();
				today.setHours(0, 0, 0, 0);
				return inputDate > today || "Release date must be in the future";
			},
		},
	},
];

export const optionalReleaseFields: ReleaseFieldType[] = [
	{
		type: "selectInput",
		name: "dsp",
		label: "DSPs",
		rules: {
			required: "You must pick at least one DSP",
		},
		options: dspOptions,
		isMulti: true,
	},
	{
		type: "conditionalTextInput",
		name: "countries_blacklist",
		label: "Test",
		checkbox: {
			label: "Do you want to distribute this release worldwide",
			name: "release_worldwide",
			default: true,
			inversed: true,
		},
		fields: [
			{
				type: "selectInput",
				name: "countries_blacklist",
				label: "What countries do you wish to exlude from the release?",
				options: [
					{ value: "Spain", label: "Spain" },
					{ value: "France", label: "France" },
				],
				isMulti: true,
			},
		],
	},
	{
		type: "selectInput",
		isMulti: false,
		label: "iTunes price",
		name: "itunes_price",
		options: [
			{
				value: "1.99",
				label: "Mini EP: 1.99€",
			},
			{
				value: "2.99",
				label: "EP: 2.99€",
			},
			{
				value: "3.99",
				label: "Mini Album One: 3.99€",
			},
			{
				value: "4.49",
				label: "Mini Album Two: 4.49€",
			},
			{
				value: "4.99",
				label: "Budget One: 4.99€",
			},
			{
				value: "5.99",
				label: "Budget Two: 5.99€",
			},
			{
				value: "6.99",
				label: "Back: 6.99€",
			},
			{
				value: "7.99",
				label: "Mid: 7.99€",
			},
		],
	},
	{
		type: "textInput",
		name: "pre_order_date",
		label: "Pre-order date",
		rules: {
			pattern: {
				value: /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[012])\/\d\d\d\d$/,
				message: "Date must be in DD/MM/YYYY format",
			},
			validate: (value) => {
				const [day, month, year] = (value as string).split("/").map(Number);
				const inputDate = new Date(year, month - 1, day);
				const today = new Date();
				today.setHours(0, 0, 0, 0);
				return inputDate > today || "Release date must be in the future";
			},
		},
	},
	// {
	// 	type: "imageFileInput",
	// 	name: "artwork",
	// 	label: "Artwork",
	// 	rules: {
	// 		required: "Artwork is required",
	// 	},
	// },
	// {
	// 	type: "textInput",
	// 	name: "release_date",
	// 	label: "Release date",
	// 	rules: {
	// 		required: "Release date is required",
	// 	},
	// },
];
