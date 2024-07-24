import { Card, Headline4 } from "@gordo-d/mufi-ui-components";
import { FormBlockProps } from "./types";
import ControlledInputs, { FieldType } from "./ControlledInputs";
import { ReleaseFieldType } from "@/app/dashboard/releases/types";
import { WrappedSongFieldType } from "@/app/dashboard/wrapped-songs/types";
import { ArtistFieldType } from "@/app/dashboard/artists/types";
import { FieldValues, Path, RegisterOptions, UseFormSetValue } from "react-hook-form";

interface FormWithControlledInputsProps<T extends FieldValues> extends FormBlockProps<T> {
	fields: (FieldType & {
		// name: keyof T;
		rules?: Omit<
			RegisterOptions<T, Path<T>>,
			"valueAsNumber" | "valueAsDate" | "setValueAs" | "disabled"
		>;
		customOnChange?: (event: any, helpers: { setValue: UseFormSetValue<T> }) => void;
	})[];
}

const FormWithControlledInputs = <T extends FieldValues>({
	className,
	control,
	register,
	errors,
	watch,
	setValue,
	fields,
}: FormWithControlledInputsProps<T>) => {
	return (
		<Card className={`max-w-2xl ${className}`}>
			<Headline4>Required information</Headline4>
			<div className="my-4 grid grid-flow-row gap-4">
				<ControlledInputs
					fields={fields}
					control={control}
					register={register}
					errors={errors}
					watch={watch}
					setValue={setValue}
				/>
			</div>
		</Card>
	);
};
export default FormWithControlledInputs;
