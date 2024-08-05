import { Body3, TextInput } from "@gordo-d/mufi-ui-components";
import { Controller, FieldValues } from "react-hook-form";
import cx from "classnames";
import { ControlledInputProps, ControlledSelectInputProps, Option } from "./types";
import NumberInput from "./inputs/NumberInput";
import SelectInput from "./inputs/SelectInput";
import { MultiValue, SingleValue } from "react-select";

function isMultiValue(
	value: SingleValue<Option> | MultiValue<Option>,
	isMulti: boolean,
): value is MultiValue<Option> {
	return isMulti;
}

const ControlledSelectInput = <T extends FieldValues>({
	control,
	errors,
	rules,
	inputName,
	inputLabel,
	required = false,
	options,
	setValue,
	customOnChange,
	isMulti = false,
	...props
}: ControlledSelectInputProps<T>) => {
	return (
		<Controller
			name={inputName}
			control={control}
			rules={rules}
			render={({ field }) => {
				return (
					<div className="flex-1">
						<SelectInput
							label={inputLabel}
							className={cx({ "border-semantic-error": errors[inputName] })}
							options={options}
							required={required}
							disabled={field.disabled || false}
							isMulti={isMulti}
							{...field}
							{...props}
							value={field.value}
							onChange={(val) => {
								// if (!isMulti) {
								// 	if (val) {
								// 		field.onChange(val.value);
								// 	}
								// 	if (customOnChange) {
								// 		customOnChange(val, { setValue });
								// 	}
								// }
								if (isMultiValue(val, isMulti)) {
									const values = val.map((option) => option.value);

									field.onChange(val);
									if (customOnChange) {
										customOnChange(val, { setValue });
									}
								} else {
									field.onChange(val?.value ?? null);
									if (customOnChange) {
										customOnChange(val, { setValue });
									}
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
