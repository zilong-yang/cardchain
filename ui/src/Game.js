import {playerTokenContract} from "./config";

// const web3 = window.web3;

const playerMethods = playerTokenContract.methods;

export const giveToken = async (addressFrom, addressTo, stats) => {
    return await playerMethods.mint(addressTo, "", stats).send({from: addressFrom, gas: 1000000}, (err) => {
        if (err) {
            console.log("Failed to give token to " + addressTo);
            console.log(err);
        } else {
            console.log("Added a token to " + addressTo.substr(0, 6) + "...");
        }
        
    });
};

export const balanceOf = async (address) => (Number(await playerMethods.balanceOf(address).call()));

export const getStats = async (tokenID) => (await playerMethods._getStats(tokenID).call());

export const tokensOfOwner = async (owner) => (await playerMethods.tokensOfOwner(owner).call());

export const totalSupply = async () => (await playerMethods.totalSupply().call());

export const addListing = async (tokenId, amount, addressFrom) => {
    return await playerMethods.addListing(tokenId, amount).send({from: addressFrom, gas: 1000000}, (err) => {
    if (err) {
        console.log("Failed to add Listing for Token " + tokenId);
        console.log(err);
        alert("Failure to List Token!");
    } else {
        console.log("Created Listing for Token " + tokenId + " at Price: " + amount);
    }
});
};

export const getListingData = async (listingId) => (await playerMethods.getListingData(listingId).call());

export const getCurrentListingIds = async () => (await playerMethods.getCurrentListingIds().call());

export const purchaseToken = async (listingId) => (await playerMethods.purchaseToken(listingId).call());

export const isValidAddress = (address) => (address !== undefined && address !== '0x');

export const testFunction = (args) => {
    playerMethods.totalSupply().call().then((val) => {
        console.log("test function: " + val);
    }).catch(console.log);
}