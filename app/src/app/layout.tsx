import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

import { cookieToInitialState } from "wagmi";

import { config } from "@/config";
import { ContextProvider } from "@/context";
import { PageProvider } from "@/context/PageContext";
import "@gordo-d/mufi-ui-components/styles.css";
import "./globals.css";

export const metadata: Metadata = {
	title: "SONGS | App",
	description: "Open Music Distribution Protocol",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const initialState = cookieToInitialState(config, headers().get("cookie"));

	return (
		<html lang="en">
			<head>
				<link rel="icon" href="./favicon.ico" sizes="any" />
			</head>
			<body className="min-h-screen overflow-hidden">
				<ContextProvider initialState={initialState}>
					{/* <Web3StorageProvider config={web3StorageConfig}> */}
					<PageProvider>{children}</PageProvider>
					{/* </Web3StorageProvider> */}
				</ContextProvider>
			</body>
		</html>
	);
}
