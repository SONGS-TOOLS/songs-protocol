import { Body2, Body3, TextInput } from "@gordo-d/mufi-ui-components";
import { Control, Controller, FieldValues } from "react-hook-form";
import cx from "classnames";
import { ControlledImageFileInputProps } from "./types";
import FileInputWithPreview from "./inputs/FileInputWithPreview";

const ControlledFileInput = <T extends FieldValues>({
	watch,
	control,
	errors,
	inputName,
	rules,
	inputLabel,
	defaultImageSrc = undefined,
	rounded = false,
}: ControlledImageFileInputProps<T>) => {
	const watchCheckbox = watch(inputName); // you can supply default value as second argument

	return (
		<Controller
			name={inputName}
			control={control as Control<T>}
			rules={rules}
			render={({ field }) => {
				return (
					<div>
						<FileInputWithPreview
							label={inputLabel}
							className={cx({ "border-semantic-error": errors[inputName] })}
							defaultImageSrc={defaultImageSrc}
							rounded={rounded}
							{...field}
						/>
						{errors[inputName]?.message && (
							<Body3 color="semantic-error">{errors[inputName].message as React.ReactNode}</Body3>
						)}
					</div>
				);
			}}
		/>
	);
};
export default ControlledFileInput;
