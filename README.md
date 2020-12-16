# CardChain

## Introduction
CardChain is a trading card-based platform based on blockchain technologies and the ERC-721 interface for non-fungible tokens. Users can buy, sell, and level up playing **tokens** that can be used to compete with other Players for prizes. Tokens can be trained to increase their value by gaining better stats and possibly other perks. They also have multiple skills that can be upgraded to increase the value on the market and power in one on one match ups. 

## Features
- Player is able to mint and own playing tokens.
- Player is able to list a token on the marketplace.
- Player is able to see and buy tokens on the marketplace paying the listed price.
- Player is able to train their tokens to obtain new tokens that have better statistics.

## Getting Started
### Local Network with `ganache-cli`
1. Make sure you have your local environment setup
    - [Node.js](https://nodejs.org/en/download/): `node --version`
    - [Ganache-cli](https://www.npmjs.com/package/ganache-cli): `ganache-cli`
    - [Truffle](https://www.npmjs.com/package/truffle): `truffle version`
    - [MetaMask](https://metamask.io/) as Chrome extension (account needed)
    
2. Clone this repo and install dependencies
    ```
    > git clone git@github.com:zilong-yang/cardchain.git
    > cd cardchain
    > npm install
    ```
    
3. Deployment
    - Save your 12-word mnemonic when you create a MetaMask account
    - Run `ganache-cli -m "[mnemonic]"`, where `mnemonic` should be replaced with your unique 12-word mnemonic
    - On another terminal, go into the *playerToken* folder and run `truffle migrate`
    - In */ui/src/config.js*, 
        - change `headAuthority` and values in `headAuthorityAccount` to your account address and private key,
        - change `playerTokenContract` to your deployed contract's address
        
4. Run
    - Go into the *ui* folder, run `npm start`
    - A website should automatically pop up in a minute; otherwise, go to [localhost](http://localhost:3000) at port 3000
    
### Ropsten Testnet
1. Clone this repo and install dependencies
    ```
    > git clone git@github.com:zilong-yang/cardchain.git
    > cd cardchain
    > npm install
    ```

2. Go into the *ui* folder and run `npm start`. You should be able to see the application. Test if it has successfully connected to the contract on Ropsten by clicking on *Marketplace* and you should be able to see some listed tokens.

3. Have fun!

## Demo Video
[CardChain Tutorial](https://youtu.be/Q1tRq7YqV8Y)

## Contributors
- [Benjamin Meagher](mailto:meagherb@wit.edu) (Blockchain/Backend Developer, Quality Assurance)
- [Z Yang](mailto:yangz1@wit.edu) (Frontend Developer, System Designer, Bug Fixer)
