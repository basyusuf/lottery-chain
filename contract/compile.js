const path = require('path');
const fs = require('fs');
const solc = require('solc');

const lotteryPath = path.resolve(__dirname, "contracts", "Lottery.sol");
const source = fs.readFileSync(lotteryPath, 'utf8');

// The last line of codes need to be changed like below.
const input = {
    language: "Solidity",
    sources: {
        "Lottery.sol": {
            content: source,
        },
    },
    settings: {
        outputSelection: {
            "*": {
                "*": ["*"],
            },
        },
    },
};
let compiled = solc.compile(JSON.stringify(input));
const output = JSON.parse(compiled);
console.info("Output finish");
console.info("Contracts:", output.contracts);
module.exports = output.contracts["Lottery.sol"].Lottery;
