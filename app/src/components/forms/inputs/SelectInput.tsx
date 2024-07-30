import React, { forwardRef, useId } from "react";
import Select, { SelectInstance, StylesConfig } from "react-select";
import cx from "classnames";
import { Body2 } from "@gordo-d/mufi-ui-components";

interface Option {
	value: string;
	label: string;
}

interface SelectInputProps {
	label: string;
	options: Option[];
	required?: boolean;
	className?: string;
	value?: string;
	disabled: boolean;
	focusColor?: string;
	status?: "default" | "success" | "warning" | "error";
	onChange: (option: Option | null) => void;
	// Add other props as needed
}

const SelectInput = forwardRef<SelectInstance, SelectInputProps>(function NumberInput(
	{
		label,
		options,
		required,
		className,
		value,
		disabled = false,
		focusColor = "primary-blue-400",
		status = "default",
		onChange,
		...props
	}: SelectInputProps,
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
			{label && (
				<Body2 color="neutral-600">
					{label}
					{required && <span className="text-semantic-error"> *</span>}
				</Body2>
			)}
			<Select
				instanceId={useId()}
				options={options}
				className={cx(className)}
				unstyled
				classNames={{
					clearIndicator: ({ isFocused }) =>
						cx(
							isFocused ? "text-neutral-600" : "text-neutral-200",
							"p-2",
							isFocused ? "hover:text-neutral-800" : "hover:text-neutral-400",
						),
					// container: () => cx(),
					control: ({ isDisabled, isFocused }) =>
						cx(
							isDisabled ? "bg-neutral-50" : "bg-white",
							isDisabled
								? "border-neutral-300"
								: isFocused
									? "border-primary-blue-400"
									: "border-neutral-300",
							"rounded",
							"border-solid",
							"border-2",
							"p-3",
							"focus:ring-primary-blue-400",
							className,
							// isFocused && "shadow-[0_0_0_1px] shadow-neutral-800",
							isFocused ? "hover:border-primary-blue-400" : "hover:border-neutral-300",
						),
					dropdownIndicator: ({ isFocused }) =>
						cx(
							isFocused ? "text-neutral-600" : "text-neutral-400",
							isFocused ? "hover:text-neutral-800" : "hover:text-neutral-400",
						),
					// group: () => cx("py-2"),
					// groupHeading: () =>
					// 	cx("text-neutral-400", "text-xs", "font-medium", "mb-1", "px-3", "uppercase"),
					// // indicatorsContainer: () => cx(),
					// indicatorSeparator: ({ isDisabled }) =>
					// 	cx(isDisabled ? "bg-neutral-100" : "bg-neutral-200", "my-2"),
					// input: () => cx("m-0.5", "py-0.5", "text-neutral-800"),
					// loadingIndicator: ({ isFocused }) =>
					// 	cx(isFocused ? "text-neutral-600" : "text-neutral-200", "p-2"),
					// loadingMessage: () => cx("text-neutral-400", "py-2", "px-3"),
					menu: () => cx("bg-white", "rounded", "shadow-[0_0_0_1px_rgba(0,0,0,0.1)]", "my-1"),
					menuList: () => cx("py-1"),
					// // menuPortal: () => cx(),
					// multiValue: () => cx("bg-neutral-100", "rounded-sm", "m-0.5"),
					// multiValueLabel: () => cx("rounded-sm", "text-neutral-800", "text-sm", "p-[3]", "pl-[6]"),
					// multiValueRemove: ({ isFocused }) =>
					// 	cx(
					// 		"rounded-sm",
					// 		isFocused && "bg-red-500",
					// 		"px-1",
					// 		"hover:bg-red-500",
					// 		"hover:text-red-800",
					// 	),
					// noOptionsMessage: () => cx("text-neutral-400", "py-2", "px-3"),
					option: ({ isDisabled, isFocused, isSelected }) =>
						cx(
							isSelected ? "bg-primary-blue-400" : isFocused ? "bg-neutral-300" : "bg-transparent",
							isDisabled ? "text-neutral-200" : isSelected ? "text-white" : "text-inherit",
							"py-2",
							"px-3",
							!isDisabled && (isSelected ? "active:bg-neutral-800" : "active:bg-neutral-500"),
						),
					placeholder: () => cx("text-neutral-500", "mx-0.5"),
					// singleValue: ({ isDisabled }) =>
					// 	cx(isDisabled ? "text-neutral-400" : "text-neutral-800", "mx-0.5"),
					// valueContainer: () => cx("py-0.5", "px-2"),
				}}
				value={options.find((c) => c.value === value)}
				onChange={onChange}
				{...props}
			/>
		</div>
	);
});

export default SelectInput;
