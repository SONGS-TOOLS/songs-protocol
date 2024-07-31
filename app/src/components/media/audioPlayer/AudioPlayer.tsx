import { useEffect, useRef, useState } from "react";
import PlayIcon from "../../icons/PlayIcon";
import PauseIcon from "../../icons/PauseIcon";
import "./audioPlayer.css";
import ProgressBar from "./ProgressBar";
import Controls from "./Controls";

const AudioPlayer = ({ src }: { src: string }) => {
	const audioRef = useRef<HTMLAudioElement>(null);
	const progressBarRef = useRef<HTMLInputElement>(null);
	const [timeProgress, setTimeProgress] = useState(0);
	const [duration, setDuration] = useState(0);

	const onLoadedMetadata = () => {
		if (audioRef.current && progressBarRef.current) {
			const seconds = audioRef.current.duration;
			setDuration(seconds);
			progressBarRef.current.max = seconds.toString();
		}
	};
	return (
		<>
			<div className="rounded-base flex items-center gap-4 border p-4">
				<Controls
					{...{
						audioRef,
						progressBarRef,
						duration,
						setTimeProgress,
					}}
				/>
				<ProgressBar {...{ progressBarRef, audioRef, timeProgress, duration }} />
				{/* <div>00:00</div> */}
				{/* <div className="flex w-full items-center">
				<div className="h-4 w-px bg-black"></div>
				<div className="h-px w-full border-t border-black"></div>

			</div> */}
				{/* <input className="w-full" type="range" defaultValue={0} /> */}
			</div>
			<audio ref={audioRef} src={src} onLoadedMetadata={onLoadedMetadata}></audio>
		</>
	);
};
export default AudioPlayer;
