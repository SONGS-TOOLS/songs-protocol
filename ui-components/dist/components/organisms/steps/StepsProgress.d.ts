import { FC } from "react";
interface Step {
    label: string;
    hidden?: boolean;
}
interface ProgressStepsProps {
    steps: Step[];
    onStepChange: (index: number) => void;
    currentStep: number;
}
declare const ProgressSteps: FC<ProgressStepsProps>;
export default ProgressSteps;
