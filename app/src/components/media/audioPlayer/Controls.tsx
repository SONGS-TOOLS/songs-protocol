import PauseIcon from "@/components/icons/PauseIcon";
import PlayIcon from "@/components/icons/PlayIcon";
import { RefObject, useCallback, useEffect, useRef, useState } from "react";

interface ControlsProps {
	audioRef: RefObject<HTMLAudioElement>;
	progressBarRef: RefObject<HTMLInputElement>;
	duration: number;
	setTimeProgress: React.Dispatch<React.SetStateAction<number>>;
}

const Controls = ({ audioRef, progressBarRef, duration, setTimeProgress }: ControlsProps) => {
	const [isPlaying, setIsPlaying] = useState(false);

	const togglePlayPause = () => {
		setIsPlaying((prev) => !prev);
	};
	const playAnimationRef = useRef<number>();

	const repeat = useCallback(() => {
		if (audioRef.current && progressBarRef.current) {
			const currentTime = audioRef.current.currentTime;
			setTimeProgress(currentTime);
			progressBarRef.current.value = currentTime.toString();
			// console.log(currentTime);
			progressBarRef.current.style.setProperty(
				"--range-progress",
				`${(progressBarRef.current.valueAsNumber / duration) * 100}%`,
			);

			playAnimationRef.current = requestAnimationFrame(repeat);
		}
	}, [audioRef, duration, progressBarRef, setTimeProgress]);

	useEffect(() => {
		if (audioRef.current && duration > 0) {
			if (isPlaying) {
				audioRef.current.play();
			} else {
				audioRef.current.pause();
			}
			playAnimationRef.current = requestAnimationFrame(repeat);
		}
	}, [isPlaying, audioRef, repeat, duration]);

	return (
		<div onClick={togglePlayPause} className="cursor-pointer">
			{!isPlaying && <PlayIcon className="h-6" />}
			{isPlaying && <PauseIcon className="h-6" />}
		</div>
	);
};
export default Controls;
