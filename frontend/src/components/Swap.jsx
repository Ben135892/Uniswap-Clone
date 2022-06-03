import { useEffect, useState } from 'react'
import { BigNumber, ethers } from "ethers";
import Button from 'react-bootstrap/Button';

import { abi as exchangeAbi } from "../Exchange.json";
import { abi as tokenAbi } from "../Token.json";

import convertToEth from '../utils/convertToEth';
import getContract from '../utils/getContract';
import SwapForm from './SwapForm';

const Swap = ({ exchangeAddress, tokenAddress, tokenSymbol, userEth, userTokens, getUserInfo }) => {
    const [ethInput, setEthInput] = useState('');
    const [tokenInput, setTokenInput] = useState('');
    const [isEthToToken, setIsEthToToken] = useState(true);
    const [minAmount, setMinAmount] = useState('');

    const ethInputChange = async (e) => {
        let ethInput = e.target.value;
        setEthInput(ethInput);
        if (ethInput == '') {
          setTokenInput('');
          setMinAmount('');
          return;
        }
        ethInput = ethers.utils.parseUnits(ethInput, "ether");
        if (ethInput == 0) {
          setTokenInput(0);
        } else {
          const exchangeContract = getContract(exchangeAddress, exchangeAbi);
          const tokenAmount = await exchangeContract.getTokenAmount(ethInput);
          setTokenInput(convertToEth(tokenAmount));
          setMinAmount(convertToEth(tokenAmount) * 0.9);
        }
    }
    
    const tokenInputChange = async (e) => {
        let tokenInput = e.target.value;
        setTokenInput(tokenInput);
        if (tokenInput == '') {
          setEthInput('');
          setMinAmount('');
          return;
        }
        tokenInput = ethers.utils.parseUnits(tokenInput, "ether");
        if (tokenInput == 0) {
            setEthInput(0);
        } else {
            const exchangeContract = getContract(exchangeAddress, exchangeAbi);
            const ethAmount = await exchangeContract.getEthAmount(tokenInput);
            setEthInput(convertToEth(ethAmount));
            setMinAmount(convertToEth(ethAmount) * 0.9);
        }
    }
    
    const ethToTokenSwap = async () => {
        if (ethInput == 0) return;
        const exchangeContract = getContract(exchangeAddress, exchangeAbi);
        const value = ethers.utils.parseUnits(ethInput, "ether");
        const min = ethers.utils.parseUnits(minAmount.toString(), "ether");
        let transaction = await exchangeContract.ethToTokenSwap(min, { value: value.toString() });
        setEthInput('');
        setMinAmount('');
        setTokenInput('');

        await transaction.wait();
        await getUserInfo();
    }
    
    const tokenToEthSwap = async () => {
        if (tokenInput == 0) return;
        const value = ethers.utils.parseUnits(tokenInput, "ether").toString();
        const exchangeContract = getContract(exchangeAddress, exchangeAbi);
        
        const tokenContract = getContract(tokenAddress, tokenAbi);
        let transaction = await tokenContract.approve(exchangeAddress, value);
        await transaction.wait();

        const min = ethers.utils.parseUnits(minAmount.toString(), "ether");
        transaction = await exchangeContract.tokenToEthSwap(value, min);
        setEthInput('');
        setMinAmount('');
        setTokenInput('');

        await transaction.wait();
        await getUserInfo();
    }
    
    const reverseSwap = () => {
        setIsEthToToken(!isEthToToken);
        setEthInput('');
        setTokenInput('');
        setMinAmount('');
    }

    return (
        <div className="Swap">
            <h2>Swap</h2>
            <Button className="button" variant="secondary" onClick={reverseSwap}>Reverse</Button>
            {isEthToToken ? (
              <SwapForm 
                address={exchangeAddress} 
                value1={ethInput} 
                value2={tokenInput} 
                token1={"ETH"} 
                token2={tokenSymbol} 
                inputHandler={ethInputChange} 
                submitHandler={ethToTokenSwap}
                minAmount={minAmount}
                setMinAmount={setMinAmount} />
            ) : (
            <div>
              <SwapForm 
                address={exchangeAddress} 
                value1={tokenInput} 
                value2={ethInput} 
                token1={tokenSymbol} 
                token2={"ETH"} 
                inputHandler={tokenInputChange} 
                submitHandler={tokenToEthSwap} 
                minAmount={minAmount}
                setMinAmount={setMinAmount} />
            </div>
            )
            }
        </div>
    )
    
}

export default Swap;