require("@nomiclabs/hardhat-waffle");

require('dotenv').config();

module.exports = {
  networks: {
    hardhat: {
      chainId: 1337
    },
    goerli: {
      accounts: [ process.env.private ],
      url: `https://eth-goerli.alchemyapi.io/v2/${process.env.API}`
    }
  },
  solidity: "0.8.3",
};
