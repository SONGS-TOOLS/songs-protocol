import React from 'react';
import Image from 'next/image';
import ConnectButton from '@/components/ConnectButton';
import { useChainId } from 'wagmi';

const Header: React.FC = () => {
  const chainId = useChainId();

  return (
    <header className="relative shadow mt-3 col-start-1 col-end-13 flex justify-between items-center border-2 bg-white border-rose-300 backdrop-blur-sm rounded-lg p-2">
      <div className="flex items-center gap-3 relative">
        <Image
          src="/logo.svg"
          alt="Logo"
          width={40} // Replace with actual logo size
          height={50} // Replace with actual logo size
          className="md:inline-block"
        />
        <div className="md:flex w-full items-center mb-1">
          <h2 className="text-2xl font-semibold text-[#2b2b2b] tracking-[5px]">SONGS</h2>
          <p className="text-sm text-rose-800 pl-3 mt-1">Alpha v0.1</p>
        </div>
      </div>
      <ConnectButton />
      {chainId !== 1 && (
        <a
          className="text-sm underline absolute right-6 text-rose-700 top-[70px]"
          href={
            chainId === 11155111
              ? 'https://www.alchemy.com/faucets/ethereum-sepolia'
              : chainId === 84532
              ? 'https://app.optimism.io/faucet'
              : ''
          }
        >
          <p>{`Get ${chainId === 84532 ? 'Base Sepolia' : 'Sepolia'} ETH`}</p>
        </a>
      )}
    </header>
  );
};

export default Header;
