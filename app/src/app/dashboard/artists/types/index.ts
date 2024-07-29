import {
	Control,
	FieldErrors,
	Path,
	RegisterOptions,
	UseFormRegister,
	UseFormWatch,
} from "react-hook-form";

export interface ArtistFields {
	name: string;
	email: string;
	has_spotify_link: boolean;
	has_apple_music_link: boolean;
	spotify: string;
	apple_music: string;
	profile_picture?: string;
	bio?: string;
	pro_number?: number;
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

export interface FormBlockProps {
	className?: string;
	control: Control<ArtistFields>;
	errors: FieldErrors<ArtistFields>;
	watch: UseFormWatch<ArtistFields>;
	register: UseFormRegister<ArtistFields>;
}

interface BaseFieldType {
	type: "textInput" | "conditionalTextInput" | "textAreaInput" | "numberInput" | "fileInput";
	name: keyof ArtistFields;
	label: string;
	rules?: Omit<
		RegisterOptions<ArtistFields, Path<ArtistFields>>,
		"valueAsNumber" | "valueAsDate" | "setValueAs" | "disabled"
	>;
}

// Define the type when `type` is `"textInput"`
interface TextInputFieldType extends BaseFieldType {
	type: "textInput" | "textAreaInput" | "numberInput" | "fileInput";
	checkbox?: never; // Ensure `checkbox` is not allowed here
}

// Define the type when `type` is `"conditionalTextInput"`
interface ConditionalTextInputFieldType extends BaseFieldType {
	type: "conditionalTextInput";
	checkbox: {
		name: keyof ArtistFields;
		label: string;
	};
}

// Combine both types into one using a union
export type FieldType = TextInputFieldType | ConditionalTextInputFieldType;
