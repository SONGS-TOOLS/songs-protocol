"use client";
import TabMenu from "@/components/layout/TabMenu";
import DashboardPageTitle from "@/components/typography/DashboardPageTitle";
import { Button } from "@gordo-d/mufi-ui-components";
import cx from "classnames";
import { useState } from "react";
// import RequiredInformationForm from "../forms/RequiredInformationForm";
// import OptionalInformationForm from "../forms/OptionalInformationForm";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { ArtistFormFields } from "../../artists/types";
// import { ArtistFields } from "../types";

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
	const {
		register,
		handleSubmit,
		watch,
		control,
		formState: { errors },
	} = useForm<ArtistFormFields>({ mode: "onBlur" });
	const onSubmit: SubmitHandler<ArtistFormFields> = (data) => {
		console.log("Here is the data for the whole form");
		console.log(data);
	};

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
