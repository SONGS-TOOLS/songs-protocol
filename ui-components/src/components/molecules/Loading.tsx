import React from 'react';

type LoadingProps = {
  size?: number; // Optional prop to customize the size of the loader
  color?: string; // Optional prop to customize the color of the loader
}

const Loading: React.FC<LoadingProps> = ({ size = 50, color = '#000' }) => {
  return (
    <svg
      width={`${size}px`}
      height={`${size}px`}
      viewBox="0 0 50 50"
      style={{ display: 'block', margin: 'auto' }}
    >
      <circle
        cx="25"
        cy="25"
        r="20"
        fill="none"
        stroke={color}
        strokeWidth="5"
        strokeLinecap="round"
        strokeDasharray="31.415, 31.415"
        transform="rotate(-90 25 25)"
      >
        <animateTransform
          attributeName="transform"
          type="rotate"
          from="0 25 25"
          to="360 25 25"
          dur="1s"
          repeatCount="indefinite"
        />
      </circle>
    </svg>
  );
};

export default Loading;
