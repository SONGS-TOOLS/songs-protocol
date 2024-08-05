import React from "react";
import styled, { keyframes } from "styled-components";
import imageWithFusion from "./assets/imagewith-fusion.png";
import logoLicense from "./assets/LogoLicense.png";

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const float = keyframes`
  0% {
    /* transform: translateY(3px); */
	opacity: 0.4;
  }
  50% {
    /* transform: translateY(-3px); */
	opacity: 0.9;
  }
  100% {
    /* transform: translateY(3px); */
	opacity: 0.4;
  }
`;

const RotatingImage = styled.img`
  mix-blend-mode: luminosity;
  opacity: 80;
  height: 120%;
  animation: ${rotate} 45s linear infinite;
`;

const StaticImage = styled.img`
  height: 28%;
  animation: ${float} 10s ease-in-out infinite;
`;

const GradientDiv = styled.div`
  background: linear-gradient(
    65deg,
    #76acf5 5%,
    #b8bad4 20%,
    #fbbab7 36%,
    #fecd8a 49%,
    #f9df7d 64%,
    #a9e6c8 79%,
    #31d0e9 99%
  );
`;

const LicenseSVG = ({ id, name }) => {
  return (
    <svg
      width="987"
      height="599"
      viewBox="0 0 987 599"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter
          id="filter0_bd_1969_12841"
          x="0"
          y="-2"
          width="987"
          height="601"
          filterUnits="userSpaceOnUse"
          color-interpolation-filters="sRGB">
          <feFlood flood-opacity="0" result="BackgroundImageFix" />
          <feGaussianBlur in="BackgroundImageFix" stdDeviation="5" />
          <feComposite
            in2="SourceAlpha"
            operator="in"
            result="effect1_backgroundBlur_1969_12841"
          />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="10" />
          <feGaussianBlur stdDeviation="9" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"
          />
          <feBlend
            mode="normal"
            in2="effect1_backgroundBlur_1969_12841"
            result="effect2_dropShadow_1969_12841"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect2_dropShadow_1969_12841"
            result="shape"
          />
        </filter>
        <linearGradient
          id="paint0_linear_1969_12841"
          x1="1006.4"
          y1="-30.8298"
          x2="-121.865"
          y2="521.565"
          gradientUnits="userSpaceOnUse">
          <stop offset="0.0461987" stop-color="#76ACF5" />
          <stop offset="0.201565" stop-color="#B8BAD4" />
          <stop offset="0.361787" stop-color="#FBBAB7" />
          <stop offset="0.488023" stop-color="#FECD8A" />
          <stop offset="0.64339" stop-color="#F9DF7D" />
          <stop offset="0.793901" stop-color="#A9E6C8" />
          <stop offset="0.992965" stop-color="#31D0E9" />
        </linearGradient>
        <linearGradient
          id="paint1_linear_1969_12841"
          x1="1006.4"
          y1="-30.8298"
          x2="-121.865"
          y2="521.565"
          gradientUnits="userSpaceOnUse">
          <stop offset="0.0461987" stop-color="#76ACF5" />
          <stop offset="0.201565" stop-color="#B8BAD4" />
          <stop offset="0.361787" stop-color="#FBBAB7" />
          <stop offset="0.488023" stop-color="#FECD8A" />
          <stop offset="0.64339" stop-color="#F9DF7D" />
          <stop offset="0.793901" stop-color="#A9E6C8" />
          <stop offset="0.992965" stop-color="#31D0E9" />
        </linearGradient>
      </defs>
      <g filter="url(#filter0_bd_1969_12841)">
        <rect
          x="18"
          y="8"
          width="951"
          height="563"
          rx="30"
          fill="url(#paint0_linear_1969_12841)"
          fill-opacity="0.4"
          shape-rendering="crispEdges"
        />
        <rect
          x="21"
          y="11"
          width="945"
          height="557"
          rx="27"
          stroke="url(#paint1_linear_1969_12841)"
          stroke-width="6"
          shape-rendering="crispEdges"
        />
        <g style="mix-blend-mode:color-burn">
          <text x="10" y="20" class="base">
            SONGS
          </text>
          <text x="10" y="40" class="base">
            LICENSE
          </text>
          <text x="10" y="60" class="base">
            NAME_PLACEHOLDER
          </text>
          <text x="10" y="80" class="base">
            ID: ID_PLACEHOLDER
          </text>
        </g>
        <g>
          <image
            href="IMAGE_URI_PLACEHOLDER"
            x="0"
            y="0"
            height="120%"
            width="120%">
            <animateTransform
              attributeName="transform"
              attributeType="XML"
              type="rotate"
              from="0 487.5 299.5"
              to="360 487.5 299.5"
              dur="45s"
              repeatCount="indefinite"
            />
          </image>
        </g>
        <g>
          <image
            href="HTML_URI_PLACEHOLDER"
            x="0"
            y="0"
            height="28%"
            width="28%">
            <animate
              attributeName="opacity"
              values="0.4;0.9;0.4"
              dur="10s"
              repeatCount="indefinite"
            />
          </image>
        </g>
      </g>
    </svg>
  );
};

export default LicenseSVG;
