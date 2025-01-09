"use client";
import { claimPoints } from "@/action/claimPoints";
import { updateMiner } from "@/action/updateMiner";
import Navbar from "@/components/navbar/navbar";
import Footer from "@/components/ui/footer";
import { api } from "@/convex/_generated/api";
import { useTgUser } from "@/hooks/useTgUser";
import { useQuery } from "convex/react";
import Image from "next/image";
import React, {
	useEffect,
	useState,
	useTransition,
	type PropsWithChildren,
} from "react";

const Layout = ({ children }: PropsWithChildren) => {
	const currentTgUser = useTgUser();

	useEffect(() => {
		const root = document.querySelector(
			".tgui-865b921add8ee075",
		) as HTMLDivElement;
		root.style.setProperty("--tgui--link_color", "#212121");
	}, []);

	const user = useQuery(api.queries.userByTelegramId, {
		tgUserId: currentTgUser.id,
	});
	if (!user)
		return (
			<div className="root__loading">
				<div className="lds-ripple">
					<div />
					<div />
				</div>
			</div>
		);

	return (
		<>
			<div className="w-full m-auto flex flex-col h-full  flex-1">
				{/* biome-ignore lint/style/noNonNullAssertion: <explanation> */}
				<Navbar user={user!} />
				<div className="flex flex-col flex-1">{children}</div>
				<Footer />
			</div>
		</>
	);
};

export default Layout;
