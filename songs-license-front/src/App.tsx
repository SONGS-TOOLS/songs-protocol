import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { ethers } from 'ethers';
import LicenseCard from './LicenseCard';
import SongsLicenseABI from './SongsLicenseABI.json';
import addresses from "./contractAddresses-sepolia.json";
import LicenseSVG from './LicenseCardSVG';

const App = () => {
  const { tokenId } = useParams<{ tokenId: string }>();
  const [tokenData, setTokenData] = useState<{ id: any, name: string | null }>({ id: null, name: null });

  useEffect(() => {
    const fetchTokenData = async () => {
      if (!tokenId) return;

      const contractAddress = addresses.SongsLicense;

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send('eth_requestAccounts', []);
      const signer = provider.getSigner();

      const contract = new ethers.Contract(contractAddress, SongsLicenseABI, signer);

      try {
        // Fetch the token URI from the contract
        const name = await contract.getName(tokenId);
        setTokenData({ id: tokenId, name: name });
      } catch (error) {
        console.error('Error fetching token data:', error);
      }
    };

    fetchTokenData();
  }, [tokenId]);

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

  return (
    <GradientDiv className="flex h-screen w-screen items-center justify-center p-[20px]">
      <svg width="100%" height="100%" className="absolute inset-0 mix-blend-soft-light">
        <pattern id="dottedPattern" patternUnits="userSpaceOnUse" width="10" height="10">
          <circle cx="5" cy="5" r="1" fill="#282828" />
        </pattern>
        <rect width="100%" height="100%" fill="url(#dottedPattern)" />
      </svg>
      <LicenseCard id={tokenData.id} name={tokenData.name} />
    </GradientDiv>
  );
};

export default App;
