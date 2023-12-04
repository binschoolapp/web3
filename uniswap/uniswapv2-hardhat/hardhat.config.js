require("@nomicfoundation/hardhat-toolbox");

const PRIVATE_KEY ="1533338c0748c32fcf09561dbffd123fd469cd390cd2554bb8062d2fab645784";

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.5.16",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200
          }
        }
      },
      {
        version: "0.6.6",
        settings: {
          optimizer: {
            enabled: true,
            runs: 1000
          }
        }
      }
    ]
  },
  
  networks: {
    ylem: {
      url: "https://testnet.ylem.network",
      accounts: [PRIVATE_KEY]
    }
  }
};
