const HDWalletProvider = require("@truffle/hdwallet-provider");
const Web3 = require("web3");
// const { abi, bytecode } = require("./compile");
const compiledFactory = require("../ethereum/build/CampaignFactory.json");
// const compiledCampaign = require("../ethereum/build/Campaign.json");

const provider = new HDWalletProvider(
  "robust fun ginger increase click promote cushion appear pass bike canyon sure",
  // "https://goerli.infura.io/v3/bffe7942157c48cf8559fe5befce644e"
  "https://sepolia.infura.io/v3/bffe7942157c48cf8559fe5befce644e"
  );

const web3 = new Web3(provider);

const deploy = async () => {
  try {
    const accounts = await web3.eth.getAccounts();

    const CampaignFactory = await new web3.eth.Contract(compiledFactory.abi)
      .deploy({ data: compiledFactory.bytecode })
      .send({
        from: accounts[0],
        gas: "1000000",
      });

    console.log("Deployed Address", CampaignFactory.options.address);
  } catch (err) {
    console.log(err);
  }
};
deploy();
