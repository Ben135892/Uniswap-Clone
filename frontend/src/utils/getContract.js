import { ethers } from "ethers";

const getContract = (address, abi) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const tokenContract = new ethers.Contract(address, abi, signer);
    return tokenContract;
}

export default getContract;