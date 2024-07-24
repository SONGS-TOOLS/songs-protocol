"use client";
import TabMenu from "@/components/layout/TabMenu";
import DashboardPageTitle from "@/components/typography/DashboardPageTitle";
import { Button } from "@gordo-d/mufi-ui-components";
import cx from "classnames";
import { useMemo, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import artists from "@/app/dashboard/artists/artistsMockData/data.json";
import { ArtistFormFields } from "../../types";
import FormWithControlledInputs from "@/components/forms/FormWithControlledInputs";
import { optionalArtistFields, requiredArtistFields } from "../../forms/fields";
import VerifiedIcon from "@/components/icons/VerifiedIcon";
const artist = artists[0] as ArtistFormFields;

const tabItems = [
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
	const {
		register,
		handleSubmit,
		watch,
		control,
		formState: { errors },
		setValue,
	} = useForm<ArtistFormFields>({ mode: "onBlur", defaultValues: artist });
	const onSubmit: SubmitHandler<ArtistFormFields> = (data) => {
		console.log("Here is the data for the whole form");
		console.log(data);

		//ensure this fields are unchanged if artist is verified; in case they manually changed the fields (i.e with devtools)
		if (artist.verified) {
			data.name = artist.name;
			data.has_apple_music_link = artist.has_apple_music_link;
			data.has_spotify_link = artist.has_spotify_link;
			data.apple_music = artist.apple_music;
			data.spotify = artist.spotify;
		}
	};

	const requiredFields = useMemo(() => {
		if (artist.verified) {
			const name = requiredArtistFields.find((field) => field.name === "name");
			if (name) name.disabled = true;

			const spotify = requiredArtistFields.find((field) => field.name === "spotify");
			if (spotify && spotify.type === "conditionalTextInput") {
				spotify.checkbox.disabled = true;
				spotify.fields.forEach((field) => {
					field.disabled = true;
				});
			}

			const apple_music = requiredArtistFields.find((field) => field.name === "apple_music");
			if (apple_music && apple_music.type === "conditionalTextInput") {
				apple_music.checkbox.disabled = true;
				apple_music.fields.forEach((field) => {
					field.disabled = true;
				});
			}
		}
		return requiredArtistFields;
	}, []);

	return (
		<>
			<div>
				<div className="flex justify-between">
					<div className="flex items-baseline gap-4">
						<DashboardPageTitle>Editing {artist.name}</DashboardPageTitle>
						{artist.verified && <VerifiedIcon />}
					</div>
					<div className="flex gap-4">
						{!artist.verified && (
							<Button className="font-semibold">Submit artist for verification</Button>
						)}
						<Button onClick={handleSubmit(onSubmit)} className="font-semibold">
							Save artist
						</Button>
					</div>
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
					fields={optionalArtistFields}
				/>
			</form>
		</>
	);
};

export default CreateArtistsPage;
