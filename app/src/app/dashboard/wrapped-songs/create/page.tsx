"use client";
import TabMenu from "@/components/layout/TabMenu";
import DashboardPageTitle from "@/components/typography/DashboardPageTitle";
import { Button } from "@gordo-d/mufi-ui-components";
import cx from "classnames";
import { useEffect, useMemo, useState } from "react";
import { useForm, SubmitHandler, Controller, useWatch } from "react-hook-form";
import { WrappedSongFormFields } from "../types";
import WrappedSongRequiredInformationForm from "../forms/WrappedSongRequiredInformationForm";
import WrappedSongOptionalInformationForm from "../forms/WrappedSongOptionalInformationForm";
import { formatWrappedSongFieldsToMetadata } from "@/app/utils/formatWrappedSongMetadata";

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
	const { register, handleSubmit, watch, control, formState } = useForm<WrappedSongFormFields>({
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

	const loadTrackDuration: (file: File) => Promise<number> = (file) => {
		return new Promise((resolve) => {
			var url_src = URL.createObjectURL(file);
			var audio = new Audio(url_src);
			audio.addEventListener("loadeddata", function () {
				resolve(audio.duration);
			});
		});
	};
	const onSubmit: SubmitHandler<WrappedSongFormFields> = async (data) => {
		if (data.track instanceof File) {
			const duration = await loadTrackDuration(data.track);
			data.track_duration = duration.toString();
		}
		console.log("Here is the data for the whole form");
		console.log(data);
		const formattedData = formatWrappedSongFieldsToMetadata(data);
		console.log(formattedData);
	};
	const { errors } = formState;

	const [tabItems, setTabItems] = useState(defaultTabItems);

	// const formData = watch();
	// const [dataChanged, setDataChanged] = useState(false);

	// useEffect(() => {
	// 	// Check if formData is different from the data
	// 	if (dataChanged) {
	// 		//   setData(formData);
	// 		// Reset the flag to false
	// 		const errorKeys = Object.keys(errors);
	// 		const firstTabFields = requiredWrappedSongFields.map((el) => el.name) as string[];
	// 		const secondTabFields = optionalWrappedSongFields.map((el) => el.name) as string[];

	// 		if (errorKeys.some((v) => firstTabFields.includes(v))) {
	// 			setTabItems((state) => {
	// 				const stateCopy = [...state];
	// 				stateCopy[0].hasError = true;
	// 				return stateCopy;
	// 			});
	// 		} else {
	// 			setTabItems((state) => {
	// 				const stateCopy = [...state];
	// 				stateCopy[0].hasError = false;
	// 				return stateCopy;
	// 			});
	// 		}
	// 		if (errorKeys.some((v) => secondTabFields.includes(v))) {
	// 			setTabItems((state) => {
	// 				const stateCopy = [...state];
	// 				stateCopy[1].hasError = true;
	// 				return stateCopy;
	// 			});
	// 		} else {
	// 			setTabItems((state) => {
	// 				const stateCopy = [...state];
	// 				stateCopy[1].hasError = false;
	// 				return stateCopy;
	// 			});
	// 		}
	// 		setDataChanged(false);
	// 	}
	// }, [dataChanged, formData, errors, setTabItems]);

	// useEffect(() => {
	// 	// Set the flag to true when formData changes
	// 	setDataChanged(true);
	// }, [formData]);

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
				<WrappedSongRequiredInformationForm
					control={control}
					errors={errors}
					watch={watch}
					register={register}
					className={cx({
						hidden: tab !== 0,
					})}
				/>
				<WrappedSongOptionalInformationForm
					control={control}
					errors={errors}
					watch={watch}
					register={register}
					className={cx({
						hidden: tab !== 1,
					})}
				/>
			</form>
		</>
	);
};

export default CreateWrappedSongPage;
