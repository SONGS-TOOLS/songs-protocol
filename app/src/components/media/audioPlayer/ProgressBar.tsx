import { Body3 } from "@gordo-d/mufi-ui-components";
import { RefObject } from "react";

interface ProgressBarProps {
	progressBarRef: RefObject<HTMLInputElement>;
	audioRef: RefObject<HTMLAudioElement>;
	timeProgress: number;
	duration: number;
}

const ProgressBar = ({ progressBarRef, audioRef, timeProgress, duration }: ProgressBarProps) => {
	const handleProgressChange = () => {
		if (audioRef.current && progressBarRef.current) {
			audioRef.current.currentTime = progressBarRef.current.valueAsNumber;
		}
	};
	const formatTime = (time: number) => {
		if (time && !isNaN(time)) {
			const minutes = Math.floor(time / 60);
			const formatMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
			const seconds = Math.floor(time % 60);
			const formatSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
			return `${formatMinutes}:${formatSeconds}`;
		}
		return "00:00";
	};

	return (
		<div className="grid w-full grid-cols-12 items-center gap-2">
			<Body3 className="col-span-2">{formatTime(timeProgress)}</Body3>
			<input
				className="col-span-8"
				type="range"
				ref={progressBarRef}
				defaultValue="0"
				onChange={handleProgressChange}
			/>
			<Body3 className="col-span-2">{formatTime(duration)}</Body3>
		</div>
	);
};

export default ProgressBar;
