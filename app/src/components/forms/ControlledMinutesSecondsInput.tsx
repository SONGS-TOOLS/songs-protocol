import { Body3, TextInput } from "@gordo-d/mufi-ui-components";
import { Controller, ControllerRenderProps, FieldValues } from "react-hook-form";
import cx from "classnames";
import { ControlledInputProps } from "./types";
import { useState } from "react";
const ControlledMinutesSecondsInput = <T extends FieldValues>({
	control,
	errors,
	rules,
	inputName,
	inputLabel,
	required = false,
	className,
	setValue,
	...props
}: ControlledInputProps<T>) => {
	const [rawInput, setRawInput] = useState("");

	const formatTime = (value: string): string => {
		const cleanedInput = value.replace(/[^\d:]/g, "");

		if (cleanedInput.includes(":")) {
			const [minutes, seconds] = cleanedInput.split(":");
			return `${minutes.slice(0, 2)}:${seconds.slice(0, 2)}`;
		} else {
			const digitsOnly = cleanedInput.replace(/\D/g, "");
			if (digitsOnly.length <= 2) {
				return digitsOnly;
			} else {
				const minutes = digitsOnly.slice(0, 2);
				const seconds = digitsOnly.slice(2, 4);
				return `${minutes}:${seconds}`;
			}
		}
	};

	const handleInputChange = (
		e: React.ChangeEvent<HTMLInputElement>,
		field: ControllerRenderProps<T>,
	) => {
		let newInput = e.target.value;
		const lastChar = newInput.slice(-1);

		if (lastChar === ":" && rawInput.length === 2) {
			newInput = rawInput + ":";
		} else {
			newInput = newInput.replace(/[^\d:]/g, "");
			if (newInput.length === 3 && !newInput.includes(":")) {
				newInput = newInput.slice(0, 2) + ":" + newInput.slice(2);
			}
		}

		setRawInput(newInput);
		field.onChange(formatTime(newInput));
	};
	return (
		<Controller
			name={inputName}
			control={control}
			rules={rules}
			render={({ field }) => {
				return (
					<div className={className}>
						<TextInput
							label={inputLabel}
							className={cx({ "border-semantic-error": errors[inputName] })}
							required={required}
							{...field}
							value={formatTime(rawInput)}
							onChange={(e) => {
								handleInputChange(e, field);
								if (props.customOnChange) {
									props.customOnChange(e.target.value, { setValue });
								}
							}}
							onBlur={() => {
								const formattedValue = formatTime(rawInput);
								setRawInput(formattedValue);
								field.onChange(formattedValue);
								field.onBlur();
							}}
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
export default ControlledMinutesSecondsInput;
