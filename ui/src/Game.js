import {headAuthorityAccount, NETWORK_TYPE, playerTokenContract} from "./config";

const Tx = require('ethereumjs-tx').Transaction;
const playerMethods = playerTokenContract.methods;

export const sendSignedTx = async (from, contractMethod, value) => {
    // reference: Deploying movie-rating-app on TestNet
    let txCount = await window.web3.eth.getTransactionCount(from);
    const txObject = {
        nonce: window.web3.utils.toHex(txCount),
        gasLimit: window.web3.utils.toHex(1500000),
        gasPrice: window.web3.utils.toHex(window.web3.utils.toWei('10', 'wei')),
        to: playerTokenContract._address,
        data: contractMethod.encodeABI(),
        value: window.web3.utils.toHex(value),
    };

    const tx = NETWORK_TYPE === 'private' ? new Tx(txObject) : new Tx(txObject, {'chain': 'ropsten'});
    tx.sign(Buffer.from(headAuthorityAccount.privateKey, 'hex'));

    const serializedTx = tx.serialize();
    const raw = '0x' + serializedTx.toString('hex');

    // return transaction hash
    return (await window.web3.eth.sendSignedTransaction(raw, console.log)).transactionHash;
};

export const giveToken = async (from, to, stats) => {
    await sendSignedTx(from, playerMethods.mint(to, "", stats), 0);
};

export const balanceOf = async (address) => (Number(await playerMethods.balanceOf(address).call()));

export const getStats = async (tokenID) => (await playerMethods._getStats(tokenID).call());

export const tokensOfOwner = async (owner) => (await playerMethods.tokensOfOwner(owner).call());

export const totalSupply = async () => (await playerMethods.totalSupply().call());

export const getListingData = async (listingId) => (await playerMethods.getListingData(listingId).call());

export const getCurrentListingIds = async () => (await playerMethods.getCurrentListingIds().call());

export const addListing = async (listingId, amount) => {
    let contractMethod = playerMethods.addListing(listingId, amount);
    const transactionParameters = {
        from: window.ethereum.selectedAddress,
        to: playerTokenContract._address,
        data: contractMethod.encodeABI(),
    };

    //returns tx Hash
    
    return await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [transactionParameters],
    })


};

export const isValidAddress = (address) => (address !== undefined && address !== '0x');

export const purchaseToken = async (listingId, price) => {
    
    let contractMethod = playerMethods.purchaseToken(listingId);
    const transactionParameters = {
        from: window.ethereum.selectedAddress,
        to: playerTokenContract._address,
        data: contractMethod.encodeABI(),
        value: window.web3.utils.toHex(price),
    };

    //returns tx Hash
    return await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [transactionParameters],
    })

};