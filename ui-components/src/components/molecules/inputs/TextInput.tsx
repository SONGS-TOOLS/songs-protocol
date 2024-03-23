import cx from "classnames";
import React from "react";
import { Body2 } from "../../atoms";

export interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
	label?: string;
	focusColor?: string;
	disabled?: boolean;
	className?: string;
	status?: "default" | "success" | "warning" | "error";
	required?: boolean; // Added required prop
}

export const TextInput = ({
	label,
	focusColor = "primary-blue-400",
	status = "default",
	disabled = false,
	className,
	required,
	...props
}: TextInputProps) => {
	const statusClass = cx({
		"border-neutral-300": status === "default" && !disabled,
		"border-semantic-success": status === "success" && !disabled,
		"border-semantic-warning": status === "warning" && !disabled,
		"border-semantic-error": status === "error" && !disabled,
	});

	return (
		<div className="flex flex-col gap-2">
			{label && (
				<Body2 color="neutral-600">
					{label}
					{required && <span className="text-semantic-error"> *</span>}
				</Body2>
			)}
			<input
				type="text"
				className={cx(
					"block w-full p-3 border-2 rounded-base outline-none transition-all",
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
