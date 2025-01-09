import type React from "react";
import { useState, useEffect } from "react";

interface CountdownTimerProps {
	totalSeconds: number;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ totalSeconds }) => {
	const [timeLeft, setTimeLeft] = useState(totalSeconds);

	useEffect(() => {
		const intervalId = setInterval(() => {
			setTimeLeft((prevTime) => {
				if (prevTime <= 1) {
					clearInterval(intervalId);
					return 0;
				}
				return prevTime - 1;
			});
		}, 1000);

		return () => clearInterval(intervalId);
	}, []);

	const formatTime = (seconds: number): string => {
		const hours = Math.floor(seconds / 3600);
		const minutes = Math.floor((seconds % 3600) / 60);
		const secs = seconds % 60;

		return `${pad(hours)}:${pad(minutes)}:${pad(secs)}`;
	};

	const pad = (value: number): string => {
		return value < 10 ? `0${value}` : value.toString();
	};

	return <div>{formatTime(timeLeft)}</div>;
};

export default CountdownTimer;
