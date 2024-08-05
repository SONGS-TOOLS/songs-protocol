import { WrappedSongMetadataType } from "@/app/dashboard/wrapped-songs/types";
import {
	Control,
	FieldErrors,
	FieldValues,
	Path,
	RegisterOptions,
	UseFormRegister,
	UseFormSetValue,
	UseFormWatch,
} from "react-hook-form";
import { ActionMeta, MultiValue, SingleValue } from "react-select";

export interface Option {
	label: string;
	value: string | WrappedSongMetadataType;
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
	disabled?: boolean;
	className?: string;
	placeholder?: string;
	setValue: UseFormSetValue<T>;
	customOnChange?: (
		event: any,
		helpers: {
			setValue: UseFormSetValue<T>;
		},
	) => void;
}

export interface ControlledInputProps<T extends FieldValues> extends BaseControlledInputProps<T> {}

export interface ControlledConditionalInputProps<T extends FieldValues>
	extends BaseControlledInputProps<T> {
	watch: UseFormWatch<T>;
	register: UseFormRegister<T>;
	checkboxFieldName: Path<T>;
	checkboxLabel: string;
	checkboxDefault?: boolean;
	checkboxDisabled?: boolean;
	inversed?: boolean;
	subfields: FormFieldType<T>[];
	checkboxTooltip?: string;
}

export interface ControlledImageFileInputProps<T extends FieldValues>
	extends BaseControlledInputProps<T> {
	watch: UseFormWatch<T>;
	defaultImageSrc?: string;
	rounded?: boolean;
}

export interface ControlledSelectInputProps<T extends FieldValues, IsMulti extends boolean = false>
	extends Omit<ControlledInputProps<T>, "onChange"> {
	options: Option[];
	isMulti?: boolean;
	onChange?: IsMulti extends true
		? (newValue: MultiValue<Option>, actionMeta: ActionMeta<Option>) => void
		: (newValue: SingleValue<Option>, actionMeta: ActionMeta<Option>) => void;
}

export interface ControlledRepeaterInputProps<T extends FieldValues>
	extends BaseControlledInputProps<T> {
	subfields: FormFieldType<T>[];
	register: UseFormRegister<T>;
	watch: UseFormWatch<T>;
}

export interface FormBlockProps<T extends FieldValues> {
	className?: string;
	control: Control<T>;
	errors: FieldErrors<T>;
	watch: UseFormWatch<T>;
	register: UseFormRegister<T>;
	setValue: UseFormSetValue<T>;
	headline: string;
}

export interface BaseFieldType<T extends FieldValues> {
	type: string;
	name: keyof T;
	label: string;
	placeholder?: string;
	disabled?: boolean;
	tooltip?: string;
	customOnChange?: (
		event: any,
		helpers: {
			setValue: UseFormSetValue<T>;
		},
	) => void;
	rules?: Omit<
		RegisterOptions<T, Path<T>>,
		"valueAsNumber" | "valueAsDate" | "setValueAs" | "disabled"
	>;
}

export type FormFieldType<T extends FieldValues> =
	| (BaseFieldType<T> & {
			type:
				| "textInput"
				| "textAreaInput"
				| "numberInput"
				| "audioFileInput"
				| "checkboxInput"
				| "minutesSecondsInput";
	  })
	| (BaseFieldType<T> & {
			type: "conditionalTextInput";
			checkbox: {
				name: keyof T;
				label: string;
				default?: boolean;
				inversed?: boolean;
				disabled?: boolean;
				tooltip?: string;
			};
			fields: FormFieldType<T>[];
	  })
	| (BaseFieldType<T> & {
			type: "selectInput";
			options: Option[];
			isMulti?: boolean;
	  })
	| (BaseFieldType<T> & { type: "imageFileInput"; defaultImageSrc?: string; rounded?: boolean })
	| (BaseFieldType<T> & { type: "repeater"; fields: FormFieldType<T>[]; disabled: boolean });
