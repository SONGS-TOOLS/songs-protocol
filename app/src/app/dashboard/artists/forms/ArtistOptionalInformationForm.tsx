import { Card, Headline4 } from "@gordo-d/mufi-ui-components";
import { ArtistFormFields, ArtistFieldType } from "../types";
import { FormBlockProps } from "@/components/forms/types";
import ControlledInputs from "@/components/forms/ControlledInputs";
import { optionalArtistFields } from "./fields";

const ArtistOptionalInformationForm = ({
	className,
	control,
	errors,
	watch,
	register,
	setValue,
}: FormBlockProps<ArtistFormFields>) => {
	return (
		<Card className={`max-w-2xl ${className}`}>
			<Headline4>Optional information</Headline4>
			<div className="my-4 grid grid-flow-row gap-4">
				<ControlledInputs
					fields={optionalArtistFields}
					control={control}
					register={register}
					errors={errors}
					watch={watch}
					setValue={setValue}
				/>
			</div>
		</Card>
	);
};
export default ArtistOptionalInformationForm;
