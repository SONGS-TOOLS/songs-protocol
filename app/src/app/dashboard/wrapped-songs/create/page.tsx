"use client";
import TabMenu from "@/components/layout/TabMenu";
import DashboardPageTitle from "@/components/typography/DashboardPageTitle";
import { Button } from "@gordo-d/mufi-ui-components";
import cx from "classnames";
import { useMemo, useState } from "react";
import { useForm, SubmitHandler, Controller, useWatch } from "react-hook-form";
import { WrappedSongFormFields } from "../types";
import { formatWrappedSongFieldsToMetadata } from "@/app/utils/formatWrappedSongMetadata";
import FormWithControlledInputs from "@/components/forms/FormWithControlledInputs";
import { optionalWrappedSongFields, requiredWrappedSongFields } from "../forms/fields";
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

const CreateWrappedSongPage = () => {
	const [tab, setTab] = useState(0);
	const { register, handleSubmit, watch, control, formState, setValue } =
		useForm<WrappedSongFormFields>({
			mode: "onBlur",
			defaultValues: {
				main_artist: "",
				release_title: "",
				language: "",
				primary_genre: "",
				track: "",
				artwork: "",
				featuring_artist: "",
				production_year: "",
				previously_released: false,
				producer: "",
				copyright: "",
				lyrics: "",
				isrc: "",
				iswc: "",
				credits: [],
				tiktok_start_time: "",
				description: "",
				recording_location: "",
				upc_ean: "",
				secondary_genre: "",
				track_duration: "",
			},
		});

	const loadTrackDuration: (file: File) => Promise<string> = (file) => {
		return new Promise((resolve) => {
			var url_src = URL.createObjectURL(file);
			var audio = new Audio(url_src);
			audio.addEventListener("loadeddata", function () {
				const durationInSeconds = Math.round(audio.duration);
				const minutes = Math.floor(durationInSeconds / 60);
				const seconds = durationInSeconds % 60;
				const formattedDuration = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
				resolve(formattedDuration);
			});
		});
	};
	const onSubmit: SubmitHandler<WrappedSongFormFields> = async (data) => {
		if (data.track instanceof File) {
			const duration = await loadTrackDuration(data.track);
			data.track_duration = duration;
		}
		console.log("Here is the data for the whole form");
		console.log(data);
		const formattedData = formatWrappedSongFieldsToMetadata(data);
		console.log(formattedData);
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
					<DashboardPageTitle>Create Wrapped Song</DashboardPageTitle>
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
					headline="Required information"
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
					headline="Optional information"
				/>
			</form>
		</>
	);
};

export default CreateWrappedSongPage;
