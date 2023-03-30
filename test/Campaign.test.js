const assert = require("assert");
const ganache = require("ganache-cli");
const Web3 = require("web3");

const web3 = new Web3(ganache.provider());

const compiledFactory = require("../ethereum/build/CampaignFactory.json");
const compiledCampaign = require("../ethereum/build/Campaign.json");
const { it } = require("mocha");

let accounts;
let factory;
let campaignAddress;
let campaign;

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();

  factory = await new web3.eth.Contract(compiledFactory.abi)
    .deploy({ data: compiledFactory.bytecode })
    .send({ from: accounts[0], gas: 1000000 });

  await factory.methods
    .createCompaign("100")
    .send({ from: accounts[0], gas: 1000000 });

  [campaignAddress] = await factory.methods.getDeployewdComapigns().call();

  campaign = await new web3.eth.Contract(compiledCampaign.abi, campaignAddress);
});

describe("Campaigns", () => {
  it("deploy a factory and campaign ", () => {
    assert.ok(factory.options.address);
    assert.ok(campaign.options.address);
  });

  it("mark caller as manager", async () => {
    const manager = await campaign.methods.manager().call();
    assert.equal(manager, accounts[0]);
  });

  it("mark contributer as approver", async () => {
    await campaign.methods
      .contribute()
      .send({ value: "200", from: accounts[1] });
    const approveContribure = await campaign.methods
      .approvers(accounts[1])
      .call();

    assert(approveContribure);
  });

  it("requires a minumn contribution", async () => {
    try {
      await campaign.methods
        .contribute()
        .send({ value: "10", from: accounts[2] });
      assert(false);
    } catch (error) {
      assert(error);
    }
  });

  it("only manager can create request ", async () => {
    try {
      await campaign.methods
        .createRequest("buy batteries", "100", accounts[5])
        .send({ from: accounts[2], gas: 1000000 });
      assert(false);
    } catch (error) {
      assert(error);
    }
  });

  it("manager can create request", async () => {
    await campaign.methods
      .createRequest("buy batteries", "100", accounts[5])
      .send({ from: accounts[0], gas: 1000000 });

    const request = await campaign.methods.requests(0).call();
    assert.equal(request.description, "buy batteries");
  });

  it("processes request", async () => {
    await campaign.methods
      .contribute()
      .send({ from: accounts[0], value: web3.utils.toWei("10", "ether") });

    await campaign.methods
      .createRequest("A", web3.utils.toWei("5", "ether"), accounts[1])
      .send({ from: accounts[0], gas: "1000000" });

    await campaign.methods
      .approveRequest(0)
      .send({ from: accounts[0], gas: "1000000" });

    await campaign.methods
      .finilizeRequest(0)
      .send({ from: accounts[0], gas: "1000000" });

    let balance = await web3.eth.getBalance(accounts[1]);
    balance = web3.utils.fromWei(balance, "ether");
    balance = parseFloat(balance);
    
    assert(balance > 104);
  });
});
