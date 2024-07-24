import { ArtistFieldType } from "@/app/dashboard/artists/types";
import ControlledConditionalTextInput from "./ControlledConditionalTextInput";
import ControlledFileInput from "./ControlledFileInput";
import ControlledNumberInput from "./ControlledNumberInput";
import ControlledTextInput from "./ControlledTextInput";
import { WrappedSongFieldType } from "@/app/dashboard/wrapped-songs/types";
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
import ControlledTextAreaInput from "./ControlledTextAreaInput";
import ControlledSelectInput from "./ControlledSelectInput";
import ControlledAudioInput from "./ControlledAudioInput";
import ControlledCheckboxInput from "./ControlledCheckboxInput";
import ControlledRepeaterInput from "./ControlledRepeaterInput";
import ControlledMinutesSecondsInput from "./ControlledMinutesSecondsInput";
import { ReleaseFieldType } from "@/app/dashboard/releases/types";

export type FieldType = ArtistFieldType | WrappedSongFieldType | ReleaseFieldType;

interface ControlledInputsProps<T extends FieldValues> {
	fields: (FieldType & {
		// name: keyof T;
		rules?: Omit<
			RegisterOptions<T, Path<T>>,
			"valueAsNumber" | "valueAsDate" | "setValueAs" | "disabled"
		>;
		customOnChange?: (event: any, helpers: { setValue: UseFormSetValue<T> }) => void;
	})[];
	control: Control<T>;
	errors: FieldErrors<T>;
	watch: UseFormWatch<T>;
	register: UseFormRegister<T>;
	setValue: UseFormSetValue<T>;
}

const ControlledInputs = <T extends FieldValues>({
	fields,
	control,
	errors,
	watch,
	register,
	setValue,
	...props
}: ControlledInputsProps<T>) => {
	return (
		<>
			{fields.map((field) => {
				if (field.type === "textInput") {
					return (
						<ControlledTextInput<T>
							key={field.name}
							control={control}
							setValue={setValue}
							errors={errors}
							inputName={field.name as Path<T>}
							inputLabel={field.label}
							rules={field.rules}
							placeholder={field.placeholder}
							disabled={field.disabled}
							{...props}
						/>
					);
				} else if (field.type === "numberInput") {
					return (
						<ControlledNumberInput<T>
							key={field.name}
							control={control}
							setValue={setValue}
							errors={errors}
							inputName={field.name as Path<T>}
							inputLabel={field.label}
							rules={field.rules}
							placeholder={field.placeholder}
							disabled={field.disabled}
							{...props}
						/>
					);
				} else if (field.type === "minutesSecondsInput") {
					return (
						<ControlledMinutesSecondsInput<T>
							key={field.name}
							control={control}
							setValue={setValue}
							errors={errors}
							inputName={field.name as Path<T>}
							inputLabel={field.label}
							rules={field.rules}
							placeholder={field.placeholder}
							disabled={field.disabled}
							{...props}
						/>
					);
				} else if (field.type === "imageFileInput") {
					return (
						<ControlledFileInput<T>
							key={field.name}
							control={control}
							setValue={setValue}
							errors={errors}
							inputName={field.name as Path<T>}
							inputLabel={field.label}
							rules={field.rules}
							watch={watch}
							rounded={field.rounded}
							defaultImageSrc={field.defaultImageSrc ?? undefined}
							placeholder={field.placeholder}
							disabled={field.disabled}
							{...props}
						/>
					);
				} else if (field.type === "textAreaInput") {
					return (
						<ControlledTextAreaInput<T>
							key={field.name}
							control={control}
							setValue={setValue}
							errors={errors}
							inputName={field.name as Path<T>}
							inputLabel={field.label}
							rules={field.rules}
							placeholder={field.placeholder}
							disabled={field.disabled}
							{...props}
						/>
					);
				} else if (field.type === "repeater") {
					return (
						<ControlledRepeaterInput<T>
							key={field.name}
							control={control}
							setValue={setValue}
							errors={errors}
							inputName={field.name as Path<T>}
							inputLabel={field.label}
							rules={field.rules}
							subfields={field.fields as any}
							register={register}
							watch={watch}
							placeholder={field.placeholder}
							// disabled={field.disabled}
							{...props}
						/>
					);
				} else if (field.type === "selectInput") {
					return (
						<ControlledSelectInput<T>
							{...field}
							key={field.name}
							control={control}
							setValue={setValue}
							errors={errors}
							inputName={field.name as Path<T>}
							inputLabel={field.label}
							rules={field.rules}
							options={field.options}
							placeholder={field.placeholder}
							disabled={field.disabled}
							isMulti={field.isMulti}
							{...props}
						/>
					);
				} else if (field.type === "audioFileInput") {
					return (
						<ControlledAudioInput<T>
							key={field.name}
							control={control}
							setValue={setValue}
							errors={errors}
							inputName={field.name as Path<T>}
							inputLabel={field.label}
							rules={field.rules}
							watch={watch}
							placeholder={field.placeholder}
							disabled={field.disabled}
							{...props}
						/>
					);
				} else if (field.type === "checkboxInput") {
					return (
						<ControlledCheckboxInput<T>
							key={field.name}
							control={control}
							setValue={setValue}
							errors={errors}
							inputName={field.name as Path<T>}
							inputLabel={field.label}
							rules={field.rules}
							placeholder={field.placeholder}
							disabled={field.disabled}
							{...props}
						/>
					);
				} else if (field.type === "conditionalTextInput") {
					return (
						<ControlledConditionalTextInput<T>
							key={field.name}
							control={control}
							setValue={setValue}
							errors={errors}
							inputName={field.name as Path<T>}
							inputLabel={field.label}
							watch={watch}
							register={register}
							checkboxFieldName={field.checkbox?.name as Path<T>}
							checkboxLabel={field.checkbox?.label}
							rules={field.rules}
							placeholder={field.placeholder}
							checkboxDefault={field.checkbox.default}
							checkboxDisabled={field.checkbox.disabled}
							subfields={field.fields as any}
							inversed={field.checkbox.inversed}
							disabled={field.disabled}
							{...props}
						/>
					);
				}
			})}
		</>
	);
};
export default ControlledInputs;
