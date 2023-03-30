import Web3 from "web3";

// const web3 = new Web3(window.web3.currentProvider);

let web3;

if (typeof window !== "undefined" && window.web3 !== "undefined") {
  // browser
  web3 = new Web3(window.ethereum);
} else {
  // nextjs server OR user not running metamask
  const provider = new Web3.providers.HttpProvider(
    // "https://goerli.infura.io/v3/bffe7942157c48cf8559fe5befce644e"
    "https://sepolia.infura.io/v3/bffe7942157c48cf8559fe5befce644e"
  );

  web3 = new Web3(provider);
}

export default web3;
