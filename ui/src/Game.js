import {playerTokenContract} from "./config";

// const web3 = window.web3;

const playerMethods = playerTokenContract.methods;

export const giveToken = async (address, stats) => {
    return await playerMethods.mint(address, "", stats).send({from: address, gas: 1000000}, (err) => {
        if (err) {
            console.log("Failed to give token to " + address);
            console.log(err);
        } else {
            console.log("Added a token to " + address.substr(0, 6) + "...");
        }
    });
};

export const balanceOf = async (address) => (Number(await playerMethods.balanceOf(address).call()));

export const getStats = async (tokenID) => (await playerMethods._getStats(tokenID).call());

export const tokensOfOwner = async (owner) => (await playerMethods.tokensOfOwner(owner).call());

export const totalSupply = async () => (await playerMethods.totalSupply().call());

export const testFunction = (args) => {
    playerMethods.totalSupply().call().then((val) => {
        console.log("test function: " + val);
    }).catch(console.log);
}