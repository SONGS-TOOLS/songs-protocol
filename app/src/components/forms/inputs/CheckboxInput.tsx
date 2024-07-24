import { Body2, TextInputProps } from "@gordo-d/mufi-ui-components";
import cx from "classnames";
import React, { forwardRef } from "react";

export interface CheckBoxInputProps extends TextInputProps {}

const CheckBoxInput = forwardRef<HTMLInputElement, CheckBoxInputProps>(function CheckBoxInput(
	{
		label,
		focusColor = "primary-blue-400",
		status = "default",
		disabled = false,
		className,
		required = false,
		...props
	}: CheckBoxInputProps,
	ref,
) {
	const statusClass = cx({
		"border-neutral-300": status === "default" && !disabled,
		"border-semantic-success": status === "success" && !disabled,
		"border-semantic-warning": status === "warning" && !disabled,
		"border-semantic-error": status === "error" && !disabled,
	});

	return (
		<div className="flex w-full flex-col gap-2">
			<label
				htmlFor={props.name}
				className={cx(
					"rounded-base block w-full border-0 py-3 outline-none transition-all",
					"bg-white text-neutral-800",
					statusClass,
					`focus:ring-${focusColor} focus:border-${focusColor}`,
					"flex gap-4 align-middle",
					className,
				)}
			>
				<input
					id={props.name}
					type="checkbox"
					{...props}
					ref={ref}
					disabled={disabled}
					required={required}
				></input>
				<Body2 color="neutral-600">{label}</Body2>
			</label>
		</div>
	);
});

export default CheckBoxInput;
