import { useEffect, useState } from 'react'
import { BigNumber, ethers } from "ethers";
import Button from 'react-bootstrap/Button';

import { abi as exchangeAbi } from "../Exchange.json";
import { abi as tokenAbi } from "../Token.json";

import convertToEth from '../utils/convertToEth';
import getContract from '../utils/getContract';
import SwapForm from './SwapForm';

const Swap = ({ exchangeAddress, tokenAddress, userEth, userTokens, getUserInfo }) => {
    const [ethInput, setEthInput] = useState('');
    const [tokenInput, setTokenInput] = useState('');
    const [isEthToToken, setIsEthToToken] = useState(true);

    const ethInputChange = async (e) => {
        let ethInput = e.target.value;
        setEthInput(ethInput);
        if (ethInput == '') {
          setTokenInput('');
          return;
        }
        ethInput = ethers.utils.parseUnits(ethInput, "ether");
        if (ethInput == 0) {
          setTokenInput(0);
        } else {
          const exchangeContract = getContract(exchangeAddress, exchangeAbi);
          const tokenAmount = await exchangeContract.getTokenAmount(ethInput);
          setTokenInput(convertToEth(tokenAmount));
        }
    }
    
    const tokenInputChange = async (e) => {
        let tokenInput = e.target.value;
        setTokenInput(tokenInput);
        if (tokenInput == '') {
          setEthInput('');
          return;
        }
        tokenInput = ethers.utils.parseUnits(tokenInput, "ether");
        if (tokenInput == 0) {
            setEthInput(0);
        } else {
            const exchangeContract = getContract(exchangeAddress, exchangeAbi);
            const ethAmount = await exchangeContract.getEthAmount(tokenInput);
            setEthInput(convertToEth(ethAmount));
        }
    }
    
    const ethToTokenSwap = async () => {
        if (ethInput == 0) return;
        const exchangeContract = getContract(exchangeAddress, exchangeAbi);
        const value = ethers.utils.parseUnits(ethInput, "ether");
        const minTokens = BigNumber.from(ethers.utils.parseUnits(tokenInput), "ether");
        let transaction = await exchangeContract.ethToTokenSwap(minTokens.toString(), { value: value.toString() });
        setEthInput('');
        setTokenInput('');

        await transaction.wait();
        await getUserInfo();
    }
    
    const tokenToEthSwap = async () => {
        if (tokenInput == 0) return;
        const value = ethers.utils.parseUnits(tokenInput, "ether").toString();
        const exchangeContract = getContract(exchangeAddress, exchangeAbi);
        const minEth = BigNumber.from(ethers.utils.parseUnits(ethInput), "ether");
        
        const tokenContract = getContract(tokenAddress, tokenAbi);
        let transaction = await tokenContract.approve(exchangeAddress, value);
        await transaction.wait();

        transaction = await exchangeContract.tokenToEthSwap(value, minEth.toString());
        setEthInput('');
        setTokenInput('');

        await transaction.wait();
        await getUserInfo();
    }
    
    const reverseSwap = () => {
        setIsEthToToken(!isEthToToken);
        setEthInput(0);
        setTokenInput(0);
    }

    return (
        <div>
            <Button variant="secondary" onClick={reverseSwap}>Reverse</Button>
            {isEthToToken ? (
              <SwapForm address={exchangeAddress} value1={ethInput} value2={tokenInput} token1={"ETH"} token2={"TOKEN"} inputHandler={ethInputChange} submitHandler={ethToTokenSwap} />
            ) : (
            <div>
              <SwapForm address={exchangeAddress} value1={tokenInput} value2={ethInput} token1={"TOKEN"} token2={"ETH"} inputHandler={tokenInputChange} submitHandler={tokenToEthSwap} />
            </div>
            )
            }
        </div>
    )
    
}

export default Swap;