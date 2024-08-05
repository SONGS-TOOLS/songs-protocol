"use client";
import TabMenu from "@/components/layout/TabMenu";
import DashboardPageTitle from "@/components/typography/DashboardPageTitle";
import { Button } from "@gordo-d/mufi-ui-components";
import cx from "classnames";
import { useEffect, useMemo, useState } from "react";
import { useForm, SubmitHandler, Controller, useWatch } from "react-hook-form";
import { formatWrappedSongFieldsToMetadata } from "@/app/utils/formatWrappedSongMetadata";
import { ReleaseFormFields } from "../types";
import ReleaseRequiredInformationForm from "../forms/ReleaseRequiredInformationForm";
import ReleaseOptionalInformationForm from "../forms/ReleaseOptionalInformationForm";
import dspOptions from "../forms/dspOptions.json";
import FormWithControlledInputs from "@/components/forms/FormWithControlledInputs";
import { optionalReleaseFields, requiredReleaseFields } from "../forms/fields";
import { WrappedSongMetadataType } from "../../wrapped-songs/types";
import untypedWrappedSongsMetadata from "@/app/dashboard/wrapped-songs/wrappedSongMockData/mintedData.json";
const wrappedSongsMetadata = untypedWrappedSongsMetadata as WrappedSongMetadataType[];
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

const CreateReleasePage = () => {
	const [tab, setTab] = useState(0);
	const { register, handleSubmit, watch, control, formState, setValue } =
		useForm<ReleaseFormFields>({
			mode: "onBlur",
			defaultValues: {
				wrapped_song: undefined,
				main_artist: "",
				release_title: "",
				language: "",
				genre: "",
				track: "",
				artwork: "",
				release_date: "",
				dsp: dspOptions,
			},
		});

	const onSubmit: SubmitHandler<ReleaseFormFields> = async (data) => {
		console.log("DATA", data);
	};
	const { errors } = formState;

	const [tabItems, setTabItems] = useState(defaultTabItems);

	//This will fill the options of wrapped songs with values from database or onchain info

	const requiredFields = useMemo(() => {
		const index = requiredReleaseFields.findIndex((field) => (field.name = "wrapped_song"));

		//this will ensure the wrapped song has a name, for release_title and that its artist has been verified
		const options = wrappedSongsMetadata
			.filter(
				(wrappedSong) =>
					wrappedSong.name !== "" &&
					artists.find((artist) => {
						const main_artist = wrappedSong.attributes.find(
							(attribute) => attribute.trait_type === "Main artist",
						)?.value;
						return artist.name === main_artist;
					})?.verified === true,
			)
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
		<>
			<div>
				<div className="flex justify-between">
					<DashboardPageTitle>Create new release</DashboardPageTitle>
					<Button onClick={handleSubmit(onSubmit)} className="font-semibold">
						Submit release
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
					fields={optionalReleaseFields}
				/>
			</form>
		</>
	);
};

export default CreateReleasePage;
