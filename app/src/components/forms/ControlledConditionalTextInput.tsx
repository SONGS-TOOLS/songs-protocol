import { FieldValues } from "react-hook-form";
import { ControlledConditionalInputProps } from "./types";
import ControlledInputs from "./ControlledInputs";
import CheckBoxInput from "./inputs/CheckboxInput";

const ControlledConditionalTextInput = <T extends FieldValues>({
	checkboxFieldName,
	watch,
	control,
	errors,
	register,
	checkboxLabel,
	inputName,
	rules,
	inputLabel,
	required = false,
	setValue,
	checkboxDefault = false,
	subfields,
	inversed = false,
	checkboxDisabled = false,
	checkboxTooltip,
	disabled = false,
	...props
}: ControlledConditionalInputProps<T>) => {
	const watchCheckbox = watch(checkboxFieldName); // you can supply default value as second argument
	const condition = inversed ? !watchCheckbox : watchCheckbox;

	return (
		<>
			<CheckBoxInput
				label={checkboxLabel}
				defaultChecked={checkboxDefault}
				disabled={checkboxDisabled}
				{...register(checkboxFieldName)}
				tooltip={checkboxTooltip}
			/>
			{condition && (
				<ControlledInputs
					//@ts-expect-error
					fields={subfields}
					control={control}
					register={register}
					errors={errors}
					watch={watch}
					setValue={setValue}
				/>
			)}
		</>
	);
};
export default ControlledConditionalTextInput;
