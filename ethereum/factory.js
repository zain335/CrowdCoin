import web3 from "./web3";

import CampaignFacoty from "./build/CampaignFactory.json";

const instance = new web3.eth.Contract(
  CampaignFacoty.abi,
  // "0x995dba19ECDEd4036966C2DC140892f2DdeECD47" // goerli net deployed address
  "0xa04209516289dD1E3EbBBA6e86a446B35a6D95a3" // sepolia test net deployed address 
);

export default instance;
