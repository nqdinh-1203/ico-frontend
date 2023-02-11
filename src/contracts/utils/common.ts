// import * as dotenv from 'dotenv';
// dotenv.config()

export type AddressType = {
    97: string;
    56: string;
}

export enum CHAIN_ID {
    TESTNET = 97,
    MAINNET = 56
}

export default function getChainIdFromEnv(): number {
    const env = process.env.NEXT_PUBLIC_CHAIN_ID;
    if (!env) {
        return 97;
    }
    return parseInt(env)
}

export const getRPC = () => {
    // if (getChainIdFromEnv() === CHAIN_ID.MAINNET) {
    //     return process.env.NEXT_PUBLIC_RPC_MAINNET;
    // }
    // console.log(process.env.NEXT_PRIVATE_RPC_TESTNET);
    return "https://eth-goerli.alchemyapi.io/v2/GMGOq5IweL2FmHvrCa2v_H8ISKknDtUu";
}

export const SMART_ADDRESS = {
    CROWNDSALE: { 97: "0xC5cFD4E2372D396Cc037030c15e7B4bbFdF0061e", 56: "" },
    USDT: { 97: "0x9B29b8a58E166Cc13d3ea8A7617f1D70528D6460", 56: "" },
}