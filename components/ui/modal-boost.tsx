import { boostAccount } from "@/action/boostAccount";
import {
	INVOICE_WALLET_ADDRESS,
	USDT_MASTER_ADDRESS,
} from "@/constants/common-constants";
import { JETTON_TRANSFER_GAS_FEES } from "@/constants/fees.constants";
import { calculateUsdtAmount } from "@/helpers/common-helpers";
import { useMainButton } from "@/hooks/useMainButton";
import { useTgUser } from "@/hooks/useTgUser";
import { useTonConnect } from "@/hooks/useTonConnect";
import { JettonWallet } from "@/wrappers/JettonWallet";
import { TonWallet } from "@/wrappers/tonWallet";
import {
	Button,
	Caption,
	Divider,
	Image,
	LargeTitle,
	Modal,
	Placeholder,
	Title,
} from "@telegram-apps/telegram-ui";
import { ModalHeader } from "@telegram-apps/telegram-ui/dist/components/Overlays/Modal/components/ModalHeader/ModalHeader";
import { SendMode, TonClient, WalletContractV4, internal } from "@ton/ton";
import {
	TonConnectButton,
	useTonConnectModal,
	useTonConnectUI,
} from "@tonconnect/ui-react";
import { CheckIcon, RocketIcon, WalletIcon } from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";
import TonWeb from "tonweb";
import { getHttpEndpoint } from "@orbs-network/ton-access";
import { mnemonicNew, mnemonicToPrivateKey } from "@ton/crypto";

const ModalBoost = () => {
	const [payment, setPayment] = useState<boolean>(false);
	const [confirm, setConfirm] = useState<boolean>(false);
	const user = useTgUser();
	const { open } = useTonConnectModal();
	const { sender, walletAddress, tonClient } = useTonConnect();
	const handleConnectWallet = useCallback(() => {
		open();
	}, [open]);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	const handleCompletePayment = useCallback(async () => {
		try {
			if (!tonClient || !walletAddress) return;

			await sender.send({
				to: INVOICE_WALLET_ADDRESS,
				value: JETTON_TRANSFER_GAS_FEES,
				sendMode: SendMode.PAY_GAS_SEPARATELY,
			});

			console.log("pagou");

			setTimeout(() => {
				setConfirm(true);
				setPayment(true);
			});
		} catch (error) {
			console.log("Payment Error:", error);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [sender, tonClient, walletAddress, confirm]);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		if (confirm) {
			const isConfirm = async () => {
				await boostAccount(user.id);
				setConfirm(false);
			};
			isConfirm();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [confirm]);

	//   useMainButton(
	//     walletAddress
	//       ? { text: "Complete payment", onClick: () => {} }
	//       : { text: "Connect Wallet", onClick: handleConnectWallet }
	//   );

	if (!walletAddress)
		return (
			// biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
			<span
				onClick={handleConnectWallet}
				className="flex justify-center items-center gap-2 flex-1 transition-colors ease-in duration-300  rounded-lg hover:text-sky-500 py-1"
			>
				<WalletIcon className="size-6" />
			</span>
		);

	return (
		<Modal
			className=""
			trigger={
				<span className="flex justify-center items-center gap-2 flex-1 transition-colors ease-in duration-300  rounded-lg hover:text-sky-500 py-1">
					<RocketIcon className="size-6" />
				</span>
			}
		>
			{payment && (
				<div className="flex flex-col gap-2 p-8 items-center z-[9999]">
					<CheckIcon className="size-12 text-emerald-500" />
					<span className="text-base/8">Payment made successfully</span>
					<div className="flex flex-col gap-2 mt-4">
						<Button
							mode="gray"
							onClick={() => {
								window.location.reload();
							}}
						>
							Go to homepage
						</Button>
						<Button mode="plain" onClick={() => setPayment(false)}>
							New Payment
						</Button>
					</div>
				</div>
			)}
			{!payment && (
				<div className=" flex flex-col items-center  p-8 gap-8 z-[9999]">
					{/* <span className="text-sm/6">{`${walletAddress.toString().substring(0, 6)}...${walletAddress.toRawString().substring(walletAddress.toString().length - 6)}`}</span> */}
					<div className="flex flex-col gap-2 items-center">
						<Image src="/gem-stone.png" alt="Gem Stone" />
						<Title level="2" weight="1">
							Boost Bags
						</Title>
						<LargeTitle
							weight="1"
							className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-200 to-emerald-500"
						>
							1 TON
						</LargeTitle>
						<Caption level="2" className="text-white/80">
							Boost your bag and earn access passes to launch exclusive
							Airdrops.
						</Caption>
					</div>
					<Divider className="border-[rgb(255,255,255,.20)_!important] w-full" />
					<div className="text-left w-full flex flex-col gap-6">
						<span className="text-sm/6 font-medium">Whats included:</span>
						<ul className="flex flex-col gap-2 text-sm/6">
							<li>+6 Bags for Boost your PPH</li>
							<li>+3 Golden Pass</li>
							<li>Max LVL 5</li>
							<li className="text-xs/6">
								You can now log in every 5 Hours to collect your rewards.
							</li>
						</ul>
					</div>
					<div className="flex flex-col gap-2 w-full">
						<Button stretched mode="bezeled" onClick={handleCompletePayment}>
							Buy with TON
						</Button>
					</div>
				</div>
			)}
		</Modal>
	);
};

export default ModalBoost;
