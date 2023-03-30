// Import the required libraries and modules
const fs = require("fs-extra");
const solc = require("solc");

// Define the path to the Campaign.sol file
const path = "./contracts/Campaign.sol";

// Read the Campaign contract source code from the file
const contractSource = fs.readFileSync(path).toString();

// Define the Solidity compiler input
const input = {
  language: "Solidity",
  sources: {
    [path]: {
      content: contractSource,
    },
  },
  settings: {
    optimizer: {
      enabled: true,
      runs: 200,
    },
    outputSelection: {
      "*": {
        "": ["ast"],
        "*": [
          "abi",
          "metadata",
          "devdoc",
          "userdoc",
          "storageLayout",
          "evm.legacyAssembly",
          "evm.bytecode",
          "evm.deployedBytecode",
          "evm.methodIdentifiers",
          "evm.gasEstimates",
          "evm.assembly",
        ],
      },
    },
    evmVersion: "byzantium",
  },
};

// Compile the Campaign contracts with the Solidity Compiler
const output = JSON.parse(solc.compile(JSON.stringify(input)));

// Create the build directory if it does not exist
const buildDir = "./build";
if (fs.existsSync(buildDir)) {
  fs.removeSync(buildDir);
}
fs.mkdirSync(buildDir);

// Extract the bytecode and ABI from the contract output
Object.entries(output.contracts[path]).forEach(([contractName, contract]) => {
  const bytecode = contract.evm.bytecode.object;
  const abi = contract.abi;
  
  // Write the bytecode and ABI to separate JSON files in the build directory
  fs.writeFileSync(
    `${buildDir}/${contractName}.json`,
    JSON.stringify({ bytecode, abi }, null, 2)
  );
  
});