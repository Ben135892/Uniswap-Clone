const { expect } = require("chai");
const { ethers, waffle } = require("hardhat");

describe("Exchange contract", async () => {

    let token, exchange, owner, addr1, addr2;

    beforeEach(async () => {
        [owner, addr1, addr2] = await ethers.getSigners();
        const Token = await ethers.getContractFactory("Token");
        const Exchange = await ethers.getContractFactory("Exchange");
        token = await Token.deploy("TK", "TOKEN", 100000);
        exchange = await Exchange.deploy(token.address);
    });

    it("adds liquidity", async () => {
        await token.approve(exchange.address, 1000);
        await exchange.addLiquidity(1000, { value: 100 });

        expect(await waffle.provider.getBalance(exchange.address)).to.equal(100);
        expect(await exchange.getReserve()).to.equal(1000);
    });

    it("can remove liquidity", async () => {
        await token.approve(exchange.address, 1000);
        await exchange.addLiquidity(1000, { value: 100 });

        // remove half the liquidity
        await exchange.removeLiquidity(50);

        expect(await waffle.provider.getBalance(exchange.address)).to.equal(50);
        expect(await exchange.getReserve()).to.equal(500);
    });

    it("returns correct price", async () => {
        await token.approve(exchange.address, 1000);
        await exchange.addLiquidity(1000, { value: 100 });

        expect((await exchange.getEthPrice()) / 10000).to.equal(10);
        expect((await exchange.getTokenPrice()) / 10000).to.equal(0.1);
    });

    it("gets correct token amount", async () => {
        await token.approve(exchange.address, 1000);
        await exchange.addLiquidity(1000, { value: 100 });

        expect(await exchange.getTokenAmount(10)).to.equal(90);
    })
})