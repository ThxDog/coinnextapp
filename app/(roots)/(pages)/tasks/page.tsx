"use client";
import { initTask } from "@/action/initTask";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { useTgUser } from "@/hooks/useTgUser";
import { Button, IconButton, Link } from "@telegram-apps/telegram-ui";
import { useQuery } from "convex/react";
import { CheckIcon } from "lucide-react";
import Image from "next/image";
import React from "react";

const Page = () => {
	const currentTgUser = useTgUser();

	const user = useQuery(api.queries.userByTelegramId, {
		tgUserId: currentTgUser.id,
	});

	const task = useQuery(api.queries.allTasks);

	const initTasks = (taskId: Id<"tasks">) => {
		// biome-ignore lint/style/noNonNullAssertion: <explanation>
		initTask(user?.tgUserId!, taskId);
	};

	const src = [
		{ name: "telegram", src: "/3d-telegram.png" },
		{ name: "x", src: "/3d-x.png" },
	];

	return (
		<main className="flex flex-col flex-1  gap-4 py-4 px-4">
			<div className="w-full flex items-center justify-center">
				<Image
					width={0}
					height={0}
					sizes="100vw"
					quality={100}
					src="/task.png"
					alt="Task"
					className="w-full max-w-24"
				/>
			</div>
			<div className="flex flex-col gap-4">
				<span className="text-base/8 font-medium">Global Tasks</span>
				<div className="flex flex-col gap-2">
					{!task?.length && (
						<div className="flex flex-col gap-2">
							{Array.from({ length: 3 }).map((_, index) => (
								<Skeleton className="w-full h-16" key={index.toString()} />
							))}
						</div>
					)}

					{task?.length &&
						task?.map((t) => {
							const isCompletedTask = Boolean(
								user?.completeTasks?.find((user) => user.tasksId === t._id),
							);

							const isLink = t.url && !isCompletedTask;

							return (
								<div
									key={t._id}
									className="flex flex-col rounded-md bg-white/5 p-2 relative overflow-hidden"
								>
									<button
										type="button"
										disabled={isCompletedTask}
										onClick={() => initTasks(t._id)}
										className="absolute inset-0  disabled:bg-transparent bg-white/5 z-50"
									>
										{isLink && (
											<Link
												href={t.url}
												target="_blank"
												className="absolute inset-0  z-50"
											/>
										)}
									</button>

									<div className="flex items-center justify-start gap-4  w-full">
										<Avatar>
											<AvatarImage src={t.image} className="bg-white/10" />
										</Avatar>

										<div className="flex items-center justify-between w-full">
											<div className="flex flex-col items-start">
												<span className="text-sm/6">{t.name}</span>
												<span className="text-xs/6">{t.description}</span>
											</div>

											{!isCompletedTask && (
												<div className="flex items-center justify-end gap-2">
													<span className="text-xs/6">
														Points: {t.points.toLocaleString()}
													</span>
												</div>
											)}
											{isCompletedTask && (
												<CheckIcon className="text-emerald-500" />
											)}
										</div>
									</div>
								</div>
							);
						})}
				</div>
			</div>
		</main>
	);
};

export default Page;
