import cx from 'classnames';
import React from 'react';

interface StepListItemProps {
  stepNumber: number;
  title: string;
  details: string;
  isActive: boolean;
}

const StepListItem: React.FC<StepListItemProps> = ({ stepNumber, title, details, isActive }) => {
  const borderColorClass = isActive ? 'border-rose-600' : 'border-gray-500';
  const textColorClass = isActive ? 'text-rose-600' : 'text-gray-500';

  return (
    <li
      className={cx(
        "flex space-x-2.5 rtl:space-x-reverse",
        isActive ? "text-rose-600 border-rose-600" : "text-gray-500 border-gray-500"
      )}>
      <span
        className={cx(
          "flex items-center mt-1 justify-center w-8 h-8 border rounded-full shrink-0",
          borderColorClass
        )}>
        {stepNumber + 1}
      </span>
      <span>
        <h3 className={`font-medium leading-tight ${textColorClass}`}>
          {title}
        </h3>
        <p className="text-sm">{details}</p>
      </span>
    </li>
  );
};

export default StepListItem;

