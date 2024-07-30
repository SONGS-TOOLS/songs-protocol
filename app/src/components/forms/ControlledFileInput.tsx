import { Body3 } from "@gordo-d/mufi-ui-components";
import { Control, Controller, FieldValues } from "react-hook-form";
import cx from "classnames";
import { ControlledImageFileInputProps } from "./types";
import ImageFileInputWithPreview from "./inputs/ImageFileInputWithPreview";

const ControlledFileInput = <T extends FieldValues>({
	watch,
	control,
	errors,
	inputName,
	rules,
	inputLabel,
	defaultImageSrc = undefined,
	rounded = false,
	required = false,
}: ControlledImageFileInputProps<T>) => {
	const watchFile = watch(inputName);
	return (
		<Controller
			name={inputName}
			control={control as Control<T>}
			rules={rules}
			render={({ field }) => {
				const { value, ...rest } = field;
				return (
					<div>
						<ImageFileInputWithPreview
							label={inputLabel}
							className={cx({ "border-semantic-error": errors[inputName] })}
							defaultImageSrc={
								field.value ? field.value : defaultImageSrc ? defaultImageSrc : undefined
							}
							rounded={rounded}
							watchFile={watchFile}
							{...rest}
							onChange={(e) => {
								if (e.target.files?.length) {
									// field.onChange(e.target.files[0]);
									e.target.files[0].text().then((text: string) => {
										// console.log(e.target.files[0]);
										//   setTrackFile(e.target.files[0]);
										// setTrackFile(text);
										if (e.target.files?.length) {
											field.onChange(e.target.files[0]);
										}
									});
								}
							}}
							required={required}
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
