import React from "react";
import styled, { keyframes } from "styled-components";
import imageWithFusion from './assets/imagewith-fusion.png';
import logoLicense from './assets/LogoLicense.png';

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

const LicenseCard = ({ id, name }) => {
  return (
    <div
      className="relative aspect-[3.5/2] w-full rounded-3xl backdrop-blur-[0.5px]"
      style={{ boxShadow: "0 6px 0px 2px rgba(0, 0, 0, 0.05)" }}>
      <GradientDiv className=" absolute z-10 flex h-full w-full gap-2 rounded-3xl opacity-70 mix-blend-soft-light"></GradientDiv>
      <div
        className="absolute z-20 flex h-full w-full flex-col items-center gap-5 rounded-3xl border-[2px] border-[#ffffff] opacity-30"
        style={{ mixBlendMode: "soft-light" }}></div>
      <div className="absolute z-30 flex h-full w-full flex-col items-center justify-center gap-5">
        <div className="relative flex h-full w-full items-center justify-center">
          <div className=" opacity-80 h-[100%] flex justify-center items-center">
            <RotatingImage
              src={imageWithFusion}
              alt="Background License"
              className="rounded-lg"
            />
          </div>
          <StaticImage
            src={logoLicense}
            alt="Logo"
            className="absolute rounded-lg opacity-80 mix-blend-multiply"
          />
        </div>
        <div
          className="absolute z-50 w-full h-full opacity-40"
          style={{ mixBlendMode: "soft-light" }}>
          <p className="leading- absolute left-1 top-0 ml-1 p-5 text-xs font-title font-semibold text-black tracking-[4px] mix-blend-soft-light z-50">
            SONGS
          </p>
          <p className="leading- absolute right-1 top-0 ml-1 p-5 text-xs font-title font-semibold opacity-80 text-black tracking-[3px] mix-blend-soft-light">
            LICENSE
          </p>
          {name && (
            <p className="absolute bottom-0 left-1 p-5 ml-1 text-xs font-title font-semibold text-black tracking-[3px] mix-blend-soft-light">
              <span>{name}</span>
            </p>
          )}
          {id && (
            <p className="absolute bottom-0 right-1 p-5 mr-1 text-xs font-title font-semibold text-black tracking-[3px] mix-blend-soft-light">
              ID: <span>{id}</span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default LicenseCard;
