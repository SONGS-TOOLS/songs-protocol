import { Body2, Body3, Card, Headline4, TextInput } from "@gordo-d/mufi-ui-components";
import { ArtistFields, FieldType, FormBlockProps } from "../types";
import { Controller, InputValidationRules, Path, RegisterOptions } from "react-hook-form";
import cx from "classnames";
import ControlledTextInput from "@/components/forms/ControlledTextInput";
import ControlledConditionalTextInput from "@/components/forms/ControlledConditionalTextInput";

const fields: FieldType[] = [
	{
		type: "textInput",
		name: "name",
		label: "Name",
		rules: {
			required: "Your name is required",
		},
	},
	{
		type: "textInput",
		name: "email",
		label: "Email address",
		rules: {
			required: "Your email is required",
			pattern: {
				// REGEX FOR VALIDATING MAIL ADDRESS
				value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
				message: "invalid email address",
			},
		},
	},
	{
		type: "conditionalTextInput",
		checkbox: {
			name: "has_spotify_link",
			label: "This artist is already on Spotify",
		},
		name: "spotify",
		label: "Spotify link",
		rules: {
			required: "Your spotify profile link is required",
			pattern: {
				// REGEX FOR VALIDATING SPOTIFY URL
				value: /^https:\/\/open\.spotify\.com\/(?:[a-zA-Z\-]+\/)?artist\/[a-zA-Z0-9]+$/i,
				message: "Invalid Spotify link",
			},
		},
	},
	{
		type: "conditionalTextInput",
		checkbox: {
			name: "has_apple_music_link",
			label: "This artist is already on Apple Music",
		},
		name: "apple_music",
		label: "Apple Music link",
		rules: {
			required: "Your Apple Music profile link is required",
			pattern: {
				// REGEX FOR VALIDATING SPOTIFY URL
				value: /^https?:\/\/music\.apple\.com\/[a-zA-Z]\/artist\/[^\/]+\/\d+$/i,
				message: "Invalid Apple Music link",
			},
		},
	},
];

const RequiredInformationForm = ({
	className,
	control,
	errors,
	watch,
	register,
}: FormBlockProps) => {
	return (
		<Card className={`max-w-2xl ${className}`}>
			<Headline4>Required information</Headline4>
			<div className="my-4 grid grid-flow-row gap-4">
				{fields.map((field) => {
					if (field.type === "textInput") {
						return (
							<ControlledTextInput<ArtistFields>
								key={field.name}
								control={control}
								errors={errors}
								inputName={field.name}
								inputLabel={field.label}
								rules={field.rules}
							/>
						);
					} else if (field.type === "conditionalTextInput") {
						return (
							<ControlledConditionalTextInput<ArtistFields>
								key={field.name}
								control={control}
								errors={errors}
								inputName={field.name}
								inputLabel={field.label}
								watch={watch}
								register={register}
								checkboxFieldName={field.checkbox?.name}
								checkboxLabel={field.checkbox?.label}
								rules={field.rules}
							/>
						);
					}
				})}
				{/* <Controller
					name="name"
					control={control}
					rules={{ required: "Your name is required" }}
					render={({ field }) => {
						return (
							<div>
								<TextInput
									label="Name"
									className={cx({ "border-semantic-error": errors.name })}
									{...field}
								/>
								{errors.name && <Body3 color="semantic-error">{errors.name.message}</Body3>}
							</div>
						);
					}}
				/>
				<Controller
					name="email"
					control={control}
					rules={{
						required: "Your email is required",
						pattern: {
							// REGEX FOR VALIDATING MAIL ADDRESS
							value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
							message: "Invalid email address",
						},
					}}
					render={({ field }) => {
						return (
							<div>
								<TextInput
									label="Email address"
									className={cx({ "border-semantic-error": errors.email })}
									{...field}
								/>
								{errors.email && <Body3 color="semantic-error">{errors.email.message}</Body3>}
							</div>
						);
					}}
				/>

				<label htmlFor="has_spotify_link" className="flex gap-4 align-middle">
					<input {...register("has_spotify_link")} id="has_spotify_link" type="checkbox"></input>
					<Body2 color="neutral-600">This artist is already on Spotify</Body2>
				</label>
				{watchSpotifyCheckbox && (
					<Controller
						name="spotify"
						control={control}
						rules={{
							required: "Your spotify profile link is required",
							pattern: {
								// REGEX FOR VALIDATING SPOTIFY URL
								value: /^https:\/\/open\.spotify\.com\/(?:[a-zA-Z\-]+\/)?artist\/[a-zA-Z0-9]+$/i,
								message: "Invalid Spotify link",
							},
						}}
						render={({ field }) => {
							return (
								<div>
									<TextInput
										label="Spotify link"
										className={cx({ "border-semantic-error": errors.spotify })}
										{...field}
									/>
									{errors.spotify && <Body3 color="semantic-error">{errors.spotify.message}</Body3>}
								</div>
							);
						}}
					/>
				)}
				<label htmlFor="has_apple_music_link" className="flex gap-4 align-middle">
					<input
						{...register("has_apple_music_link")}
						id="has_apple_music_link"
						type="checkbox"
					></input>
					<Body2 color="neutral-600">This artist is already on Apple Music</Body2>
				</label>
				{watchAppleMusicCheckbox && (
					<Controller
						name="apple_music"
						control={control}
						rules={{
							required: "Your apple music link is required",
							pattern: {
								// REGEX FOR VALIDATING APPLE MUSIC URL
								value: /^https?:\/\/music\.apple\.com\/[a-zA-Z]\/artist\/[^\/]+\/\d+$/i,
								message: "Invalid Apple Music link",
							},
						}}
						render={({ field }) => {
							return (
								<div>
									<TextInput
										label="Apple Music link"
										className={cx({ "border-semantic-error": errors.apple_music })}
										{...field}
									/>
									{errors.apple_music && (
										<Body3 color="semantic-error">{errors.apple_music.message}</Body3>
									)}
								</div>
							);
						}}
					/>
				)} */}
			</div>
		</Card>
	);
};
export default RequiredInformationForm;
