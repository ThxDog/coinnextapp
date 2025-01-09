"use client";
import { updateLvl } from "@/action/updateLvl";
import type { api } from "@/convex/_generated/api";
import type { FunctionReturnType } from "convex/server";

import Image from "next/image";
import React, { useEffect, useMemo, useState } from "react";

const Level = (props: {
	user: FunctionReturnType<typeof api.queries.userByTelegramId>;
}) => {
	const { user } = props;
	// biome-ignore lint/style/noNonNullAssertion: <explanation>
	const points = user?.points!;
	// biome-ignore lint/style/noNonNullAssertion: <explanation>
	const lvl = user?.lvl!;
	// biome-ignore lint/style/noNonNullAssertion: <explanation>
	const userTg = user?.tgUserId!;

	const formatProfitPerHour = (profit: number) => {
		if (profit >= 1000000000) return `+${(profit / 1000000000).toFixed(2)}B`;
		if (profit >= 1000000) return `+${(profit / 1000000).toFixed(2)}M`;
		if (profit >= 1000) return `+${(profit / 1000).toFixed(2)}K`;
		return `+${profit}`;
	};

	const levelNames = ["Bronze", "Silver", "Gold", "Platinum", "Diamond"];

	const levelMinPoints = useMemo(() => {
		return [
			0, // Bronze
			50000, // 50k Silver
			150000, // 150k Gold
			1000000, // 1m Platinum
			100000000, // 1000m Diamond
		];
	}, []);

	const calculateProgress = () => {
		if (lvl >= levelNames.length - 1) {
			return 100;
		}
		const nextLevelMin = levelMinPoints[lvl + 1];

		const progress = (points / nextLevelMin) * 100;

		return Math.min(progress, 100);
	};

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		const nextLevelMin = levelMinPoints[lvl + 1];

		if (points >= nextLevelMin && lvl < levelNames.length - 1) {
			updateLvl(userTg, lvl + 1);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [points, levelMinPoints]);

	return (
		<div className="flex shrink-0  items-center w-full ">
			<div className="w-full">
				<div className="flex justify-between">
					<p className="text-sm/6">{levelNames[lvl]}</p>
					<p className="text-sm/6">
						{lvl + 1}{" "}
						<span className="text-white/80">/ {levelNames.length}</span>
					</p>
				</div>
				<div className="flex items-center mt-1 border-2 border-white/10 rounded-full">
					<div className="w-full h-4 bg-white/5 rounded-full">
						<div
							className="bg-gradient-to-r transition-all duration-300 from-teal-400 to-yellow-200 h-4 rounded-full"
							style={{ width: `${calculateProgress()}%` }}
						/>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Level;
