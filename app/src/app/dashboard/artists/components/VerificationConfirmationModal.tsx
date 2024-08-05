import ControlledNumberInput from "@/components/forms/ControlledNumberInput";
import Modal from "@/components/layout/Modal";
import { Button, Headline3, Headline4 } from "@gordo-d/mufi-ui-components";
import { SubmitHandler, useForm, UseFormHandleSubmit } from "react-hook-form";
import { ArtistFormFields } from "../types";

interface VerificationModalProps {
	setVerificationConfirmationModal: React.Dispatch<React.SetStateAction<boolean>>;
	handleSubmit: () => void;
}

const VerificationConfirmationModal = ({
	setVerificationConfirmationModal,
	handleSubmit,
}: VerificationModalProps) => {
	// const onSubmit: SubmitHandler<ArtistFormFields> = (data) => {
	// 	console.log("Here is the data for the whole form");
	// 	console.log(data);
	// };

	return (
		<Modal
			closeModal={() => {
				setVerificationConfirmationModal(false);
			}}
		>
			<div>
				<Headline4 className="text-center">
					Once we verify this artist you will not be able to edit their name, Spotify URL or Apple
					Music URL
				</Headline4>
			</div>
			<div className="flex items-end justify-center gap-4">
				<Button
					onClick={() => {
						handleSubmit();
					}}
				>
					Verify this artist
				</Button>
			</div>
		</Modal>
	);
};
export default VerificationConfirmationModal;
