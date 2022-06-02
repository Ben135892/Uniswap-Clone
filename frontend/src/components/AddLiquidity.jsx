import { useState } from "react";
import { ethers, BigNumber } from "ethers";

import { abi as exchangeAbi } from "../Exchange.json";
import { abi as tokenAbi } from "../Token.json";

import convertToEth from '../utils/convertToEth';
import getContract from '../utils/getContract';

const requiredAmount = (inputAmount, inputReserve, secondReserve) => {
    return BigNumber.from(inputAmount).mul(secondReserve).div(inputReserve);
}   

const AddLiquidity = ({ exchangeAddress, tokenAddress, userEth, userTokens, getUserInfo, getPoolInfo, exchangeReserve, exchangeEth }) => {
    const noLiquidity = exchangeEth == 0;
    const [ethInput, setEthInput] = useState(0);
    const [tokenInput, setTokenInput] = useState(0);

    const requiredTokens = (inputEth) => {
        return requiredAmount(inputEth, exchangeEth, exchangeReserve);
    }

    const requiredEth = (inputTokens) => {
        return requiredAmount(inputTokens, exchangeReserve, exchangeEth);
    }

    const ethInputChange = async (e) => {
        let ethInput = e.target.value;
        setEthInput(ethInput);
        if (noLiquidity) return;
        if (ethInput == '' || ethInput == 0) {
            setTokenInput(0);
            return;
        }
        ethInput = ethers.utils.parseUnits(ethInput, "ether");
        let required = requiredTokens(ethInput);
        required = BigNumber.from(required);
        required = convertToEth(required);
        setTokenInput(required);
    }

    const tokenInputChange = async (e) => {
        console.log("changed")
        let tokenInput = e.target.value;
        setTokenInput(tokenInput);
        if (noLiquidity) return;
        if (tokenInput == '' || tokenInput == 0) {
            setEthInput(0);
            return;
        }
        tokenInput = ethers.utils.parseUnits(tokenInput, "ether");
        let required = requiredEth(tokenInput);
        required = BigNumber.from(required);
        required = convertToEth(required);
        setEthInput(required);
    }

    const addLiquidity = async () => {
        const exchangeContract = getContract(exchangeAddress, exchangeAbi);
        const tokenContract = getContract(tokenAddress, tokenAbi);
        const tokenAmount = ethers.utils.parseUnits(tokenInput, "ether");
        // approve exchange to send token
        let transaction = await tokenContract.approve(exchangeAddress, tokenAmount);
        await transaction.wait();

        const price = ethers.utils.parseUnits(ethInput, "ether");
        transaction = await exchangeContract.addLiquidity(tokenAmount, { value: price });
        await transaction.wait(); 

        await getUserInfo();
        await getPoolInfo();
    } 

    return (
        <div>
            Eth <input value={ethInput} onChange={ethInputChange} />
            Token <input value={tokenInput} onChange={tokenInputChange} />
            <button onClick={addLiquidity}>Add Liquidity</button>
        </div>
    )
}

export default AddLiquidity