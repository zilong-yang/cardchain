const PlayerToken = atrifacts.require("./PlayerToken.sol");

module.exports = function(deployer, network, accounts) {
    //could be an issue with accounts[0]
    deployer.deploy(PlayerToken, accounts[0])
};


