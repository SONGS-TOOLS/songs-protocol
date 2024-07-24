import { Body3, TextAreaInput, TextInput } from "@gordo-d/mufi-ui-components";
import { Controller, FieldValues } from "react-hook-form";
import cx from "classnames";
import { ControlledInputProps } from "./types";

const ControlledTextAreaInput = <T extends FieldValues>({
	control,
	errors,
	rules,
	inputName,
	inputLabel,
}: ControlledInputProps<T>) => {
	return (
		<Controller
			name={inputName}
			control={control}
			rules={rules}
			render={({ field }) => {
				return (
					<div>
						<TextAreaInput
							label={inputLabel}
							className={cx({ "border-semantic-error": errors[inputName] })}
							{...field}
						/>
						{errors[inputName] && (
							<Body3 color="semantic-error">{errors[inputName].message as React.ReactNode}</Body3>
						)}
					</div>
				);
			}}
		/>
	);
};
export default ControlledTextAreaInput;
