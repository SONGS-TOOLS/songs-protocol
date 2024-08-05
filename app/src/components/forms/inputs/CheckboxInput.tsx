import { Body2, TextInputProps } from "@gordo-d/mufi-ui-components";
import cx from "classnames";
import React, { forwardRef } from "react";
import Tooltip from "../components/Tooltip";

export interface CheckBoxInputProps extends TextInputProps {
	tooltip?: string;
}

const CheckBoxInput = forwardRef<HTMLInputElement, CheckBoxInputProps>(function CheckBoxInput(
	{
		label,
		focusColor = "primary-blue-400",
		status = "default",
		disabled = false,
		className,
		required = false,
		tooltip = undefined,
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
		<div className="flex w-full gap-2">
			<div className="flex items-center gap-2">
				<label
					htmlFor={props.name}
					className={cx(
						"rounded-base block w-full border-0 py-3 outline-none transition-all",
						"bg-white text-neutral-800",
						statusClass,
						`focus:ring-${focusColor} focus:border-${focusColor}`,
						"items-middle flex gap-4",
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
				{tooltip && <Tooltip tooltip={tooltip} />}
			</div>
		</div>
	);
});

export default CheckBoxInput;
