import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { useTgUser } from "./useTgUser";

export const useGetInvitees = () => {
	const currentTgUser = useTgUser();

	const invitees = useQuery(api.queries.invitees, {
		tgUserId: currentTgUser.id as Id<"users">,
	});

	return invitees;
};
