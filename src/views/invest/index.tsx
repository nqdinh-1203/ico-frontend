import React from 'react'
import { Flex, Heading, SimpleGrid, Spacer, useDisclosure } from "@chakra-ui/react"
import { ethers } from 'ethers';

import { ConnectWallet, WalletInfo, SuccessModal } from "@/components";
import { IPackage, IRate, IWalletInfo, TOKEN } from '@/_types_';
import { packages } from '@/constants';
import CrowndSaleContract from '@/contracts/CrowndSaleContract';
import UsdtContract from '@/contracts/UsdtContract';
import InvestCard from './components/InvestCard';

declare var window: any;

export default function InvestViews() {
    const [wallet, setWallet] = React.useState<IWalletInfo>();
    const [web3Provider, setWeb3Provider] = React.useState<ethers.providers.Web3Provider>();
    const [rate, setRate] = React.useState<IRate>({ ethRate: 0, usdtRate: 0 });
    const [isProcessing, setIsProcessing] = React.useState<boolean>(false);
    const [pak, setPackage] = React.useState<IPackage>();
    const [txHash, setTxHash] = React.useState<string>();
    const { isOpen, onClose, onOpen } = useDisclosure();

    const handleConnectWallet = async () => {
        if (window.ethereum) {
            console.log("...connecting");

            const provider = new ethers.providers.Web3Provider(window.ethereum, undefined);
            await provider.send("eth_requestAccounts", []);
            const signer = provider.getSigner();

            const address = await signer.getAddress();
            const bigBalance = await signer.getBalance();
            const ethBalance = Number.parseFloat(ethers.utils.formatEther(bigBalance));
            setWallet({ address, amount: ethBalance });
            setWeb3Provider(provider);
        }
    }

    const getRate = React.useCallback(async () => {
        const crowndContract = await new CrowndSaleContract();
        const ethRate = await crowndContract.getEthRate();
        const usdtRate = await crowndContract.getUsdtRate();

        console.log("rate");
        console.log({ ethRate, usdtRate });
        setRate({ ethRate, usdtRate });
    }, [])

    React.useEffect(() => {
        getRate();
    }, [getRate])

    const handleBuyIco = async (pk: IPackage) => {
        console.log("Buying...");

        if (!web3Provider) return;

        setPackage(pak);
        setIsProcessing(true);

        console.log("is processing: " + isProcessing);
        let hash = '';
        const crowndContract = new CrowndSaleContract(web3Provider);
        if (pk.token === TOKEN.USDT) {
            const usdtContract = new UsdtContract(web3Provider);
            await usdtContract.approve(crowndContract._contractAddress, pk.amount / rate.usdtRate);
            hash = await crowndContract.buyTokenByUSDT(pk.amount);
        } else {
            hash = await crowndContract.buyTokenByETH(pk.amount);
        }
        setTxHash(hash);
        onOpen();

        try {

        } catch (er: any) {
        }

        setPackage(undefined);
        setIsProcessing(false);
    }

    return (
        <Flex
            w={{ base: "full", lg: "70%" }}
            flexDirection="column"
            margin="50px auto"
        >
            <Flex>
                <Heading size="lg" fontWeight="bold">
                    ICO Blockchain
                </Heading>

                <Spacer />

                {/* {menus.map((menu) => (<Link href={menu.url} key={menu.url}>
                    <Text mx="20px" fontSize="20px">{menu.name}</Text>
                </Link>))} */}

                {!wallet && <ConnectWallet onClick={handleConnectWallet} />}
                {wallet && <WalletInfo
                    address={wallet?.address}
                    amount={wallet?.amount || 0}
                />}
            </Flex>

            <Flex w="full" flexDirection="column" py="50px">
                <SimpleGrid columns={{ base: 1, lg: 3 }} spacing="50px">
                    {
                        packages.map((pk, index) => (<InvestCard
                            pak={pk}
                            key={String(index)}
                            isBuying={isProcessing && pak?.key === pk.key}
                            rate={pk.token === TOKEN.ETH ? rate.ethRate : rate.usdtRate}
                            walletInfo={wallet}
                            onBuy={() => handleBuyIco(pk)}
                        />))
                    }
                </SimpleGrid>

                <SuccessModal
                    isOpen={isOpen}
                    onClose={onClose}
                    hash={txHash}
                    title="BUY ICO"
                />
            </Flex>
        </Flex>
    )
}