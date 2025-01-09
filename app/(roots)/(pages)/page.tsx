"use client";
import Image from "next/image";
import { useTgUser } from "@/hooks/useTgUser";
import { api } from "@/convex/_generated/api";
import React, {
	useEffect,
	useMemo,
	useRef,
	useState,
	useTransition,
} from "react";
import { useQuery } from "convex/react";
import { claimPoints } from "@/action/claimPoints";
import { updateMiner } from "@/action/updateMiner";
import { Button } from "@telegram-apps/telegram-ui";
import Level from "@/components/lvl/Level";
import { cn } from "@/lib/utils";

const useBagImage = (place: number) => {
	const images = [
		"bronze.png",
		"silver.png",
		"gold.png",
		"platinum.png",
		"diamond.png",
	];
	return images[place] || "default.png";
};

const formatPricePerUpgrade = (profit: number) => {
	if (profit >= 1_000_000_000_000)
		return `+${(profit / 1_000_000_000_000).toLocaleString().slice(0, 3)}T`;
	if (profit >= 1_000_000_000)
		return `+${(profit / 1_000_000_000).toLocaleString().slice(0, 3)}B`;
	if (profit >= 1_000_000)
		return `+${(profit / 1_000_000).toLocaleString().slice(0, 3)}M`;
	if (profit >= 1_000)
		return `+${(profit / 1_000).toLocaleString().slice(0, 3)}K`;
	return `+${profit}`;
};

