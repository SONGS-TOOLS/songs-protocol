import { Body2, Body3, TextInput } from "@gordo-d/mufi-ui-components";
import { Control, Controller, FieldValues } from "react-hook-form";
import cx from "classnames";
import { ControlledConditionalInputProps } from "./types";

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
}: ControlledConditionalInputProps<T>) => {
	const watchCheckbox = watch(checkboxFieldName); // you can supply default value as second argument

	return (
		<>
			<label htmlFor={checkboxFieldName} className="flex gap-4 align-middle">
				<input {...register(checkboxFieldName)} id={checkboxFieldName} type="checkbox"></input>
				<Body2 color="neutral-600">{checkboxLabel}</Body2>
			</label>
			{watchCheckbox && (
				<Controller
					name={inputName}
					control={control as Control<T>}
					rules={rules}
					render={({ field }) => {
						return (
							<div>
								<TextInput
									label={inputLabel}
									className={cx({ "border-semantic-error": errors[inputName] })}
									{...field}
								/>
								{errors[inputName]?.message && (
									<Body3 color="semantic-error">
										{errors[inputName].message as React.ReactNode}
									</Body3>
								)}
							</div>
						);
					}}
				/>
			)}
		</>
	);
};
export default ControlledConditionalTextInput;
