import { Card, Headline4 } from "@gordo-d/mufi-ui-components";
import { ReleaseFormFields } from "../types";
import { FormBlockProps } from "@/components/forms/types";
import ControlledInputs from "@/components/forms/ControlledInputs";
import { useMemo, useState } from "react";
// import artists from "@/app/dashboard/artists/artistsMockData/data.json";
import untypedWrappedSongsMetadata from "@/app/dashboard/wrapped-songs/wrappedSongMockData/mintedData.json";
import { optionalReleaseFields } from "./fields";
import { WrappedSongMetadataType } from "../../wrapped-songs/types";
const wrappedSongsMetadata = untypedWrappedSongsMetadata as WrappedSongMetadataType[];

const ReleaseOptionalInformationForm = ({
	className,
	control,
	errors,
	watch,
	register,
	setValue,
}: FormBlockProps<ReleaseFormFields>) => {
	return (
		<Card className={`max-w-2xl ${className}`}>
			<Headline4>Required information</Headline4>
			<div className="my-4 grid grid-flow-row gap-4">
				<ControlledInputs
					fields={optionalReleaseFields}
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
export default ReleaseOptionalInformationForm;
