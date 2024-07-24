import { Body2, TextInputProps } from "@gordo-d/mufi-ui-components";
import cx from "classnames";
import React from "react";

export interface NumberInputProps extends TextInputProps {}

export const NumberInput = ({
	label,
	focusColor = "primary-blue-400",
	status = "default",
	disabled = false,
	className,
	required,
	...props
}: NumberInputProps) => {
	const statusClass = cx({
		"border-neutral-300": status === "default" && !disabled,
		"border-semantic-success": status === "success" && !disabled,
		"border-semantic-warning": status === "warning" && !disabled,
		"border-semantic-error": status === "error" && !disabled,
	});

	return (
		<div className="flex w-full flex-col gap-2">
			{label && (
				<Body2 color="neutral-600">
					{label}
					{required && <span className="text-semantic-error"> *</span>}
				</Body2>
			)}
			<input
				type="number"
				className={cx(
					"rounded-base block w-full border-2 p-3 outline-none transition-all",
					disabled ? "bg-neutral-200 text-neutral-500" : "bg-white text-neutral-800",
					statusClass,
					`focus:ring-${focusColor} focus:border-${focusColor}`,
					className,
				)}
				disabled={disabled}
				required={required} // Pass the required attribute to the input element
				{...props}
			/>
		</div>
	);
};