const Home = () => {
	const [points, setPoints] = useState<number>(0);

	const [isClaimPending, startClaimTransition] = useTransition();
	const [isUpgradePending, startUpgradeTransition] = useTransition();
	const [waitClaim, setWaitClaim] = useState(true);

	const currentTgUser = useTgUser();
	const user = useQuery(api.queries.userByTelegramId, {
		tgUserId: currentTgUser.id,
	});
	const hourly = 3600;

	// biome-ignore lint/style/noNonNullAssertion: <explanation>
	const timeToReward = Math.floor((user?.lvl! + 1) * hourly);
	// biome-ignore lint/style/noNonNullAssertion: <explanation>
	const _pointsPerSecond = user?.hourlyReward! / hourly;
	// biome-ignore lint/style/noNonNullAssertion: <explanation>
	const _startTime = Math.floor(user?.lastStakedTime! / 1000);
	const currentTime = Math.floor(Date.now() / 1000);
	let elapsedTime =
		currentTime - _startTime >= timeToReward
			? timeToReward
			: currentTime - _startTime;

	const totalPoints = elapsedTime * _pointsPerSecond;

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		const updatePoints = () => {
			if (waitClaim && elapsedTime >= timeToReward) {
				setWaitClaim(false);
				// eslint-disable-next-line react-hooks/exhaustive-deps
				elapsedTime = 0;
			}

			// biome-ignore lint/style/noNonNullAssertion: <explanation>
			if (totalPoints >= user?.hourlyReward!) {
				// biome-ignore lint/style/noNonNullAssertion: <explanation>
				setPoints(user?.hourlyReward!);
				// biome-ignore lint/style/noNonNullAssertion: <explanation>
			} else if (totalPoints < user?.hourlyReward!) {
				setPoints(totalPoints);
			}
		};
		const timer = setInterval(() => {
			updatePoints();
		}, 1000);

		return () => clearInterval(timer);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [elapsedTime]);

	const formatTime = (seconds: number) => {
		const remainingTime = timeToReward - seconds; // Tempo restante
		const hours = Math.floor(remainingTime / hourly);
		const minutes = Math.floor((remainingTime % hourly) / 60);
		const secs = remainingTime % 60;
		if (!waitClaim && elapsedTime >= timeToReward) return null;

		return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
	};

	const handleClaim = () => {
		startClaimTransition(() => {
			if (!waitClaim) {
				claimPoints(points, currentTgUser.id, Date.now());
				setPoints(0);
				setWaitClaim(true);
			}
		});
	};

	const handleUpgrade = () => {
		startUpgradeTransition(() => {
			updateMiner(currentTgUser.id);
		});
	};

	const getPoints = () => {
		if (points === 0) return totalPoints.toLocaleString();
		return points.toLocaleString();
	};

	return (
		<main className="flex flex-col flex-1  gap-4 py-4 px-4 overflow-hidden z-0">
			<div className="flex flex-col flex-1">
				<div className="flex flex-col gap-4 items-center justify-start flex-1 mb-14 px-4 rounded-md py-4 relative">
					{/* biome-ignore lint/style/noNonNullAssertion: <explanation> */}
					<Level user={user!} />
					<div className="shrink-0 w-full flex justify-center items-center ">
						<div className="flex items-center space-x-2">
							<Image
								width={0}
								height={0}
								sizes="100vw"
								src="/dollar-coin.png"
								alt="Dollar Coin"
								className="w-10 h-10"
							/>
							<p className="text-4xl font-extrabold text-white">
								{user?.points.toLocaleString()}
							</p>
						</div>
					</div>
					<div className=" flex items-center justify-center  z-[2] flex-1">
						<Image
							width={0}
							height={0}
							sizes="100vw"
							quality={100}
							src={`/${
								// biome-ignore lint/style/noNonNullAssertion: <explanation>
								useBagImage(user?.lvl!)
							}`}
							alt="Background image"
							className="object-cover w-full max-w-60"
						/>
					</div>
					<div className="flex flex-col items-start gap-2 self-stretch z-[3]   mb-4">
						<div className="flex items-start gap-2 flex-1 self-stretch justify-between">
							<div className="flex flex-col items-start gap-2 flex-1">
								<div className="flex flex-col items-start gap-2">
									<div className="flex items-center gap-2 justify-start w-full">
										<Image
											width={0}
											height={0}
											sizes="100vw"
											src="/stake-coin.png"
											alt="Stake Coin"
											className="size-6"
										/>
										<span className="text-xs/6 font-semibold">
											{getPoints()} $BAG
										</span>
									</div>

									<Button
										disabled={
											waitClaim || elapsedTime < timeToReward || isClaimPending
										}
										mode="bezeled"
										loading={isClaimPending}
										onClick={handleClaim}
										className=" flex items-center justify-center gap-2 relative"
									>
										{waitClaim && elapsedTime < timeToReward && (
											<span className="absolute inset-0 flex items-center justify-center">
												{formatTime(elapsedTime)}
											</span>
										)}

										<span
											className={cn("text-sm/8 font-semibold", {
												// biome-ignore lint/complexity/useLiteralKeys: <explanation>
												["opacity-0"]: waitClaim && elapsedTime < timeToReward,
											})}
										>
											Claim $BAG
										</span>
									</Button>
								</div>
							</div>

							<div className="flex flex-col items-end gap-2 flex-1">
								<div className="flex flex-col items-end gap-2">
									<div className="flex items-center gap-2 justify-end w-full">
										<Image
											width={0}
											height={0}
											sizes="100vw"
											src="/miner.png"
											alt="Miner Coin"
											className="size-6"
										/>
										<span className="text-xs/6 font-semibold">
											{user?.miner} Bag´s
										</span>
									</div>
									<Button
										mode="bezeled"
										disabled={isUpgradePending}
										loading={isUpgradePending}
										onClick={handleUpgrade}
										className="flex items-center justify-center gap-2"
									>
										<span className="text-sm/8 font-semibold">Upgrade</span>{" "}
										<span className="text-xs font-semibold text-emerald-500">
											{/* biome-ignore lint/style/noNonNullAssertion: <explanation> */}
											{formatPricePerUpgrade(user?.minerCost!)}
										</span>
									</Button>
								</div>
							</div>
						</div>
					</div>
					<div
						id="background"
						className="absolute w-96 h-96 rounded-full blur-3xl opacity-35  z-[1] top-40 "
					/>
				</div>
			</div>
		</main>
	);
};

export default Home;
