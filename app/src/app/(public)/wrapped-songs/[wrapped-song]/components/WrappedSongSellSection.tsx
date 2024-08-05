import ControlledNumberInput from "@/components/forms/ControlledNumberInput";
import NumberInput from "@/components/forms/inputs/NumberInput";
import CloseIcon from "@/components/icons/CloseIcon";
import Modal from "@/components/layout/Modal";
import { Button, Headline2, Headline3 } from "@gordo-d/mufi-ui-components";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

interface WrappedSongSellSectionProps {
	setSellModal: React.Dispatch<React.SetStateAction<boolean>>;
}

interface formFields {
	amount: number;
}

const WrappedSongSellSection = ({ setSellModal }: WrappedSongSellSectionProps) => {
	// const [amount, setAmount] = useState(1);
	const {
		handleSubmit,
		control,
		formState: { errors },
		setValue,
	} = useForm<formFields>({
		mode: "onBlur",
		defaultValues: {
			amount: 0,
		},
	});

	const onSubmit: SubmitHandler<formFields> = (data) => {
		console.log("Here is the data for the whole form");
		console.log(data);
	};

	return (
		<Modal
			closeModal={() => {
				setSellModal(false);
			}}
		>
			<div>
				<Headline3>How many Sonshares do you want to sell?</Headline3>
			</div>
			<div className="flex items-end gap-4">
				<ControlledNumberInput
					{...{ control, errors }}
					inputName="amount"
					rules={{
						min: { value: 1, message: "You must enter a value greater than 0" },
						required: "You must enter a value",
					}}
					inputLabel="Amount"
					setValue={setValue}
					className="flex-1"
				/>
				<Button onClick={handleSubmit(onSubmit)}>Sell</Button>
			</div>
		</Modal>
	);

	// return (
	// 	<div
	// 		id="modal"
	// 		className="fixed left-0 top-0 z-10 grid h-screen w-screen grid-cols-12 items-center justify-center bg-black bg-opacity-40"
	// 	>
	// 		<div className="rounded-base relative col-start-4 col-end-10 flex h-min flex-col gap-10 bg-white p-20">
	// 			<div className="absolute right-5 top-5 cursor-pointer" onClick={() => setSellModal(false)}>
	// 				<CloseIcon className="h-4 w-4" />
	// 			</div>
	// 			<div>
	// 				<Headline3>How many Sonshares do you want to sell?</Headline3>
	// 			</div>
	// 			<div className="flex gap-4">
	// 				<ControlledNumberInput
	// 					{...{ control, errors }}
	// 					inputName="amount"
	// 					rules={{
	// 						min: { value: 1, message: "You must enter a value greater than 0" },
	// 						required: "You must enter a value",
	// 					}}
	// 					inputLabel="Amount"
	// 					className="flex-1"
	// 				/>
	// 				<Button onClick={handleSubmit(onSubmit)}>Sell</Button>
	// 			</div>
	// 		</div>
	// 	</div>
	// );
};
export default WrappedSongSellSection;
