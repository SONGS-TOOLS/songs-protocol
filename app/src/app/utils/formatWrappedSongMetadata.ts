import {
	AttributeType,
	WrappedSongAttributes,
	WrappedSongFormFields,
	WrappedSongMetadataType,
} from "../dashboard/wrapped-songs/types";
type HumanReadableMap = {
	[K in keyof WrappedSongAttributes]:
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
};
export const formatWrappedSongFieldsToMetadata = (formdata: WrappedSongFormFields) => {
	const metadata: WrappedSongMetadataType = {
		name: "",
		description: "",
		external_url: "",
		image: "",
		animation_url: "",
		attributes: [],
	};
	const attribute_keys: (keyof WrappedSongAttributes)[] = [
		"main_artist",
		"language",
		"primary_genre",
		"featuring_artist",
		"production_year",
		"previously_released",
		"producer",
		"copyright",
		"lyrics",
		"isrc",
		"iswc",
		"credits",
		"tiktok_start_time",
		"recording_location",
		"upc_ean",
		"secondary_genre",
		"track_duration",
	];
	const human_readable: HumanReadableMap = {
		main_artist: "Main artist",
		language: "Language",
		primary_genre: "Primary genre",
		featuring_artist: "Featuring artist",
		production_year: "Production year",
		previously_released: "Previously released",
		producer: "Producer",
		copyright: "Copyright",
		lyrics: "Lyrics",
		isrc: "ISRC",
		iswc: "ISWC",
		credits: "Credit 0",
		tiktok_start_time: "TikTok start time",
		recording_location: "Recording location",
		upc_ean: "UPC / EAN Code",
		secondary_genre: "Secondary genre",
		track_duration: "Track duration",
	};
	metadata.name = formdata.release_title;
	metadata.description = formdata.description ?? "";
	metadata.external_url = `https://app.songs-tools.com/wrapped-songs/${formdata.release_title}`;
	metadata.image = formdata.artwork;
	if (typeof formdata.track === "string") {
		metadata.animation_url = formdata.track;
	}

	attribute_keys.forEach((attribute_key) => {
		if (attribute_key === "credits") {
			if (formdata[attribute_key].length) {
				const credits: AttributeType[] = formdata[attribute_key].map((credit, index) => ({
					trait_type: `Credit ${index}`,
					value: `Artist: ${credit.artist} - Role: ${credit.role}`,
				}));
				metadata.attributes.push(...credits);
			}
		} else {
			if (formdata[attribute_key] !== undefined) {
				metadata.attributes.push({
					trait_type: human_readable[attribute_key],
					value: formdata[attribute_key],
				});
			}
		}
	});
	return metadata;
};

function extractArtistAndRole(input: string): { artist: string; role: string } {
	const [artistPart, rolePart] = input.split(" - ");
	const artist = artistPart.replace("Artist: ", "").trim();
	const role = rolePart.replace("Role: ", "").trim();
	return { artist, role };
}

export const formatMetadataToWrappedSongFields = (metadata: WrappedSongMetadataType) => {
	const formfields: WrappedSongFormFields = {
		main_artist: "",
		release_title: "",
		language: "",
		primary_genre: "",
		track: "",
		artwork: "",
		featuring_artist: "",
		production_year: "",
		previously_released: false,
		producer: "",
		copyright: "",
		lyrics: "",
		isrc: "",
		iswc: "",
		credits: [],
		tiktok_start_time: "",
		description: "",
		recording_location: "",
		upc_ean: "",
		secondary_genre: "",
		track_duration: "",
	};

	const invertedHumanReadable = {
		"Main artist": "main_artist",
		Language: "language",
		"Primary genre": "primary_genre",
		"Featuring artist": "featuring_artist",
		"Production year": "production_year",
		"Previously released": "previously_released",
		Producer: "producer",
		Copyright: "copyright",
		Lyrics: "lyrics",
		ISRC: "isrc",
		ISWC: "iswc",
		"Credit 0": "credits",
		"TikTok start time": "tiktok_start_time",
		"Recording location": "recording_location",
		"UPC / EAN Code": "upc_ean",
		"Secondary genre": "secondary_genre",
	} as const;
	type HumanReadableKey = keyof typeof invertedHumanReadable;

	formfields.release_title = metadata.name;
	formfields.artwork = metadata.image;
	formfields.track = metadata.animation_url;
	formfields.description = metadata.description;

	metadata.attributes.forEach((attribute) => {
		const traitType = attribute.trait_type as HumanReadableKey;
		const key = invertedHumanReadable[traitType] as keyof WrappedSongFormFields;
		console.log(key);
		if (!attribute.trait_type.includes("Credit") && key in formfields) {
			(formfields[key] as any) = attribute.value;
		} else {
			console.log(attribute.value);
			const { artist, role } = extractArtistAndRole(attribute.value as string);
			formfields.credits.push({
				artist,
				role,
			});
		}
	});
	return formfields;
};
