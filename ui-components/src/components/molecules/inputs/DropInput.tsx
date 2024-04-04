import cx from "classnames";
import React, { useMemo } from "react";
import { DropzoneOptions, useDropzone } from "react-dropzone";
import { useScreen } from "../../../hooks";
import { ScreenType } from "../../../hooks/useScreen";
import { FileAddIcon, PaperIcon } from "../../../icons";
import { Body2, IconRenderer } from "../../atoms";

export interface DropInputProps {
	label?: string;
	showFiles?: boolean;
	acceptedFiles?: File[];
	dropzoneConfig?: DropzoneOptions;
	className?: string;
	required?: boolean; // Added required prop
	name?: string;
}


const FileLabel = ({
	name,
	color = "black",
	background = "white",
}: {
	name: string;
	color?: string;
	background?: string;
}) => (
	<div className="flex gap-2 bg-white w-fit rounded pr-2 no-wrap overflow-hidden">
		<IconRenderer icon={PaperIcon} size="small" color={background} background={color} />
		<Body2 color={color} className="line-clamp-1">
			{name}
		</Body2>
	</div>
);


export const DropInput = ({
	label,
	showFiles,
	acceptedFiles,
	dropzoneConfig,
	className,
	required,
	name,
	...props
}: DropInputProps) => {
	const { screen } = useScreen();
	const isMobile = screen === ScreenType.Mobile;
	const {
		acceptedFiles: dropzoneAcceptedFiles,
		getRootProps,
		getInputProps,
	} = useDropzone({ ...dropzoneConfig });

	const acceptedFilesCombined = useMemo(
		() => (acceptedFiles && acceptedFiles.length > 0 ? acceptedFiles : dropzoneAcceptedFiles),
		[acceptedFiles, dropzoneAcceptedFiles],
	);

	return (
		<div>
			{label && (
				<Body2 color="neutral-600" className="mb-2">
					{label}
					{required && <span className="text-semantic-error"> *</span>}
				</Body2>
			)}
			<div
				{...getRootProps({
					className: cx(
						"flex flex-col items-center justify-center w-full gap-2 p-3 rounded-md",
						// "h-20 sm:h-30", // Height adjustments
						"font-primary text-neutral-500 bg-neutral-200",
						"border-2 border-dashed",
						"cursor-pointer transition-transform",
						className,
					),
				})}
			>
				<input {...getInputProps()} name={name} required={required} {...props} />
				{showFiles && acceptedFilesCombined.length > 0 && (
					<aside className="w-full">
						<ul className="flex flex-col items-center p-2 gap-1 w-full">
							{acceptedFilesCombined.map((file, i) => (
								<FileLabel key={i} name={file.name} color="neutral-600" />
							))}
						</ul>
					</aside>
				)}
				{(!acceptedFilesCombined.length || acceptedFilesCombined.length === 0) && (
					<div className="cursor-pointer flex p-4 flex-col justify-center items-center gap-2">
						<IconRenderer
							icon={FileAddIcon}
							color="neutral-500"
							background="neutral-300"
							size="large"
						/>
						<Body2 color="neutral-500" className="mt-2">
							{isMobile ? "Tap to add file" : "Drag and Drop files here or click to "}
							{!acceptedFilesCombined || acceptedFilesCombined.length === 0 ? "upload" : "replace"}
						</Body2>
					</div>
				)}
			</div>
		</div>
	);
};
