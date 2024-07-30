import { Card, Headline4 } from "@gordo-d/mufi-ui-components";
import { ArtistFormFields, ArtistFieldType } from "../types";
import { FormBlockProps } from "@/components/forms/types";
import ControlledInputs from "@/components/forms/ControlledInputs";
import { requiredArtistFields } from "./fields";

const ArtistRequiredInformationForm = ({
	className,
	control,
	errors,
	watch,
	register,
}: FormBlockProps<ArtistFormFields>) => {
	return (
		<Card className={`max-w-2xl ${className}`}>
			<Headline4>Required information</Headline4>
			<div className="my-4 grid grid-flow-row gap-4">
				<ControlledInputs
					fields={requiredArtistFields}
					control={control}
					register={register}
					errors={errors}
					watch={watch}
				/>
			</div>
		</Card>
	);
};
export default ArtistRequiredInformationForm;
