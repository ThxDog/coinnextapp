import { isUserId } from "@/context";
import { api } from "@/convex/_generated/api";
import { useLaunchParams } from "@telegram-apps/sdk-react";
import { useConvex } from "convex/react";
import { useEffect } from "react";
import { useTgUser } from "./useTgUser";

export const useInitUser = () => {
	const currentTgUser = useTgUser();

	const lp = useLaunchParams();

	const refId = lp.startParam || "";
	const convex = useConvex();

	useEffect(() => {
		const createUser = async (newRefId?: string) => {
			if (currentTgUser.id === "") return;

			await convex.mutation(api.queries.newUser, {
				tgUserId: currentTgUser.id,
				firstName: currentTgUser.firstName || "",
				refId: newRefId,
				lastStakedTime: Date.now(),
			});
		};

		const initUser = async () => {
			const user = await convex.query(api.queries.userByTelegramId, {
				tgUserId: currentTgUser?.id,
			});

			if (currentTgUser.id === user?.tgUserId) {
				return;
			}

			const refUser = await convex.query(api.queries.userByTelegramId, {
				tgUserId: refId,
			});

			if (refUser?.tgUserId === refId) {
				await createUser(refId);
				return;
			}
			await createUser();
			const noRefUser = refId && refUser === null;

			return;
		};
		initUser();
	}, [currentTgUser, convex, refId]);
};
