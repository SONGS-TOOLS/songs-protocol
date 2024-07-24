import {
	Control,
	FieldErrors,
	FieldValues,
	Path,
	RegisterOptions,
	UseFormRegister,
	UseFormWatch,
} from "react-hook-form";

export interface ControlledInputProps<T extends FieldValues> {
	control: Control<T, any>;
	errors: FieldErrors<T>;
	rules?: Omit<
		RegisterOptions<T, Path<T>>,
		"valueAsNumber" | "valueAsDate" | "setValueAs" | "disabled"
	>;
	inputName: Path<T>;
	inputLabel: string;
}

export interface ControlledConditionalInputProps<T extends FieldValues> {
	control: Control<T>;
	errors: FieldErrors<T>;
	watch: UseFormWatch<T>;
	register: UseFormRegister<T>;
	rules?: Omit<
		RegisterOptions<T, Path<T>>,
		"valueAsNumber" | "valueAsDate" | "setValueAs" | "disabled"
	>;
	checkboxFieldName: Path<T>;
	checkboxLabel: string;
	inputName: Path<T>;
	inputLabel: string;
}

export interface ControlledImageFileInputProps<T extends FieldValues> {
	control: Control<T>;
	errors: FieldErrors<T>;
	watch: UseFormWatch<T>;
	rules?: Omit<
		RegisterOptions<T, Path<T>>,
		"valueAsNumber" | "valueAsDate" | "setValueAs" | "disabled"
	>;
	inputName: Path<T>;
	inputLabel: string;
	defaultImageSrc?: string;
	rounded?: boolean;
}
