import React from 'react';

export default function Ring(props: React.SVGAttributes<SVGSVGElement>): JSX.Element {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="100"
      height="100"
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid"
      strokeWidth="12"
      stroke="#307fb7"
      {...props}
    >
      <circle
        cx="50"
        cy="50"
        r="44"
        fill="none"
        stroke="inherit"
        strokeWidth="inherit"
        strokeOpacity="0.4"
      />
      <circle
        cx="50"
        cy="50"
        r="44"
        fill="none"
        stroke="inherit"
        strokeWidth="inherit"
        strokeDasharray="164.93361431346415 56.97787143782138"
        transform="rotate(324.915 50 50)"
      >
        <animateTransform
          attributeName="transform"
          type="rotate"
          repeatCount="indefinite"
          dur="1s"
          // from="0 50 50"
          // to="360 50 50"
          // begin="0s"
          values="0 50 50;360 50 50"
          keyTimes="0;1"
        />
      </circle>
    </svg>
  );
}
