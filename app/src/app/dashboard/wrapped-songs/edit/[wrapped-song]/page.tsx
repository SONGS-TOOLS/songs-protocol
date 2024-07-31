"use client";
import TabMenu from "@/components/layout/TabMenu";
import DashboardPageTitle from "@/components/typography/DashboardPageTitle";
import { Button } from "@gordo-d/mufi-ui-components";
import cx from "classnames";
import { useEffect, useMemo, useState } from "react";
import { useForm, SubmitHandler, Controller, useWatch } from "react-hook-form";
import { WrappedSongFormFields, WrappedSongMetadataType } from "../../types";
import WrappedSongRequiredInformationForm from "../../forms/WrappedSongRequiredInformationForm";
import WrappedSongOptionalInformationForm from "../../forms/WrappedSongOptionalInformationForm";
import wrappedSongs from "@/app/dashboard/wrapped-songs/wrappedSongMockData/data.json";
import {
	formatMetadataToWrappedSongFields,
	formatWrappedSongFieldsToMetadata,
} from "@/app/utils/formatWrappedSongMetadata";
import wrappedSongsMetadata from "@/app/dashboard/wrapped-songs/wrappedSongMockData/mintedData.json";
const wrappedSongMetadata = wrappedSongsMetadata[0] as WrappedSongMetadataType;

const wrappedSong = wrappedSongs[0] as WrappedSongFormFields;

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

	const { register, handleSubmit, watch, control, formState } = useForm<WrappedSongFormFields>({
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

export default EditWrappedSongPage;
