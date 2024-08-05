"use client";
import TabMenu from "@/components/layout/TabMenu";
import DashboardPageTitle from "@/components/typography/DashboardPageTitle";
import { Button } from "@gordo-d/mufi-ui-components";
import cx from "classnames";
import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { ArtistFormFields } from "../types";
import { optionalArtistFields, requiredArtistFieldsForNewArtist } from "../forms/fields";
import FormWithControlledInputs from "@/components/forms/FormWithControlledInputs";
import VerificationConfirmationModal from "../components/VerificationConfirmationModal";

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
	const [verificatationConfirmationModal, setVerificationConfirmationModal] = useState(false);

	const { register, handleSubmit, watch, control, formState, setValue } = useForm<ArtistFormFields>(
		{
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
		},
	);
	const beforeOnSubmit: SubmitHandler<ArtistFormFields> = (data) => {
		console.log("Here is the data for the whole form, launch modal to confirm verification");
		console.log(data);
		if (data.verification_request) {
			setVerificationConfirmationModal(true);
		}
	};
	const onSubmit: SubmitHandler<ArtistFormFields> = (data) => {
		console.log("Here is the data for the whole form");
		console.log(data);
	};

	const { errors } = formState;

	const [tabItems, setTabItems] = useState(defaultTabItems);

	// THIS WILL SET AN ERROR ON TAB MENU TO INDICATE WHICH TAB STILL CONTAINS ERRORS
	// CREATES INFINITE LOOP
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
					<Button onClick={handleSubmit(beforeOnSubmit)} className="font-semibold">
						Save artist
					</Button>
				</div>
				<TabMenu className="grid-cols-2" tab={tab} setTab={setTab} items={tabItems} />
			</div>
			<form className="flex items-start justify-center gap-4 py-10">
				<FormWithControlledInputs
					control={control}
					errors={errors}
					watch={watch}
					register={register}
					setValue={setValue}
					headline="Required information"
					className={cx({
						hidden: tab !== 0,
					})}
					fields={requiredArtistFieldsForNewArtist}
				/>
				<FormWithControlledInputs
					control={control}
					errors={errors}
					watch={watch}
					register={register}
					setValue={setValue}
					headline="Optional information"
					className={cx({
						hidden: tab !== 1,
					})}
					fields={optionalArtistFields}
				/>
			</form>
			{verificatationConfirmationModal && (
				<VerificationConfirmationModal
					handleSubmit={handleSubmit(onSubmit)}
					setVerificationConfirmationModal={setVerificationConfirmationModal}
				/>
			)}
		</>
	);
};

export default CreateArtistsPage;
