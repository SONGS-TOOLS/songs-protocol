"use client";
import TabMenu from "@/components/layout/TabMenu";
import DashboardPageTitle from "@/components/typography/DashboardPageTitle";
import { Button } from "@gordo-d/mufi-ui-components";
import cx from "classnames";
import { useMemo, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { WrappedSongFormFields, WrappedSongMetadataType } from "../../types";
import wrappedSongs from "@/app/dashboard/wrapped-songs/wrappedSongMockData/data.json";
import {
	formatMetadataToWrappedSongFields,
	formatWrappedSongFieldsToMetadata,
} from "@/app/utils/formatWrappedSongMetadata";
import wrappedSongsMetadata from "@/app/dashboard/wrapped-songs/wrappedSongMockData/mintedData.json";
import FormWithControlledInputs from "@/components/forms/FormWithControlledInputs";
import { optionalWrappedSongFields, requiredWrappedSongFields } from "../../forms/fields";
const wrappedSongMetadata = wrappedSongsMetadata[0] as WrappedSongMetadataType;

const wrappedSong = wrappedSongs[0] as WrappedSongFormFields;

import artists from "@/app/dashboard/artists/artistsMockData/data.json";

const defaultTabItems = [
	{
		label: "Required information",
		hasError: false,
	},
	{
		label: "Optional information",
		hasError: false,
	},
];

const EditWrappedSongPage = () => {
	const [tab, setTab] = useState(0);
	const defaultValues = useMemo(() => {
		return formatMetadataToWrappedSongFields(wrappedSongMetadata);
	}, [wrappedSongMetadata]);
	console.log(defaultValues);

	const { register, handleSubmit, watch, control, formState, setValue } =
		useForm<WrappedSongFormFields>({
			mode: "onBlur",
			defaultValues: defaultValues,
		});

	const onSubmit: SubmitHandler<WrappedSongFormFields> = (data) => {
		console.log("Here is the data for the whole form");
		console.log(data);
		const formattedData = formatWrappedSongFieldsToMetadata(data);
		console.log("FORMATTED DATA", formattedData);
	};
	const { errors } = formState;

	const [tabItems, setTabItems] = useState(defaultTabItems);

	const requiredFields = useMemo(() => {
		const index = requiredWrappedSongFields.findIndex((field) => (field.name = "main_artist"));
		const options = artists.map((artist) => ({ label: artist.name, value: artist.name }));
		if (index >= 0 && requiredWrappedSongFields[index].type === "selectInput") {
			requiredWrappedSongFields[index].options = options;
		}
		return requiredWrappedSongFields;
	}, [artists]);

	return (
		<>
			<div>
				<div className="flex justify-between">
					<DashboardPageTitle>
						Updating Wrapped Song - {wrappedSong.release_title}
					</DashboardPageTitle>
					<Button onClick={handleSubmit(onSubmit)} className="font-semibold">
						Save Wrapped Song
					</Button>
				</div>
				<TabMenu className="grid-cols-2" tab={tab} setTab={setTab} items={tabItems} />
			</div>
			<form className="flex items-start justify-center py-10" onSubmit={handleSubmit(onSubmit)}>
				<FormWithControlledInputs
					control={control}
					errors={errors}
					watch={watch}
					register={register}
					setValue={setValue}
					className={cx({
						hidden: tab !== 0,
					})}
					fields={requiredFields}
				/>
				<FormWithControlledInputs
					control={control}
					errors={errors}
					watch={watch}
					register={register}
					setValue={setValue}
					className={cx({
						hidden: tab !== 1,
					})}
					fields={optionalWrappedSongFields}
				/>
			</form>
		</>
	);
};

export default EditWrappedSongPage;
