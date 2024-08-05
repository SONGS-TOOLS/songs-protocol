import { Card, Headline4 } from "@gordo-d/mufi-ui-components";
import { ReleaseFormFields } from "../types";
import { FormBlockProps } from "@/components/forms/types";
import ControlledInputs from "@/components/forms/ControlledInputs";
import { useMemo, useState } from "react";
// import artists from "@/app/dashboard/artists/artistsMockData/data.json";
import untypedWrappedSongsMetadata from "@/app/dashboard/wrapped-songs/wrappedSongMockData/mintedData.json";
import { requiredReleaseFields } from "./fields";
import { WrappedSongMetadataType } from "../../wrapped-songs/types";
const wrappedSongsMetadata = untypedWrappedSongsMetadata as WrappedSongMetadataType[];

const ReleaseRequiredInformationForm = ({
	className,
	control,
	errors,
	watch,
	register,
	setValue,
}: FormBlockProps<ReleaseFormFields>) => {
	//POPULATE WRAPPED SONGS OPTIONS WITH ARTISTS FROM CHAIN
	const fields = useMemo(() => {
		const index = requiredReleaseFields.findIndex((field) => (field.name = "wrapped_song"));
		const options = wrappedSongsMetadata
			.filter((wrappedSong) => wrappedSong.name !== "")
			.map((wrappedSong) => {
				const value = wrappedSong.name;
				return { label: value as string, value: wrappedSong };
			});
		if (index >= 0 && requiredReleaseFields[index].type === "selectInput") {
			requiredReleaseFields[index].options = options;
		}
		return requiredReleaseFields;
	}, [wrappedSongsMetadata]);

	return (
		<Card className={`max-w-2xl ${className}`}>
			<Headline4>Required information</Headline4>
			<div className="my-4 grid grid-flow-row gap-4">
				<ControlledInputs
					fields={fields}
					control={control}
					register={register}
					errors={errors}
					watch={watch}
					setValue={setValue}
				/>
			</div>
		</Card>
	);
};
export default ReleaseRequiredInformationForm;
