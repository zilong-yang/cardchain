import {playerTokenContract, NETWORK_TYPE, headAuthorityAccount} from "./config";

const Tx = require('ethereumjs-tx').Transaction;
const playerMethods = playerTokenContract.methods;

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

export const giveToken = async (from, to, stats) => {
    let txCount = await window.web3.eth.getTransactionCount(to);
    const txObject = {
        nonce: window.web3.utils.toHex(txCount),
        gasLimit: window.web3.utils.toHex(1500000),
        gasPrice: window.web3.utils.toHex(window.web3.utils.toWei('10', 'wei')),
        to: playerTokenContract._address,
        data: playerMethods.mint(to, "", stats).encodeABI(),
    };

    const tx = NETWORK_TYPE === 'private' ? new Tx(txObject) : new Tx(txObject, {'chain': 'ropsten'});
    tx.sign(Buffer.from(headAuthorityAccount.privateKey, 'hex'));

    const serializedTx = tx.serialize();
    const raw = '0x' + serializedTx.toString('hex');

    let txHash = (await window.web3.eth.sendSignedTransaction(raw, console.log)).transactionHash;
    console.log("txHash: " + txHash);
}