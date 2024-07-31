import PencilIcon from "@/components/icons/PencilIcon";
import { Body2, Body3, DropInput } from "@gordo-d/mufi-ui-components";
import cx from "classnames";
import Image from "next/image";
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
		const id = useId();
		const [preview, setPreview] = useState<string | undefined>(undefined);
		const inputRef = useRef<HTMLInputElement>(null);

		useEffect(() => {
			if (watchFile && inputRef.current) {
				const files = inputRef.current.files;

				if (files?.length) {
					const file = files[0];
					const urlImage = URL.createObjectURL(file);

					setPreview(urlImage);
				}
			} else {
				setPreview(undefined);
			}
		}, [watchFile]);

		return (
			<div className="flex w-full flex-col gap-2">
				{/* {label && <Body2 color="neutral-600">{label}</Body2>} */}

				<DropInput
					label={label}
					name="trackfile"
					// required
					dropzoneConfig={{
						accept: {
							"audio/mpeg": [".flac"],
						},
						maxFiles: 1,
						onDrop: (acceptedFiles: File[]) => {
							// console.log(acceptedFiles[0]);

							acceptedFiles[0].text().then((text: string) => {
								// console.log(acceptedFiles[0]);
								//   setTrackFile(acceptedFiles[0]);
								// setTrackFile(text);
								setValue(acceptedFiles[0]);
							});
						},
					}}
					showFiles={true}
					{...props}
				/>

				{/* <input
					onChange={(e) => {
						console.log("HOLA");
						console.log(e.target.value);
					}}
					required={required}
					className="hidden"
					id={id}
					type="file"
					accept={".png, .jpg"}
					{...props}
					ref={ref}
				/> */}
			</div>
		);
	},
);
export default AudioFileInputWithPreview;
