import { Body2, Body3, TextInput } from "@gordo-d/mufi-ui-components";
import { Control, Controller, FieldValues, Path, PathValue, useController } from "react-hook-form";
import cx from "classnames";
import { ControlledImageFileInputProps } from "./types";
import ImageFileInputWithPreview from "./inputs/ImageFileInputWithPreview";
import { useEffect, useRef, useState } from "react";

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
	const watchFile = watch(inputName); // you can supply default value as second argument

	// const [preview, setPreview] = useState<string | undefined>(defaultImageSrc ?? undefined);
	// const ref = useRef<HTMLInputElement>(null);

	// useEffect(() => {
	// 	if (watchFile && ref.current) {
	// 		const files = ref.current.files;

	// 		if (files?.length) {
	// 			const file = files[0];
	// 			const urlImage = URL.createObjectURL(file);

	// 			setPreview(urlImage);
	// 		}
	// 	} else {
	// 		setPreview(defaultImageSrc);
	// 	}
	// }, [watchFile, defaultImageSrc]);

	return (
		<Controller
			name={inputName}
			control={control as Control<T>}
			rules={rules}
			// defaultValue={"" as PathValue<T, Path<T>>}
			render={({ field }) => {
				const { value, ...rest } = field;
				console.log(field);
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
								field.onChange(e.target.files);
							}}
							required={required}

							// ref={ref}
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
