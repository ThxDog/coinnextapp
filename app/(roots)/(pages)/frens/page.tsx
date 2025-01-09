"use client";
import { UserList, UserSkeletonList } from "@/components/ui/use-list";
import { api } from "@/convex/_generated/api";
import { useGetInvitees } from "@/hooks/useGetInvites";
import { useTgUser } from "@/hooks/useTgUser";
import { initUtils } from "@telegram-apps/sdk";
import { Button, Skeleton } from "@telegram-apps/telegram-ui";
import { useQuery } from "convex/react";
import React, { useState } from "react";

const PageRoot = () => {
	const utils = initUtils();
	const currentTgUser = useTgUser();
	const invitees = useGetInvitees();

	const user = useQuery(api.queries.userByTelegramId, {
		tgUserId: currentTgUser.id,
	});

	const openLink = () => {
		if (process.env.NODE_ENV === "development") {
		}

		const botLink =
			process.env.NODE_ENV === "development"
				? `https://t.me/hawk_testBot/app_hawk_test?startapp=${currentTgUser.id}`
				: `http://t.me/AppMYBAG_bot/MyBAG?startapp=${currentTgUser.id}`;
		const text = "Join me in My$BAG! It's time to fill your bags!";
		const shareLink = `https://t.me/share/url?url=${botLink}&text=${text}`;

		utils.openTelegramLink(shareLink);
	};

	const formatPricePerUpgrade = (profit: number) => {
		if (profit === undefined) return `+${0}`;
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

	return (
		<main className="relative flex-1  justify-center mb-[54px]  flex  ">
			<div className="flex flex-col h-auto">
				<div className="flex flex-col gap-4 sticky top-0 z-10 bg-[#212121] py-4 px-4">
					<div className="text-center">
						{/* biome-ignore lint/a11y/noSvgWithoutTitle: <explanation> */}
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="24"
							height="24"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
							className="lucide lucide-users mx-auto"
						>
							<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
							<circle cx="9" cy="7" r="4" />
							<path d="M22 21v-2a4 4 0 0 0-3-3.87" />
							<path d="M16 3.13a4 4 0 0 1 0 7.75" />
						</svg>
						<h2 className="text-2xl font-semibold text-white mb-2">
							Invite friend!
						</h2>
						<p className="text-sm text-white">
							Invite your friends to join My$BAG and get 10% of every reward.
							More friends, more Stitches!
						</p>
					</div>
					<Button mode="bezeled" onClick={openLink}>
						Invite friends
					</Button>
					<div className="flex items-center justify-between text-sm/6 font-medium">
						<span>Total Earned:</span>
						<span className="text-emerald-500">
							{/* biome-ignore lint/style/noNonNullAssertion: <explanation> */}
							{formatPricePerUpgrade(user?.invitePoints!)}
						</span>
					</div>
				</div>
				<div className="flex flex-col justify-start flex-1">
					{invitees === undefined ? <UserSkeletonList /> : null}

					{invitees && invitees.length === 0 && (
						<div className="px-4  flex flex-col flex-1">
							<div className="border-white flex h-[calc(100%-16px)] items-center justify-center">
								List is empty
							</div>
						</div>
					)}

					{invitees && invitees?.length > 0 ? (
						<UserList users={invitees || []} />
					) : null}
				</div>
			</div>
		</main>
	);
};

export default PageRoot;
