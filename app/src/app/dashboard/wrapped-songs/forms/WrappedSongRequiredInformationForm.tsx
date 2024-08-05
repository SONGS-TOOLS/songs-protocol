import { Card, Headline4 } from "@gordo-d/mufi-ui-components";
import { WrappedSongFormFields, WrappedSongFieldType } from "../types";
import { FormBlockProps } from "@/components/forms/types";
import ControlledInputs from "@/components/forms/ControlledInputs";
import { requiredWrappedSongFields } from "./fields";
import { useMemo, useState } from "react";
import artists from "@/app/dashboard/artists/artistsMockData/data.json";

const WrappedSongRequiredInformationForm = ({
	className,
	control,
	errors,
	watch,
	register,
	setValue,
}: FormBlockProps<WrappedSongFormFields>) => {
	//POPULATE MAIN ARTIST OPTIONS WITH ARTISTS FROM DATABASE
	const fields = useMemo(() => {
		const index = requiredWrappedSongFields.findIndex((field) => (field.name = "main_artist"));
		const options = artists.map((artist) => ({ label: artist.name, value: artist.name }));
		if (index >= 0 && requiredWrappedSongFields[index].type === "selectInput") {
			requiredWrappedSongFields[index].options = options;
		}
		return requiredWrappedSongFields;
	}, [artists]);

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
export default WrappedSongRequiredInformationForm;
