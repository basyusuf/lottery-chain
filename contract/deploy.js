const HDwalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const compiledLottery = require('./compile');
const interface = compiledLottery.abi;
const bytecode = compiledLottery.evm.bytecode.object;
const config = require('./config');

const provider = new HDwalletProvider(
    config.mnemonic_keys,
    config.rinkeby_url,
)
const web3 = new Web3(provider);

const deploy = async () => {
    //process.exit(1);
    console.info("Deploy started!", compiledLottery);
    console.info("Interface:", interface);
    const accounts = await web3.eth.getAccounts();
    console.info("Account: ", accounts[0]);

    const result = await new web3.eth.Contract(interface)
        .deploy({ data: bytecode })
        .send({ from: accounts[0], gas: '1000000', gasPrice: '5000000000' })

    console.info("Smart Contract address:", result.options.address);
    console.info(JSON.stringify(interface));
}
deploy();