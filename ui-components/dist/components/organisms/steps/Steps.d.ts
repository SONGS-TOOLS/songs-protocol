import React, { ReactElement } from "react";
export interface IStep {
    action: () => void | null;
    title: string;
    description: ReactElement | string;
    image: string;
    stepCTA?: string;
}
export declare type IStepsProps = {
    steps: IStep[];
    icon: string | null;
    title: string;
    isCTAdisabled?: boolean;
    stepIndex: number;
    isStepLoading?: boolean | undefined;
    areStepsFinished?: boolean;
    finishMessage?: ReactElement | undefined;
    finishImage?: string | undefined;
    finishAction?: () => void | null;
};
export declare const Steps: React.FC<IStepsProps>;
export default Steps;
