import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

import { cookieToInitialState } from "wagmi";

import { config } from "@/config";
import { ContextProvider } from "@/context";
import { PageProvider } from "@/context/PageContext";
import "@gordo-d/mufi-ui-components/styles.css";
import "./globals.css";
import Logo from "@/components/typography/Logo";
import PersonIcon from "@/components/icons/PersonIcon";

export const metadata: Metadata = {
	title: "SONGS | App",
	description: "Open Music Distribution Protocol",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	// const initialState = cookieToInitialState(config, headers().get("cookie"));

	return (
		<html lang="en">
			<head>
				<link rel="icon" href="./favicon.ico" sizes="any" />
			</head>
			<body className="min-h-screen">
				{/* <ContextProvider initialState={initialState}> */}
				{/* <Web3StorageProvider config={web3StorageConfig}> */}
				{/* <PageProvider> */}
				{/* <header className="flex items-center justify-between border-b px-8 py-4">
					<Logo graphic={true} />
					<PersonIcon className="h-8 w-8 stroke-black" />
				</header> */}
				{children}
				{/* </PageProvider> */}
				{/* </Web3StorageProvider> */}
				{/* </ContextProvider> */}
			</body>
		</html>
	);
}
