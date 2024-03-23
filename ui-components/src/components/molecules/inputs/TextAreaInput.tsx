import cx from "classnames";
import React, { InputHTMLAttributes } from "react";
import { Body2 } from "../../atoms";

export interface TextAreaInputProps extends InputHTMLAttributes<HTMLTextAreaElement> {
	label?: string;
	focusColor?: string;
	disabled?: boolean;
	status?: "default" | "success" | "warning" | "error";
	required?: boolean; // Added required prop
}

export const TextAreaInput = (props: TextAreaInputProps) => {
	const {
		focusColor = "primary-blue-400",
		status = "default",
		disabled = false,
		label,
		required,
		...inputProps
	} = props;
	const statusClass = cx({
		"border-neutral-300": status === "default" && !disabled,
		"border-semantic-success": status === "success" && !disabled,
		"border-semantic-warning": status === "warning" && !disabled,
		"border-semantic-error": status === "error" && !disabled,
	});

	return (
		<div className="flex flex-col gap-2">
			{label && (
				<Body2 color="neutral-600" className="mb-2">
					{label}
					{required && <span className="text-semantic-error"> *</span>}
				</Body2>
			)}
			<textarea
				id="text-area-input"
				className={cx(
					"block w-full p-3 border-2 rounded-base outline-none transition-colors",
					disabled ? "bg-neutral-200 text-neutral-500" : "bg-white text-neutral-800",
					statusClass,
					`focus:ring-${focusColor} focus:border-${focusColor}`,
				)}
				disabled={disabled}
				{...inputProps} // Spread the rest of the inputProps to the textarea
			/>
		</div>
	);
};
