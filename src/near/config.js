// Once you deploy the contract to its final account, make sure to specify it here
const CONTRACT_NAME =  "lottery.timthang.testnet"; /* TODO: Change this to the deployed account */

function getConfig() {
  return {
    networkId: "testnet",
    nodeUrl: "https://rpc.testnet.near.org",
    contractName: CONTRACT_NAME,
    walletUrl: "https://wallet.testnet.near.org",
    helperUrl: "https://helper.testnet.near.org",
  };
}

module.exports = getConfig;
