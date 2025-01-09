import { Address } from "@ton/core";

export const USDT_MASTER_ADDRESS = Address.parse(
  process.env.NODE_ENV === "development"
    ? "kQD0GKBM8ZbryVk2aESmzfU6b9b_8era_IkvBSELujFZPsyy"
    : "EQCxE6mUtQJKFnGfaROTKOt1lZbDiiX1kCixRv7Nw2Id_sDs"
);
export const INVOICE_WALLET_ADDRESS = Address.parse(
  "UQC7tVfJLHNbd4mtEER1B35LOZT3Q7DpdTLpDLnOr9ufq4UO"
);
