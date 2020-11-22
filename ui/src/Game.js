// import Web3 from 'web3';
import React from 'react';
import {playerTokenContract} from "./config";

const web3 = window.web3;

export const giveToken = (address, stats) => {
    playerTokenContract.methods.mint(address, "123456", stats).send({from: address, gas: 1000000}, (err, txHash) => {
        if (err) {
            console.log("Failed to give token to " + address);
            console.log(err);
        } else {
            console.log("Added a token to " + address.substr(0, 6) + "...");
        }
    });
};

export const balanceOf = (address) => (playerTokenContract.methods.balanceOf(address).call());

export const getStats = (tokenID) => (playerTokenContract.methods._getStats(tokenID).call());

export const testFunction = (args) => {
    playerTokenContract.methods._getStats(args[0]).call().then((val) => {
        console.log("test function: " + val[0]);
    }).catch(console.log);
}