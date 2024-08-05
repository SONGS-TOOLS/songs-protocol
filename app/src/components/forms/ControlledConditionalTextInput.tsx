import { Body2, Body3, TextInput } from "@gordo-d/mufi-ui-components";
import { Control, Controller, FieldValues } from "react-hook-form";
import cx from "classnames";
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
	disabled = false,
	...props
}: ControlledConditionalInputProps<T>) => {
	const watchCheckbox = watch(checkboxFieldName); // you can supply default value as second argument
	const condition = inversed ? !watchCheckbox : watchCheckbox;

	return (
		<>
			{/* <label
				htmlFor={checkboxFieldName}
				className="rounded-base focus:ring-primary-blue-400 focus:border-primary-blue-400 block flex w-full gap-4 border-0 border-neutral-300 bg-white py-3 align-middle text-neutral-800 outline-none transition-all"
			>
				<input
					{...register(checkboxFieldName)}
					id={checkboxFieldName}
					type="checkbox"
					defaultChecked={checkboxDefault}
					disabled={checkboxDisabled}
				></input>
				<Body2 color="neutral-600">{checkboxLabel}</Body2>
			</label> */}
			<CheckBoxInput
				label={checkboxLabel}
				// name={checkboxFieldName}
				defaultChecked={checkboxDefault}
				disabled={checkboxDisabled}
				{...register(checkboxFieldName)}
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
				// <Controller
				// 	name={inputName}
				// 	control={control as Control<T>}
				// 	rules={rules}
				// 	render={({ field }) => {
				// 		return (
				// 			<div>
				// 				<TextInput
				// 					label={inputLabel}
				// 					className={cx({ "border-semantic-error": errors[inputName] })}
				// 					required={required}
				// 					{...field}
				// 					{...props}
				// 					onChange={(e) => {
				// 						if (e.target.value) {
				// 							field.onChange(e.target.value);
				// 						}
				// 						if (props.customOnChange) {
				// 							props.customOnChange(e.target.value, { setValue });
				// 						}
				// 					}}
				// 				/>
				// 				{errors[inputName]?.message && (
				// 					<Body3 color="semantic-error">
				// 						{errors[inputName].message as React.ReactNode}
				// 					</Body3>
				// 				)}
				// 			</div>
				// 		);
				// 	}}
				// />
			)}
		</>
	);
};
export default ControlledConditionalTextInput;
