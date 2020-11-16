const TokenGame = artifacts.require("./TokenGame.sol");

module.exports = function(deployer, network, accounts) {
    //could be an issue with accounts[0]
    deployer.deploy(TokenGame, accounts[0], accounts[0])
};