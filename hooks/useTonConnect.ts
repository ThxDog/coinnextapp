import { TonClientContext } from "@/context/ton-client-context";
import { Address, type Sender, type SenderArguments } from "@ton/core";
import type { TonClient } from "@ton/ton";
import type { TonConnectUI } from "@tonconnect/ui";
import {
	type CHAIN,
	useTonConnectUI,
	useTonWallet,
} from "@tonconnect/ui-react";
import { useContext } from "react";

export const useTonConnect = (): {
	sender: Sender;
	connected: boolean;
	walletAddress: Address | null;
	network: CHAIN | null;
	tonConnectUI: TonConnectUI;
	tonClient: TonClient | undefined;
} => {
	const [tonConnectUI] = useTonConnectUI();
	const wallet = useTonWallet();
	const { tonClient } = useContext(TonClientContext);

	const walletAddress = wallet?.account?.address
		? Address.parse(wallet.account.address)
		: undefined;
	return {
		sender: {
			send: async (args: SenderArguments) => {
				await tonConnectUI.sendTransaction({
					from: walletAddress?.toString(),
					messages: [
						{
							address: args.to.toString(),
							amount: args.value.toString(),
							payload: args.body?.toBoc()?.toString("base64"),
						},
					],
					validUntil: Date.now() + 5 * 60 * 1000, // 5 minutes for user to approve
				});
			},
			address: walletAddress,
		},

		connected: !!wallet?.account?.address,
		walletAddress: walletAddress ?? null,
		network: wallet?.account?.chain ?? null,
		tonConnectUI,
		tonClient,
	};
};
