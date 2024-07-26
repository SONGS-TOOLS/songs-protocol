import React from 'react';
import ReactDOM from 'react-dom';
import LicenseCard from './LicenseCard';
import { ethers } from 'ethers';
import SongsLicenseABI from './SongsLicenseABI.json'; // ABI of the SongsLicense contract

const provider = new ethers.providers.Web3Provider(window.ethereum);
const contractAddress = 'YOUR_CONTRACT_ADDRESS';
const contract = new ethers.Contract(contractAddress, SongsLicenseABI, provider);

async function fetchLicenseData(tokenId) {
    const name = await contract.getName(tokenId);
    return { id: tokenId, name };
}

async function renderLicenseCard(tokenId) {
    const licenseData = await fetchLicenseData(tokenId);
    ReactDOM.render(
        <LicenseCard id={licenseData.id} name={licenseData.name} />,
        document.getElementById('root')
    );
}

// Example tokenId to display
const tokenId = 1;
renderLicenseCard(tokenId);