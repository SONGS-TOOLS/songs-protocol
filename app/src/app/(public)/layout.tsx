import Logo from "@/components/typography/Logo";
import PersonIcon from "@/components/icons/PersonIcon";

export default function PublicViewLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	// const initialState = cookieToInitialState(config, headers().get("cookie"));

	return (
		<>
			{/* <ContextProvider initialState={initialState}> */}
			{/* <Web3StorageProvider config={web3StorageConfig}> */}
			{/* <PageProvider> */}
			<div className="grid min-h-screen grid-rows-[auto_1fr]">
				<header className="flex items-center justify-between border-b px-8 py-4">
					<Logo graphic={true} />
					<PersonIcon className="h-8 w-8 stroke-black" />
				</header>
				{children}
			</div>
			{/* </PageProvider> */}
			{/* </Web3StorageProvider> */}
			{/* </ContextProvider> */}
		</>
	);
}
