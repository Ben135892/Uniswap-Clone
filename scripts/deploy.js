const fs = require('fs');

const { ethers } = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log(`Deployed contracts with the account ${deployer.address}`);

    const Factory = await ethers.getContractFactory('Factory');
    const factory = await Factory.deploy();
    console.log(`Factory address: ${factory.address}`);

    const Token = await ethers.getContractFactory('Token');
    const token = await Token.deploy("Token", "TK", ethers.utils.parseUnits("200000", "ether"));
    console.log(`Token 1 address: ${token.address}`);

    const token2 = await Token.deploy("USDC", "US", ethers.utils.parseUnits("500000", "ether"));
    console.log(`Token 2 address: ${token2.address}`);

    const Exchange = await ethers.getContractFactory('Exchange');
    const exchange = await Exchange.deploy(token.address);
    let transaction = await factory.createExchange(token.address);
    await transaction.wait();

    const exchangeAddress = await factory.getExchange(token.address);
    console.log(`Exchange address: ${exchange.address}`);

    const factoryData = {
        address: factory.address,
        abi: JSON.parse(factory.interface.format("json"))
    }

    const tokenData = {
        address: token.address,
        abi: JSON.parse(token.interface.format("json"))
    }

    const exchangeData = {
        address: exchangeAddress,
        abi: JSON.parse(exchange.interface.format("json"))
    }

    fs.writeFileSync("frontend/src/Token.json", JSON.stringify(tokenData));
    fs.writeFileSync("frontend/src/Factory.json", JSON.stringify(factoryData));
    fs.writeFileSync("frontend/src/Exchange.json", JSON.stringify(exchangeData));
}

main()
.then(() => process.exit(0))
.catch((err) => console.log(err));