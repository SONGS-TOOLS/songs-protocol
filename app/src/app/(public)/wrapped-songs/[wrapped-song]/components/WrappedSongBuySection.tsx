import NumberInput from "@/components/forms/inputs/NumberInput";
import { Body1, Body3, Button, Headline3 } from "@gordo-d/mufi-ui-components";
import { useState } from "react";

const WrappedSongBuySection = () => {
	const [songshares, setSonghares] = useState(1);
	const priceInDollars = 1;
	return (
		<div className="flex flex-col gap-4">
			<div>
				<Body1>Price per songshare</Body1>
				<Headline3>${priceInDollars}</Headline3>
			</div>
			<div className="flex justify-between">
				<div className="h-full w-16">
					<NumberInput
						onChange={(e) => {
							setSonghares(e.target.valueAsNumber);
						}}
						value={songshares}
						className="rounded-full"
					/>
				</div>
				<div>
					<Body3>Total</Body3>
					<Body1>${songshares * priceInDollars}</Body1>
				</div>
			</div>
			<div>
				<Button className="w-full">Buy Songshares</Button>
			</div>
		</div>
	);
};
export default WrappedSongBuySection;
