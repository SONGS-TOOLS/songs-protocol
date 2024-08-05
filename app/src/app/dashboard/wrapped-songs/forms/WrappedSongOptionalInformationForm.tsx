import { Card, Headline4 } from "@gordo-d/mufi-ui-components";
import { WrappedSongFormFields, WrappedSongFieldType } from "../types";
import { FormBlockProps } from "@/components/forms/types";
import ControlledInputs from "@/components/forms/ControlledInputs";
import { optionalWrappedSongFields } from "./fields";
const WrappedSongOptionalInformationForm = ({
	className,
	control,
	errors,
	watch,
	register,
	setValue,
}: FormBlockProps<WrappedSongFormFields>) => {
	return (
		<Card className={`max-w-2xl ${className}`}>
			<Headline4>Optional information</Headline4>
			<div className="my-4 grid grid-flow-row gap-4">
				<ControlledInputs
					fields={optionalWrappedSongFields}
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
export default WrappedSongOptionalInformationForm;
