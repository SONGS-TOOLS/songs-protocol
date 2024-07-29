"use client";
import TabMenu from "@/components/layout/TabMenu";
import DashboardPageTitle from "@/components/typography/DashboardPageTitle";
import { Body1, Button, Card, Headline4, TextInput } from "@gordo-d/mufi-ui-components";
import cx from "classnames";
import { useState } from "react";
import RequiredInformationForm from "../forms/RequiredInformationForm";
import OptionalInformationForm from "../forms/OptionalInformationForm";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { ArtistFields } from "../types";

const tabItems = [
	{
		label: "Required information",
	},
	{
		label: "Optional information",
	},
];

const CreateArtistsPage = () => {
	const [tab, setTab] = useState(0);
	const {
		register,
		handleSubmit,
		watch,
		control,
		formState: { errors },
	} = useForm<ArtistFields>({ mode: "onBlur" });
	const onSubmit: SubmitHandler<ArtistFields> = (data) => {
		console.log("Here is the data for the whole form");
		console.log(data);
	};

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
				<RequiredInformationForm
					control={control}
					errors={errors}
					watch={watch}
					register={register}
					className={cx({
						hidden: tab !== 0,
					})}
				/>
				<OptionalInformationForm
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
