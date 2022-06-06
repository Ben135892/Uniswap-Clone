import { ethers } from "ethers";

const convertToEth = (wei) => {
    return ethers.utils.formatUnits(wei, "ether");
}

export default convertToEth;