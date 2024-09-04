require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.24",
  networks:{
    sepolia:{
      url:"",
      accounts:[""]
    },
    localhost:{
      url:"http://127.0.0.1:8545",
    }
  }
};
