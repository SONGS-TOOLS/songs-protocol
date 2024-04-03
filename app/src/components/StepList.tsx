import React from 'react';
import StepListItem from './StepListItem';

interface Step {
  stepNumber: number;
  title: string;
  details: string;
}

interface StepsListProps {
  steps: Step[];
  currentStep: number;
}

const StepsList: React.FC<StepsListProps> = ({ steps, currentStep }) => {
  return (
    <ol className="p-2 space-y-4 sm:flex flex-col">
      {steps.map((step) => (
        <StepListItem
          key={step.stepNumber}
          stepNumber={step.stepNumber}
          title={step.title}
          details={step.details}
          isActive={currentStep >= step.stepNumber}
        />
      ))}
    </ol>
  );
};

export default StepsList;
