"use client";

import { MusicMetadata, defaultMusicMetadata } from "@/components/FormMetadata";
import { ReactNode, createContext, useContext, useState } from "react";

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
  setSelectedNft: ({}:{address: string, tokenId: string}) => void;
  trackFile: File | undefined; // Indica que trackFile puede ser string o undefined
  setTrackFile: (track: File) => void; // Corrección aquí
  trackCover: File | undefined; // Indica que trackFile puede ser string o undefined
  uploadingStatus: string,
  setUploadingStatus: (status: string) => void; 
  setTrackCover: (track: File) => void; // Corrección aquí
  musicMetadata: MusicMetadata;
  setMusicMetadata: (metadata: MusicMetadata) => void;
}

const PageContext = createContext<PageContextType | null>(null);

interface PageProviderProps {
  children: ReactNode;
}

export const PageProvider = ({ children }: PageProviderProps): JSX.Element => {
  // STATE
  

  const [currentStep, setCurrentStep] = useState<number>(0);
  const [selectedNft, setSelectedNft] = useState<Nft>({
    address: "",
    tokenId: "",
  });
  const [trackFile, setTrackFile] = useState<File>();
  const [uploadingStatus, setUploadingStatus] = useState<string>();
  const [trackCover, setTrackCover] = useState<File>();
  const [musicMetadata, setMusicMetadata] =
    useState<MusicMetadata>(defaultMusicMetadata);

  // SETTERS
  const nextStep = () => setCurrentStep((prevStep) => prevStep + 1);
  const prevStep = () =>
    setCurrentStep((prevStep) => Math.max(0, prevStep - 1)); // Changed to allow returning to step 0
  const setStep = (step: number) => setCurrentStep(step);

  const providerValues = {
    currentStep,
    nextStep,
    prevStep,
    setStep,
    selectedNft,
    setSelectedNft,
    trackFile,
    setTrackFile,
    trackCover,
    setTrackCover,
    uploadingStatus,
    setUploadingStatus,
    musicMetadata,
    setMusicMetadata
  };

  return (
    <PageContext.Provider value={providerValues}>
      {children}
    </PageContext.Provider>
  );
};

export function usePageContext(): PageContextType {
  const context = useContext(PageContext);
  if (!context) {
    throw new Error("usePageContext must be used within a PageProvider");
  }
  return context;
}
