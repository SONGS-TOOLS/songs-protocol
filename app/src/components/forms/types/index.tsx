import {
	Control,
	FieldErrors,
	FieldValues,
	Path,
	RegisterOptions,
	UseFormRegister,
	UseFormWatch,
} from "react-hook-form";

export interface Option {
	label: string;
	value: string;
}

interface BaseControlledInputProps<T extends FieldValues> {
	control: Control<T>;
	errors: FieldErrors<T>;
	rules?: Omit<
		RegisterOptions<T, Path<T>>,
		"valueAsNumber" | "valueAsDate" | "setValueAs" | "disabled"
	>;
	inputName: Path<T>;
	inputLabel: string;
	required?: boolean;
	className?: string;
}

export interface ControlledInputProps<T extends FieldValues> extends BaseControlledInputProps<T> {}

export interface ControlledConditionalInputProps<T extends FieldValues>
	extends BaseControlledInputProps<T> {
	watch: UseFormWatch<T>;
	register: UseFormRegister<T>;
	checkboxFieldName: Path<T>;
	checkboxLabel: string;
}

export interface ControlledImageFileInputProps<T extends FieldValues>
	extends BaseControlledInputProps<T> {
	watch: UseFormWatch<T>;
	defaultImageSrc?: string;
	rounded?: boolean;
}

export interface ControlledSelectInputProps<T extends FieldValues>
	extends BaseControlledInputProps<T> {
	options: Option[];
}
export interface ControlledRepeaterInputProps<T extends FieldValues>
	extends BaseControlledInputProps<T> {
	subfields: RepeaterSubfieldType[];
	// field: Extract<T, { type: "repeater" }>;
}

export interface FormBlockProps<T extends FieldValues> {
	className?: string;
	control: Control<T>;
	errors: FieldErrors<T>;
	watch: UseFormWatch<T>;
	register: UseFormRegister<T>;
}

export interface BaseFieldType<T extends FieldValues> {
	type:
		| "textInput"
		| "conditionalTextInput"
		| "textAreaInput"
		| "numberInput"
		| "imageFileInput"
		| "audioFileInput"
		| "selectInput"
		| "checkboxInput"
		| "repeater";
	name: keyof T;
	label: string;
	rules?: Omit<
		RegisterOptions<T, Path<T>>,
		"valueAsNumber" | "valueAsDate" | "setValueAs" | "disabled"
	>;
}

interface RepeaterSubfieldType extends FieldValues {
	type:
		| "textInput"
		| "conditionalTextInput"
		| "textAreaInput"
		| "numberInput"
		| "imageFileInput"
		| "audioFileInput"
		| "selectInput"
		| "checkboxInput"
		| "repeater";
	name: string;
	label: string;
	// rules?: Omit<
	// 	RegisterOptions<T, Path<T>>,
	// 	"valueAsNumber" | "valueAsDate" | "setValueAs" | "disabled"
	// >;
}

interface TextInputFieldType<T extends FieldValues> extends BaseFieldType<T> {
	type: "textInput" | "textAreaInput" | "numberInput" | "audioFileInput" | "checkboxInput";
	checkbox?: never;
}

interface RepeaterFieldType<T extends FieldValues> extends BaseFieldType<T> {
	type: "repeater";
	checkbox?: never;
	fields: RepeaterSubfieldType[];
}

interface SelectInputFieldType<T extends FieldValues> extends BaseFieldType<T> {
	type: "selectInput";
	checkbox?: never;
	options: Option[];
}
interface ImageFileInputFieldType<T extends FieldValues> extends BaseFieldType<T> {
	type: "imageFileInput";
	checkbox?: never;
	defaultImageSrc?: string;
	rounded?: boolean;
}

interface ConditionalTextInputFieldType<T extends FieldValues> extends BaseFieldType<T> {
	type: "conditionalTextInput";
	checkbox: {
		name: keyof T;
		label: string;
	};
}

export type FormFieldType<T extends FieldValues> =
	| TextInputFieldType<T>
	| ConditionalTextInputFieldType<T>
	| SelectInputFieldType<T>
	| ImageFileInputFieldType<T>
	| RepeaterFieldType<T>;
