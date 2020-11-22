import {playerTokenContract} from "./config";

// const web3 = window.web3;

const playerMethods = playerTokenContract.methods;

export const giveToken = (address, stats) => {
    playerMethods.mint(address, "", stats).send({from: address, gas: 1000000}, (err) => {
            if (err) {
                console.log("Failed to give token to " + address);
                console.log(err);
            } else {
                console.log("Added a token to " + address.substr(0, 6) + "...");
            }
    });
};

export const balanceOf = (address) => (playerMethods.balanceOf(address).call());

export const getStats = (tokenID) => (playerMethods._getStats(tokenID).call());

export const tokensOfOwner = (owner) => (playerMethods.tokensOfOwner(owner).call());

export const totalSupply = () => (playerMethods.totalSupply().call());

export const testFunction = (args) => {
    playerMethods.totalSupply().call().then((val) => {
        console.log("test function: " + val);
    }).catch(console.log);
}