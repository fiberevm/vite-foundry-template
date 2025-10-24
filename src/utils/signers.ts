import { generatePrivateKey, privateKeyToAccount } from "viem/accounts";

export const defaultSigner = privateKeyToAccount(generatePrivateKey());
