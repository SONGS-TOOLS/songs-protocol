import { DropInput } from "@gordo-d/mufi-ui-components";
import { forwardRef, useEffect, useId, useRef, useState } from "react";

export interface ImageFileInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
	label?: string;
	className?: string;
	watchFile: string;
	setValue: (file: File) => void;
}

const AudioFileInputWithPreview = forwardRef<HTMLInputElement, ImageFileInputProps>(
	function ImageFileInputWithPreview(
		{ label, className, watchFile, required = false, setValue, ...props }: ImageFileInputProps,
		ref,
	) {
		// const id = useId();
		// const [preview, setPreview] = useState<string | undefined>(undefined);
		// const inputRef = useRef<HTMLInputElement>(null);

		// useEffect(() => {
		// 	if (watchFile && inputRef.current) {
		// 		const files = inputRef.current.files;

		// 		if (files?.length) {
		// 			const file = files[0];
		// 			const urlImage = URL.createObjectURL(file);

		// 			setPreview(urlImage);
		// 		}
		// 	} else {
		// 		setPreview(undefined);
		// 	}
		// }, [watchFile]);

		return (
			<div className="flex w-full flex-col gap-2">
				<DropInput
					label={label}
					name="trackfile"
					// required
					required={required}
					dropzoneConfig={{
						accept: {
							"audio/mpeg": [".flac"],
						},
						maxFiles: 1,
						onDrop: (acceptedFiles: File[]) => {
							acceptedFiles[0].text().then((text: string) => {
								setValue(acceptedFiles[0]);
							});
						},
					}}
					showFiles={true}
					{...props}
				/>
			</div>
		);
	},
);
export default AudioFileInputWithPreview;
