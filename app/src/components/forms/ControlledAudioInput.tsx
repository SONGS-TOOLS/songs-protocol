import { Body3 } from "@gordo-d/mufi-ui-components";
import { Control, Controller, FieldValues } from "react-hook-form";
import cx from "classnames";
import { ControlledImageFileInputProps } from "./types";
import ImageFileInputWithPreview from "./inputs/ImageFileInputWithPreview";
import AudioFileInputWithPreview from "./inputs/AudioFileInputWithPreview";

const ControlledAudioInput = <T extends FieldValues>({
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
				const { ...rest } = field;
				return (
					<div>
						<AudioFileInputWithPreview
							label={inputLabel}
							className={cx({ "border-semantic-error": errors[inputName] })}
							watchFile={watchFile}
							{...rest}
							onChange={(e) => {
								field.onChange(e.target.files);
							}}
							setValue={(value) => {
								field.onChange(value);
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
export default ControlledAudioInput;
