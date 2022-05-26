import { connect, Contract, keyStores, WalletConnection, utils } from 'near-api-js'
import getConfig from './config'
require("dotenv").config();

// const PRIVATE_KEY = process.env.PRIVATE_KEY;
const CONTRACT_PRIVATE_KEY = process.env.CONTRACT_PRIVATE_KEY;

const nearConfig = getConfig();

function getPrivateKey(sender_id) {
  let accountId = "";
  let private_key = "";
  // tim
  if (sender_id === "5232916690131626") {
    accountId = "timthang1.testnet";
    private_key = process.env.PRIVATE_KEY1;
  }
  // supa man
  if (sender_id === "5631406660222773") {
    accountId = "timthang2.testnet";
    private_key = process.env.PRIVATE_KEY2;
  }
  // bat man
  if (sender_id === "5220728768021003") {
    accountId = "timthang3.testnet";
    private_key = process.env.PRIVATE_KEY3;
  }
  return [accountId, private_key];
}

// Initialize contract & set global variables
export async function initContract() {
  // Initialize connection to the NEAR testnet
  const near = await connect(Object.assign({ deps: { keyStore: new keyStores.BrowserLocalStorageKeyStore() } }, nearConfig))
  // Initializing Wallet based Account. It can work with NEAR testnet wallet that
  // is hosted at https://wallet.testnet.near.org
  window.walletConnection = new WalletConnection(near)
  // Getting the Account ID. If still unauthorized, it's just empty string
  window.accountId = window.walletConnection.getAccountId()
  // Initializing our contract APIs by contract name and configuration
  window.contract = await new Contract(window.walletConnection.account(), nearConfig.contractName, {
    // View methods are read only. They don't modify the state, but usually return some value.
    viewMethods: ['getInfo'],
    // Change methods can modify the state. But you don't receive the returned value when called.
    changeMethods: [],
  })
}


export async function sendUSN(acc, amount, arg) {
  let pair = getPrivateKey(arg);
  let accountId = pair[0];
  let private_key = pair[1];
  let am = amount + "000000000000000000";
  const keyPair = utils.KeyPair.fromString(private_key);
  const keyStore = new keyStores.InMemoryKeyStore();
  keyStore.setKey("testnet", accountId, keyPair);
  const near = await connect({
    networkId: "testnet",
    keyStore,
    masterAccount: accountId,
    nodeUrl: "https://rpc.testnet.near.org"
  });
  const account = await near.account(accountId);
  const call = await account.functionCall({
    contractId: "usdn.testnet",
    methodName: "ft_transfer",
    args: { "receiver_id": acc, "amount": am },
    gas: '20000000000000',
    attachedDeposit: '1',
    amount: '0'
  });
  return call.transaction_outcome.id;
}

export async function sendNEAR(arg, acc, amount) {
  let pair = getPrivateKey(arg);
  let accountId = pair[0];
  let private_key = pair[1];

  const keyPair = utils.KeyPair.fromString(private_key);
  const keyStore = new keyStores.InMemoryKeyStore();
  keyStore.setKey("testnet", accountId, keyPair);
  const near = await connect({
    networkId: "testnet",
    keyStore,
    masterAccount: accountId,
    nodeUrl: "https://rpc.testnet.near.org"
  });
  const account = await near.account(accountId);

  const send = await account.sendMoney(acc, amount);
}


export async function updateAccountList(am, arg) {
  let pair = getPrivateKey(arg);
  let accountId = pair[0];
  let private_key = pair[1];
  const keyPair = utils.KeyPair.fromString(private_key);
  const keyStore = new keyStores.InMemoryKeyStore();
  keyStore.setKey("testnet", accountId, keyPair);
  const near = await connect({
    networkId: "testnet",
    keyStore,
    masterAccount: accountId,
    nodeUrl: "https://rpc.testnet.near.org"
  });
  const account = await near.account(accountId);
  const call = await account.functionCall({
    contractId: "messenger-near.testnet",
    methodName: "update_list",
    args: { "acc": accountId, "amount": am },
    gas: '20000000000000',
  });
}


export async function sendReward() {
  // private key of messenger-near.testnet
  const keyPair = utils.KeyPair.fromString(CONTRACT_PRIVATE_KEY);
  const keyStore = new keyStores.InMemoryKeyStore();
  keyStore.setKey("testnet", 'messenger-near.testnet', keyPair);
  const near = await connect({
    networkId: "testnet",
    keyStore,
    masterAccount: 'messenger-near.testnet',
    nodeUrl: "https://rpc.testnet.near.org"
  });
  const account = await near.account('messenger-near.testnet');
  const call = await account.functionCall({
    contractId: "messenger-near.testnet",
    methodName: "calculate_reward",
    args: {},
    gas: '20000000000000',
  });
  // 3 accounts with highest tx volume and their reward calculated
  let acc1 = call.receipts_outcome[0].outcome.logs[0];
  let reward1 = utils.format.parseNearAmount(call.receipts_outcome[0].outcome.logs[1]);
  let acc2 = call.receipts_outcome[0].outcome.logs[2];
  let reward2 = utils.format.parseNearAmount(call.receipts_outcome[0].outcome.logs[3]);
  let acc3 = call.receipts_outcome[0].outcome.logs[4];
  let reward3 = utils.format.parseNearAmount(call.receipts_outcome[0].outcome.logs[5]);
  // send reward (NEAR) to top 3 account with highest tx volume
  if (acc1 != "default") {
    const send1 = await account.sendMoney(acc1, reward1);
  }
  if (acc2 != "default") {
    const send2 = await account.sendMoney(acc2, reward2);
  }
  if (acc3 != "default") {
    const send3 = await account.sendMoney(acc3, reward3);
  }
  // reset the contract after distributing reward.
  const reset = await account.functionCall({
    contractId: "messenger-near.testnet",
    methodName: "clear",
    args: {},
    gas: '20000000000000',
  });
}
