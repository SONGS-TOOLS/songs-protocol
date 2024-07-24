import { Card, Headline4, TextInput } from "@gordo-d/mufi-ui-components";
import { ArtistFields, FieldType, FormBlockProps } from "../types";
import ControlledTextInput from "@/components/forms/ControlledTextInput";
import ControlledConditionalTextInput from "@/components/forms/ControlledConditionalTextInput";
import ControlledNumberInput from "@/components/forms/ControlledNumberInput";
import ControlledFileInput from "@/components/forms/ControlledFileInput";
const fields: FieldType[] = [
	{
		type: "fileInput",
		name: "profile_picture",
		label: "Profile picture",
	},
	{
		type: "textAreaInput",
		name: "bio",
		label: "Bio",
	},
	{
		type: "textInput",
		name: "phone_number",
		label: "Phone number",
	},
	{
		type: "numberInput",
		name: "pro_number",
		label: "Pro number",
	},
	{
		type: "textInput",
		name: "facebook",
		label: "Facebook account url",
	},
	{
		type: "textInput",
		name: "instagram",
		label: "Instagram account url",
	},
	{
		type: "textInput",
		name: "x",
		label: "X account url",
	},
	{
		type: "textInput",
		name: "tiktok",
		label: "TikTok account url",
	},
	{
		type: "textInput",
		name: "vk",
		label: "VK account url",
	},
	{
		type: "textInput",
		name: "snapchat",
		label: "Snapchat account url",
	},
	{
		type: "textInput",
		name: "songkik",
		label: "Songkik account url",
	},
	{
		type: "textInput",
		name: "youtube",
		label: "YouTube account url",
	},
	{
		type: "textInput",
		name: "soundcloud",
		label: "SoundCloud account url",
	},
	{
		type: "textInput",
		name: "wikipedia",
		label: "Wikipedia page url",
	},
	{
		type: "textInput",
		name: "website",
		label: "Website url",
	},
];
const OptionalInformationForm = ({
	className,
	control,
	errors,
	watch,
	register,
}: FormBlockProps) => {
	return (
		<Card className={`max-w-2xl ${className}`}>
			<Headline4>Optional information</Headline4>
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
					} else if (field.type === "numberInput") {
						return (
							<ControlledNumberInput<ArtistFields>
								key={field.name}
								control={control}
								errors={errors}
								inputName={field.name}
								inputLabel={field.label}
								rules={field.rules}
							/>
						);
					} else if (field.type === "fileInput") {
						return (
							<ControlledFileInput<ArtistFields>
								key={field.name}
								control={control}
								errors={errors}
								inputName={field.name}
								inputLabel={field.label}
								rules={field.rules}
								watch={watch}
								rounded={true}
								defaultImageSrc="/songs-sphere.png"
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
			</div>
		</Card>
	);
};
export default OptionalInformationForm;
