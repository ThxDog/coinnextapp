import {
	type Address,
	Cell,
	type Contract,
	type ContractProvider,
	SendMode,
	type Sender,
	Slice,
	beginCell,
} from "@ton/core";

export class TonWallet implements Contract {
	static readonly OPCODES = {
		TRANSFER: 0xf8a7ea5,
	};

	constructor(readonly address: Address) {}

	static createFromAddress(address: Address) {
		return new TonWallet(address);
	}

	async sendTon(
		provider: ContractProvider,
		via: Sender,
		opts: {
			value: bigint;
			toAddress: Address;
			fwdAmount: bigint;
		},
	) {
		const builder = beginCell()
			.storeUint(TonWallet.OPCODES.TRANSFER, 32)
			.storeAddress(opts.toAddress)
			.storeAddress(via.address)
			.storeUint(0, 1)
			.storeCoins(opts.fwdAmount);

		await provider.internal(via, {
			value: opts.value,
			sendMode: SendMode.PAY_GAS_SEPARATELY,
			bounce: true,
			body: builder.endCell(),
		});
	}
}
