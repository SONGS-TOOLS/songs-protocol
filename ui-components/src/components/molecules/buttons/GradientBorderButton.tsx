import React, { useState } from "react";
import styled, { css } from "styled-components";
import cx from "classnames";
import Spinner from "../../atoms/Spinner";

export interface GradientBorderButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	label?: string;
	size?: "medium" | "small" | "compact";
	disabled?: boolean;
	loading?: boolean;
	borderWidth?: number; // New prop for border width
	gradient?: string; // New prop for gradient
	backgroundColor?: string; // New prop for background color
}

const gradientStyles = css<{ gradient?: string; borderWidth?: number }>`
  ${({ gradient = "", borderWidth = 0 }) => gradient && `
    &:before {
      content: '';
      position: absolute;
      top: 0; right: 0; bottom: 0; left: 0;
      z-index: -1;
      margin: -${borderWidth}px;
      border-radius: inherit;
      background: linear-gradient(to right, ${gradient});
    }
  `}
`;

const StyledButton = styled.button<GradientBorderButtonProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: fit-content;
  border-radius: 9999px; /* rounded-full */
  gap: 0.5rem; /* gap-2 */
  transition: all 0.2s;
  position: relative;
  padding: ${({ borderWidth }) => borderWidth}px;
  background: ${({ backgroundColor }) => backgroundColor};
  background-clip: padding-box;
  border: solid ${({ borderWidth }) => borderWidth}px transparent;
  ${gradientStyles}
  ${({ disabled }) => disabled && `
    color: #A3A3A3; /* text-neutral-600 */
    cursor: not-allowed;
  `}
  ${({ disabled, loading }) => !disabled && !loading && `
    &:hover {
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* hover:shadow-md */
    }
  `}
  ${({ loading }) => loading && `
    cursor: default;
  `}
`;
const GradientBorderButton: React.FC<GradientBorderButtonProps> = ({
	label,
	children,
	size = "medium",
	disabled = false,
	loading = false,
	borderWidth = 2, // Default border width
	gradient = "blue, green", // Default gradient
	backgroundColor = "#F5F5F5", // Default background color
	className,
	...props
}) => {
	const [isPressed, setIsPressed] = useState(false);

	const sizeClass = cx({
		"h-12 px-6 text-sm": size === "medium",
		"h-10 px-4 text-sm": size === "small",
		"h-8 px-2 text-xs": size === "compact",
	});

	return (
		<StyledButton
			className={cx(sizeClass, className)}
			onMouseDown={() => setIsPressed(true)}
			onMouseUp={() => setIsPressed(false)}
			onTouchStart={() => setIsPressed(true)}
			onTouchEnd={() => setIsPressed(false)}
			disabled={disabled}
			loading={loading}
			borderWidth={borderWidth}
			gradient={gradient}
			backgroundColor={backgroundColor}
			{...props}
		>
			<span
				className={cx(
					"flex items-center gap-2 justify-center flex-nowrap whitespace-nowrap overflow-hidden transition-opacity",
					loading ? "opacity-0" : "opacity-100",
				)}
			>
				{children ?? label}
			</span>
			{loading && (
				<span
					className={cx(
						"absolute flex items-center justify-center w-full h-full transition-opacity pointer-events-none",
						loading ? "opacity-100" : "opacity-0",
					)}
				>
					<Spinner className="w-4 h-4 fill-current" />
				</span>
			)}
		</StyledButton>
	);
};

export default GradientBorderButton;