"use client"

import { ReactNode, createContext, useContext, useState } from 'react';

interface Nft {
  address: string;
  tokenId: string;
}

interface PageContextType {
  currentStep: number;
  nextStep: () => void;
  prevStep: () => void;
  setStep: (step: number) => void;
  selectedNft: Nft;
  selectNft: (address: string, tokenId: string) => void;
}

const PageContext = createContext<PageContextType | null>(null);

interface PageProviderProps {
  children: ReactNode;
}

export const PageProvider = ({ children }: PageProviderProps): JSX.Element => {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [selectedNft, setSelectedNft] = useState<Nft>({ address: '', tokenId: '' });

  const nextStep = () => setCurrentStep((prevStep) => prevStep + 1);
  const prevStep = () => setCurrentStep((prevStep) => Math.max(0, prevStep - 1)); // Changed to allow returning to step 0
  const setStep = (step: number) => setCurrentStep(step);
  const selectNft = (address: string, tokenId: string) => setSelectedNft({ address, tokenId });

  return (
    <PageContext.Provider value={{ currentStep, nextStep, prevStep, setStep, selectedNft, selectNft }}>
      {children}
    </PageContext.Provider>
  );
};

export function usePageContext(): PageContextType {
  const context = useContext(PageContext);
  if (!context) {
    throw new Error('usePageContext must be used within a PageProvider');
  }
  return context;
}
