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
	UseFormWatch,
} from "react-hook-form";
import ControlledTextAreaInput from "./ControlledTextAreaInput";
import ControlledSelectInput from "./ControlledSelectInput";
import ControlledAudioInput from "./ControlledAudioInput";
import ControlledCheckboxInput from "./ControlledCheckboxInput";
import ControlledRepeaterInput from "./ControlledRepeaterInput";

type FieldType = ArtistFieldType | WrappedSongFieldType;

interface ControlledInputsProps<T extends FieldValues> {
	fields: (FieldType & {
		// name: keyof T;
		rules?: Omit<
			RegisterOptions<T, Path<T>>,
			"valueAsNumber" | "valueAsDate" | "setValueAs" | "disabled"
		>;
	})[];
	control: Control<T>;
	errors: FieldErrors<T>;
	watch: UseFormWatch<T>;
	register: UseFormRegister<T>;
}

const ControlledInputs = <T extends FieldValues>({
	fields,
	control,
	errors,
	watch,
	register,
}: ControlledInputsProps<T>) => {
	return (
		<>
			{fields.map((field) => {
				if (field.type === "textInput") {
					return (
						<ControlledTextInput<T>
							key={field.name}
							control={control}
							errors={errors}
							inputName={field.name as Path<T>}
							inputLabel={field.label}
							rules={field.rules}
						/>
					);
				} else if (field.type === "numberInput") {
					return (
						<ControlledNumberInput<T>
							key={field.name}
							control={control}
							errors={errors}
							inputName={field.name as Path<T>}
							inputLabel={field.label}
							rules={field.rules}
						/>
					);
				} else if (field.type === "imageFileInput") {
					return (
						<ControlledFileInput<T>
							key={field.name}
							control={control}
							errors={errors}
							inputName={field.name as Path<T>}
							inputLabel={field.label}
							rules={field.rules}
							watch={watch}
							rounded={field.rounded}
							defaultImageSrc={field.defaultImageSrc ?? undefined}
						/>
					);
				} else if (field.type === "textAreaInput") {
					return (
						<ControlledTextAreaInput<T>
							key={field.name}
							control={control}
							errors={errors}
							inputName={field.name as Path<T>}
							inputLabel={field.label}
							rules={field.rules}
						/>
					);
				} else if (field.type === "repeater") {
					return (
						<ControlledRepeaterInput<T>
							key={field.name}
							control={control}
							errors={errors}
							inputName={field.name as Path<T>}
							inputLabel={field.label}
							rules={field.rules}
							subfields={field.fields}
						/>
					);
				} else if (field.type === "selectInput") {
					return (
						<ControlledSelectInput<T>
							key={field.name}
							control={control}
							errors={errors}
							inputName={field.name as Path<T>}
							inputLabel={field.label}
							rules={field.rules}
							options={field.options}
						/>
					);
				} else if (field.type === "audioFileInput") {
					return (
						<ControlledAudioInput<T>
							key={field.name}
							control={control}
							errors={errors}
							inputName={field.name as Path<T>}
							inputLabel={field.label}
							rules={field.rules}
							watch={watch}
						/>
					);
				} else if (field.type === "checkboxInput") {
					return (
						<ControlledCheckboxInput<T>
							key={field.name}
							control={control}
							errors={errors}
							inputName={field.name as Path<T>}
							inputLabel={field.label}
							rules={field.rules}
						/>
					);
				} else if (field.type === "conditionalTextInput") {
					return (
						<ControlledConditionalTextInput<T>
							key={field.name}
							control={control}
							errors={errors}
							inputName={field.name as Path<T>}
							inputLabel={field.label}
							watch={watch}
							register={register}
							checkboxFieldName={field.checkbox?.name as Path<T>}
							checkboxLabel={field.checkbox?.label}
							rules={field.rules}
						/>
					);
				}
			})}
		</>
	);
};
export default ControlledInputs;
