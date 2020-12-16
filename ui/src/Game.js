import {playerTokenContract} from "./config";

const playerMethods = playerTokenContract.methods;

export const sendMetamaskTx = async (contractMethod, value) => {
    const txParams = {
        from: window.ethereum.selectedAddress,
        to: playerTokenContract._address,
        data: contractMethod.encodeABI(),
        value: window.web3.utils.toHex(value),
    }

    return await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [txParams],
    });
}

export const giveToken = async (account, to, stats) =>
    (await sendMetamaskTx(playerMethods.mint(to, stats), 0));

export const balanceOf = async (address) =>
    (Number(await playerMethods.balanceOf(address).call()));

export const getStats = async (tokenID) =>
    (await playerMethods._getStats(tokenID).call());

export const tokensOfOwner = async (owner) =>
    (await playerMethods.tokensOfOwner(owner).call());

export const totalSupply = async () =>
    (await playerMethods.totalSupply().call());

export const getListingData = async (listingId) =>
    (await playerMethods.getListingData(listingId).call());

export const getCurrentListingIds = async () =>
    (await playerMethods.getCurrentListingIds().call());

export const addListing = async (tokenId, amount) =>
    (await sendMetamaskTx(playerMethods.addListing(tokenId, amount), 0));

export const purchaseToken = async (listingId, price) =>
    (await sendMetamaskTx(playerMethods.purchaseToken(listingId), price));

export const isListed = async (tokenId) =>
    (await playerMethods.isListed(tokenId).call());

export const trainToken = async (from, tokenId, newStats) =>
    (await sendMetamaskTx(playerMethods.trainToken(tokenId, newStats), 0));

export const isValidAddress = (address) =>
    (address !== undefined && address !== '0x');

export const randInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.ceil(max);
    return Math.floor(Math.random() * (max - min) + min);
};
