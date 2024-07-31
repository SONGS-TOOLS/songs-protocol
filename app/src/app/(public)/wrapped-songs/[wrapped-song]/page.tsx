"use client";

import { Body1, Body3, Button, Headline3, Modal } from "@gordo-d/mufi-ui-components";
import wrappedSongs from "@/app/dashboard/wrapped-songs/wrappedSongMockData/mintedData.json";
import { WrappedSongMetadataType } from "@/app/dashboard/wrapped-songs/types";
import WrappedSongPreview from "./components/WrappedSongPreview";
import WrappedSongBuySection from "./components/WrappedSongBuySection";
import WrappedSongSellSection from "./components/WrappedSongSellSection";
import { useState } from "react";
import WrappedSongSendSection from "./components/WrappedSongSendSection";
const wrappedSong = wrappedSongs[0] as WrappedSongMetadataType;

const WrappedSongPage = () => {
	const [sellModal, setSellModal] = useState(false);
	const [sendModal, setSendModal] = useState(false);

	return (
		<div className="grid grid-cols-12 gap-4">
			<div className="relative col-span-9 border-r">
				<WrappedSongPreview wrappedSong={wrappedSong} />
			</div>
			<div className="relative col-span-3 h-full">
				<div className="flex flex-col gap-10 p-8">
					<div className="flex w-full flex-col gap-4">
						<Body1>You own this Wrapped Song</Body1>
						<div className="flex gap-2">
							<Button className="flex-1" onClick={() => setSellModal(true)}>
								Sell
							</Button>
							<Button className="flex-1" onClick={() => setSendModal(true)}>
								Send
							</Button>
						</div>
					</div>
					<hr />
					<div className="flex flex-col gap-4">
						<div>
							<Body1>Songshares you own</Body1>
							<Headline3>10/10000</Headline3>
						</div>
						<div>
							<Body1>Earning to redeem</Body1>
							<Headline3>$5</Headline3>
						</div>
						<div>
							<Button className="w-full">Redeem</Button>
						</div>
					</div>
					<hr />
					<WrappedSongBuySection />
					<hr />
					<div className="flex flex-col gap-4">
						<div>
							<Body1>Description</Body1>
							<Body3>{wrappedSong.description}</Body3>
						</div>
						<div>
							<Body1>Attributes</Body1>
							<div className="flex flex-col gap-4">
								{wrappedSong.attributes.map((attribute) => {
									return (
										<div className="flex justify-between gap-4" key={attribute.trait_type}>
											<Body3>{attribute.trait_type}</Body3>
											<Body3>{attribute.value}</Body3>
										</div>
									);
								})}
							</div>
						</div>
					</div>
				</div>
			</div>
			{sellModal && <WrappedSongSellSection setSellModal={setSellModal} />}
			{sendModal && <WrappedSongSendSection setSendModal={setSendModal} />}
		</div>
	);
};
export default WrappedSongPage;
