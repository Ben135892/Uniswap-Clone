import { ethers } from "ethers";
import round from "./round";

const convertToEth = (wei) => {
    return ethers.utils.formatUnits(wei, "ether");
}

export default convertToEth;