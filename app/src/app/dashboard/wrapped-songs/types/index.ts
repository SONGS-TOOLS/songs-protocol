import {
	Control,
	FieldErrors,
	Path,
	RegisterOptions,
	UseFormRegister,
	UseFormWatch,
} from "react-hook-form";

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
	production_year: number;
	previously_released: boolean;
	producer: string;
	copyright: string;
	lyrics: string;
	isrc: number;
	iswc: string;
	credits: CreditItem[];
}

export interface FormBlockProps {
	className?: string;
	control: Control<WrappedSongFormFields>;
	errors: FieldErrors<WrappedSongFormFields>;
	watch: UseFormWatch<WrappedSongFormFields>;
	register: UseFormRegister<WrappedSongFormFields>;
}

interface BaseFieldType {
	type: "textInput" | "conditionalTextInput" | "textAreaInput" | "numberInput" | "fileInput";
	name: keyof WrappedSongFormFields;
	label: string;
	rules?: Omit<
		RegisterOptions<WrappedSongFormFields, Path<WrappedSongFormFields>>,
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
		name: keyof WrappedSongFormFields;
		label: string;
	};
}

// Combine both types into one using a union
export type FieldType = TextInputFieldType | ConditionalTextInputFieldType;
