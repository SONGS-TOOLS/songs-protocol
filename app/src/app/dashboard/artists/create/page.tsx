"use client";
import TabMenu from "@/components/layout/TabMenu";
import DashboardPageTitle from "@/components/typography/DashboardPageTitle";
import { Body1, Button, Card, Headline4, TextInput } from "@gordo-d/mufi-ui-components";
import cx from "classnames";
import { useEffect, useState } from "react";
import ArtistRequiredInformationForm from "../forms/ArtistRequiredInformationForm";
import ArtistOptionalInformationForm from "../forms/ArtistOptionalInformationForm";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { ArtistFormFields } from "../types";
import { optionalArtistFields, requiredArtistFields } from "../forms/fields";

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

const CreateArtistsPage = () => {
	const [tab, setTab] = useState(0);
	const { register, handleSubmit, watch, control, formState } = useForm<ArtistFormFields>({
		mode: "onBlur",
		defaultValues: {
			name: "",
			email: "",
			has_spotify_link: false,
			spotify: "",
			has_apple_music_link: false,
			apple_music: "",
			profile_picture: "",
			bio: "",
			phone_number: "",
			pro_number: "",
			facebook: "",
			instagram: "",
			x: "",
			tiktok: "",
			vk: "",
			snapchat: "",
			songkick: "",
			youtube: "",
			soundcloud: "",
			wikipedia: "",
			website: "",
		},
	});
	const onSubmit: SubmitHandler<ArtistFormFields> = (data) => {
		console.log("Here is the data for the whole form");
		console.log(data);
	};

	const { errors } = formState;

	const [tabItems, setTabItems] = useState(defaultTabItems);

	// THIS WILL SET AN ERROR ON TAB MENU TO INDICATE WHICH TAB STILL CONTAINS ERRORS
	// useEffect(() => {
	// 	const errorKeys = Object.keys(errors);
	// 	const firstTabFields = requiredArtistFields.map((el) => el.name) as string[];
	// 	const secondTabFields = optionalArtistFields.map((el) => el.name) as string[];

	// 	if (errorKeys.some((v) => firstTabFields.includes(v))) {
	// 		setTabItems((state) => {
	// 			const stateCopy = [...state];
	// 			stateCopy[0].hasError = true;
	// 			return stateCopy;
	// 		});
	// 	} else {
	// 		setTabItems((state) => {
	// 			const stateCopy = [...state];
	// 			stateCopy[0].hasError = false;
	// 			return stateCopy;
	// 		});
	// 	}
	// 	if (errorKeys.some((v) => secondTabFields.includes(v))) {
	// 		setTabItems((state) => {
	// 			const stateCopy = [...state];
	// 			stateCopy[1].hasError = true;
	// 			return stateCopy;
	// 		});
	// 	} else {
	// 		setTabItems((state) => {
	// 			const stateCopy = [...state];
	// 			stateCopy[1].hasError = false;
	// 			return stateCopy;
	// 		});
	// 	}
	// }, [formState, errors]);

	return (
		<>
			<div>
				<div className="flex justify-between">
					<DashboardPageTitle>Add artist</DashboardPageTitle>
					<Button onClick={handleSubmit(onSubmit)} className="font-semibold">
						Save artist
					</Button>
				</div>
				<TabMenu className="grid-cols-2" tab={tab} setTab={setTab} items={tabItems} />
			</div>
			<form className="flex items-start justify-center py-10" onSubmit={handleSubmit(onSubmit)}>
				<ArtistRequiredInformationForm
					control={control}
					errors={errors}
					watch={watch}
					register={register}
					className={cx({
						hidden: tab !== 0,
					})}
				/>
				<ArtistOptionalInformationForm
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

export default CreateArtistsPage;
