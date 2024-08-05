import QuestionMarkIcon from "@/components/icons/QuestionMarkIcon";
import { Body2, Body3 } from "@gordo-d/mufi-ui-components";
interface TooltipProps {
	tooltip: string;
}
const Tooltip = ({ tooltip }: TooltipProps) => {
	return (
		<div className="group relative h-4 w-4">
			<div>
				<QuestionMarkIcon className="h-4 w-4" />
			</div>
			<div className="rounded-base absolute left-6 top-2/4 hidden w-max max-w-64 -translate-y-2/4 border bg-white p-4 group-hover:block">
				<Body3>{tooltip}</Body3>
			</div>
		</div>
	);
};
export default Tooltip;
