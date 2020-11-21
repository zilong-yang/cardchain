// import Web3 from 'web3';
import React from 'react';
import {playerTokenContract} from "./config";

const web3 = window.web3;

export const giveToken = (address, stats) => {
    playerTokenContract.methods.mint(address, "123456", stats).call((err, success) => {
        if (!success) {
            console.log("Failed to give token to " + address);
        } else {
            console.log("Success");
        }
    });
};

export const getTokens = (address) => (
    playerTokenContract.methods.totalSupply()
);

export const testFunction = (address) => {
    console.log("test function: " + address);
    playerTokenContract.methods.test(address).call().then((val) => {
        console.log("test function: " + val);
    }).catch(console.log);
}