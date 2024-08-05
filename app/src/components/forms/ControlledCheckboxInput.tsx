import { Body3 } from "@gordo-d/mufi-ui-components";
import { Controller, FieldValues } from "react-hook-form";
import cx from "classnames";
import { ControlledInputProps } from "./types";
import CheckBoxInput from "./inputs/CheckboxInput";

const ControlledCheckboxInput = <T extends FieldValues>({
	control,
	errors,
	rules,
	inputName,
	inputLabel,
	required = false,
	setValue,

	...props
}: ControlledInputProps<T>) => {
	return (
		<Controller
			name={inputName}
			control={control}
			rules={rules}
			render={({ field }) => {
				return (
					<div>
						<CheckBoxInput
							label={inputLabel}
							className={cx({ "border-semantic-error": errors[inputName] })}
							required={required}
							{...field}
							{...props}
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
export default ControlledCheckboxInput;
