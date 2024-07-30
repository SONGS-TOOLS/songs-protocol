import { Body3, TextInput } from "@gordo-d/mufi-ui-components";
import { Controller, FieldValues } from "react-hook-form";
import cx from "classnames";
import { ControlledInputProps, ControlledSelectInputProps } from "./types";
import NumberInput from "./inputs/NumberInput";
import SelectInput from "./inputs/SelectInput";

const ControlledSelectInput = <T extends FieldValues>({
	control,
	errors,
	rules,
	inputName,
	inputLabel,
	required = false,
	options,
}: ControlledSelectInputProps<T>) => {
	return (
		<Controller
			name={inputName}
			control={control}
			rules={rules}
			render={({ field }) => {
				return (
					<div>
						{/* <NumberInput
							label={inputLabel}
							className={cx({ "border-semantic-error": errors[inputName] })}
							required={required}
							{...field}
						/> */}
						<SelectInput
							label={inputLabel}
							className={cx({ "border-semantic-error": errors[inputName] })}
							options={options}
							required={required}
							disabled={field.disabled || false}
							{...field}
							onChange={(val) => {
								if (val) {
									field.onChange(val.value);
								}
							}}
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
export default ControlledSelectInput;
