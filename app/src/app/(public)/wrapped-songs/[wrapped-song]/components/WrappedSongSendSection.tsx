import ControlledNumberInput from "@/components/forms/ControlledNumberInput";
import ControlledTextInput from "@/components/forms/ControlledTextInput";
import Modal from "@/components/layout/Modal";
import { Button, Headline3 } from "@gordo-d/mufi-ui-components";
import { SubmitHandler, useForm } from "react-hook-form";

interface WrappedSongSendSectionProps {
	setSendModal: React.Dispatch<React.SetStateAction<boolean>>;
}

interface formFields {
	amount: number;
	walletAddress: string;
}

const WrappedSongSendSection = ({ setSendModal }: WrappedSongSendSectionProps) => {
	const {
		handleSubmit,
		control,
		formState: { errors },
		setValue,
	} = useForm<formFields>({
		mode: "onBlur",
		defaultValues: {
			amount: 0,
			walletAddress: "",
		},
	});

	const onSubmit: SubmitHandler<formFields> = (data) => {
		console.log("Here is the data for the whole form");
		console.log(data);
	};

	return (
		<Modal closeModal={() => setSendModal(false)}>
			<div>
				<Headline3>To which address do you want to send?</Headline3>
			</div>
			<form className="flex flex-col gap-4">
				<ControlledTextInput
					{...{ control, errors }}
					inputName="walletAddress"
					rules={{
						required: "You must enter a wallet address",
						pattern: {
							value: /^0x[a-fA-F0-9]{40}$/,
							message: "Invalid Ethereum wallet address",
						},
					}}
					inputLabel="Wallet address"
					setValue={setValue}
				/>
				<div className="flex items-end gap-4">
					<ControlledNumberInput
						{...{ control, errors }}
						inputName="amount"
						rules={{
							min: { value: 1, message: "You must enter a value greater than 0" },
							required: "You must enter a value",
						}}
						inputLabel="Amount"
						className="flex-1"
						setValue={setValue}
					/>
					<Button onClick={handleSubmit(onSubmit)}>Send</Button>
				</div>
			</form>
		</Modal>
	);
};
export default WrappedSongSendSection;
