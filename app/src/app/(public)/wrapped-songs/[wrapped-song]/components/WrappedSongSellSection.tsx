import ControlledNumberInput from "@/components/forms/ControlledNumberInput";
import Modal from "@/components/layout/Modal";
import { Button, Headline3 } from "@gordo-d/mufi-ui-components";
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
};
export default WrappedSongSellSection;
