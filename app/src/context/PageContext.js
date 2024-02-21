"use client"
import { createContext, useContext, useState } from 'react';

const PageContext = createContext(null);

export const PageProvider = ({ children }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedNft, setSelectedNft] = useState({ address: '', tokenId: '' });

  const nextStep = () => setCurrentStep((prevStep) => prevStep + 1);
  const prevStep = () => setCurrentStep((prevStep) => Math.max(1, prevStep - 1));
  const setStep = (step) => setCurrentStep(step);
  const selectNft = (address, tokenId) => setSelectedNft({ address, tokenId });

  return (
    <PageContext.Provider value={{ currentStep, nextStep, prevStep, setStep, selectedNft, selectNft }}>
      {children}
    </PageContext.Provider>
  );
};

export function useStep() {
  return useContext(PageContext);
}
