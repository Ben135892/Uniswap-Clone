import { useEffect, useState } from 'react'
import { ethers } from "ethers";

import { abi as exchangeAbi } from "../Exchange.json";
import AddLiquidity from './AddLiquidity';

import convertToEth from '../utils/convertToEth';
import getContract from '../utils/getContract';
import CreatePool from './CreatePool';

const Pool = ({ exchangeAddress, tokenAddress, userEth, userTokens, getUserInfo, connectedAccount }) => {
    const [exchangeReserve, setExchangeReserve] = useState(0); // reserve of pool in token
    const [exchangeEth, setExchangeEth] = useState(0); // balance of pool in eth
    const [lpTokens, setLpTokens] = useState(0);
    console.log(exchangeAddress);
    const getPoolInfo = async () => {   
        const contract = getContract(exchangeAddress, exchangeAbi);
        const reserve = await contract.getReserve();
        setExchangeReserve(reserve);

        const provider = new ethers.providers.Web3Provider(window.ethereum);
        let exchangeEth = await provider.getBalance(exchangeAddress);
        setExchangeEth(exchangeEth);

        const lpTokens = await contract.balanceOf(connectedAccount);
        setLpTokens(lpTokens);
    }

    useEffect(() => {
        if (!connectedAccount) return;
        getPoolInfo();
      }, [connectedAccount, exchangeAddress]);

    return (
        <div>
            <h1>Token Reserves: {convertToEth(exchangeReserve)}</h1>
            <h1>ETH Reserves: {convertToEth(exchangeEth)}</h1>
            <h1>LP Tokens: {convertToEth(lpTokens)}</h1>
            <AddLiquidity 
                exchangeAddress={exchangeAddress}
                tokenAddress={tokenAddress}
                userEth={userEth}
                userTokens={userTokens}
                getUserInfo={getUserInfo}
                getPoolInfo={getPoolInfo}
                exchangeReserve={exchangeReserve}
                exchangeEth={exchangeEth}
            />
            <CreatePool />
        </div>
    )
    
}

export default Pool;