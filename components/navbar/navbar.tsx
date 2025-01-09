"use client";
import { updateLvl } from "@/action/updateLvl";
import type { api } from "@/convex/_generated/api";
import type { FunctionReturnType } from "convex/server";

import Image from "next/image";
import React, { useEffect, useMemo, useState } from "react";

const Navbar = (props: {
	user: FunctionReturnType<typeof api.queries.userByTelegramId>;
}) => {
	const { user } = props;
	// biome-ignore lint/style/noNonNullAssertion: <explanation>
	const lvl = user?.lvl!;

	const formatProfitPerHour = (profit: number) => {
		if (profit >= 1000000000) return `+${(profit / 1000000000).toFixed(2)}B`;
		if (profit >= 1000000) return `+${(profit / 1000000).toFixed(2)}M`;
		if (profit >= 1000) return `+${(profit / 1000).toFixed(2)}K`;
		return `+${profit}`;
	};

	const levelMinPoints = useMemo(() => {
		return [
			0, // Bronze
			50000, // 50k Silver
			150000, // 150k Gold
			1000000, // 1m Platinum
			100000000, // 1000m Diamond
		];
	}, []);

	const nextLevel = () => {
		if (lvl === levelMinPoints.length - 1) return "Lvl Max";
		return levelMinPoints[lvl + 1].toLocaleString();
	};

	return (
		<header className="flex items-center justify-between relative py-2 px-4 bg-[#111111] z-[100]">
			<div className="flex flex-col items-center justify-start flex-1 ">
				<span className="text-[10px]/4 text-white/80 mr-auto">
					Points for the next level
				</span>
				<div className="flex items-center gap-2 mr-auto">
					<span className="text-sm/6 font-medium">{nextLevel()}</span>
				</div>
			</div>

			<div className="flex flex-col items-center flex-1">
				<span className="text-[10px]/4 text-white/80 ml-auto">
					Profit per hour
				</span>
				<div className="flex items-center gap-2 ml-auto">
					<Image
						width={0}
						height={0}
						sizes="100vw"
						className="size-4"
						src="/dollar-coin.png"
						alt="Dolar Icon"
					/>
					<span className="text-sm/6 font-medium">
						{/* biome-ignore lint/style/noNonNullAssertion: <explanation> */}
						{formatProfitPerHour(user?.hourlyReward!)}{" "}
					</span>
				</div>
			</div>
		</header>
	);
};

export default Navbar;
