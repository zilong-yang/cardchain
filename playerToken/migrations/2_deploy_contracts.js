const PlayerToken = artifacts.require('PlayerToken');
const ERC721 = artifacts.require('ERC721');

module.exports = function(deployer, network, accounts) {
    deployer.deploy(PlayerToken, accounts[0], {from: accounts[0], gas: 5000000});
};


