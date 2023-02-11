import { ethers } from "ethers";
import { Erc20Interface } from "./interfaces";
import { getRPC } from "./utils/common";
import { getUsdtAbi } from "./utils/getAbi";
import { getUsdtAddress } from "./utils/getAddress";

export default class UsdtContract extends Erc20Interface {
    constructor(provider: ethers.providers.Web3Provider) {
        super(provider, getUsdtAddress(), getUsdtAbi())
    }
}