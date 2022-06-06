require("@nomiclabs/hardhat-waffle");

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
const key = "https://eth-goerli.alchemyapi.io/v2/uX2dc5L_wVtgg9VnO7rHJNuaKGRSNR9p";

const private = "6002e75b72addc1f10659f67922cfff2c35c016683005518b855d017dadc577c"

module.exports = {
  networks: {
    hardhat: {
      chainId: 1337
    },
    goerli: {
      url: key,
      accounts: [`${private}`]
    }
  },
  solidity: "0.8.3",
};
