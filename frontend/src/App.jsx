import { useEffect, useState } from 'react'
import { ethers } from "ethers";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from 'react-router-dom';


import { address as defaultExchangeAddress, abi as exchangeAbi } from "./Exchange.json";
import { address as defaultTokenAddress, abi as tokenAbi } from "./Token.json";
import { address as factoryAddress, abi as factoryAbi } from "./Factory.json";

import convertToEth from './utils/convertToEth';
import getContract from './utils/getContract';

import Swap from './components/Swap';
import Pool from './components/Pool';
import AddToken from './components/AddToken';
import SelectToken from './components/SelectToken';

function App() {
  const [connectedAccount, setConnectedAccount] = useState(null);
  const [userEth, setUserEth] = useState(0);          
  const [userTokens, setUserTokens] = useState(0)    // number of tokens user owns

  const [allTokens, setAllTokens] = useState([ 
    { address: defaultTokenAddress, symbol: 'TK' }
  ]);
  const [allExchanges, setAllExchanges] = useState([defaultExchangeAddress]);
  const [tokenIndex, setTokenIndex] = useState(0);

  const tokenAddress = allTokens[tokenIndex].address;
  const tokenSymbol = allTokens[tokenIndex].symbol; 
  const exchangeAddress = allExchanges[tokenIndex];
  
  const connectWalletHandler = async () => {
    const result = await window.ethereum.request({ method: 'eth_requestAccounts' })
    setConnectedAccount(result[0]);
  } 

  const getUserInfo = async () => {

    const tokenContract = getContract(tokenAddress, tokenAbi);
    const tokens = await tokenContract.balanceOf(connectedAccount);
    setUserTokens(tokens.toString());

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    let userEth = await provider.getBalance(connectedAccount);
    setUserEth(userEth.toString());
  }

  // localStorage.removeItem('allTokens');
  // localStorage.removeItem('allExchanges');

  useEffect(() => {
    const allT = localStorage.getItem('allTokens');
    const allE = localStorage.getItem('allExchanges');
    if (allT && allE) {
      setAllTokens(JSON.parse(allT));
      setAllExchanges(JSON.parse(allE));
    }
    connectWalletHandler();
  }, []);

  useEffect(() => {
    console.log(tokenIndex);
    if (!connectedAccount) return;
    getUserInfo();
  }, [connectedAccount, tokenIndex]);

  useEffect(() => {
    console.log(tokenSymbol);
  });

  return (
    <div className="App">
      <h1>Your Tokens: {convertToEth(userTokens)}</h1>
      <h1>Your Eth: {convertToEth(userEth)}</h1>
      <AddToken setAllTokens={setAllTokens} setAllExchanges={setAllExchanges} allTokens={allTokens} allExchanges={allExchanges} />
      <SelectToken 
        allTokens={allTokens}
        index={tokenIndex}
        setIndex={setTokenIndex}
        getUserInfo={getUserInfo}
      />
      <Router>
        <Routes>
          <Route path="/" element={
            <Swap 
              exchangeAddress={exchangeAddress} 
              tokenAddress={tokenAddress}
              getUserInfo={getUserInfo}
            />
          }>
          </Route>
          <Route path="pool" element={
            <Pool 
              exchangeAddress={exchangeAddress}
              tokenAddress={tokenAddress}
              getUserInfo={getUserInfo}
              connectedAccount={connectedAccount}
            />
          }>
          </Route>
        </Routes>
      </Router>
      
    </div>
  )
}

export default App
