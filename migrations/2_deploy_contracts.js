const Preferences = artifacts.require("./Preferences.sol");

module.exports = function(deployer, network, accounts) {
  if (network !== 1) {
    deployer.deploy(Preferences, [accounts[1], accounts[2], accounts[3]]);
  } else {
    console.log("Deploying to Mainnet --");
  }
};
