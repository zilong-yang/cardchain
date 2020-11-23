
import React, { Component } from 'react';
//import { render } from 'react-dom';
import Web3 from 'web3'

import { Menu } from "./Menu";
import { LibraryView } from "./Library";
import MarketView from "./Market";
import TrainingView from './Training';
import LobbyView from "./Lobby";

import PlayerToken from "./PlayerToken.json"

const CURRENT_INTERFACE = {
    LIBRARY: 'library',
    MARKET: 'marketplace',
    TRAINING: 'training',
    LOBBY: 'lobby'
};
/*
Current Issues:
Figure out how to actually send the contract, make sure the contract is created properly



*/
class App extends React.Component {
    async componentDidMount(){
        await this.loadWeb3()
        await this.loadBlockchainData()
        //await this.generateContracts()
        //make sure that this code executes before calling other functions
    
    }

   // async componentDidMount(){
       
    //}
    //Gets account data from metamask and sets state account to first account
    async loadBlockchainData(){
            const web3  = window.web3
    
            const accounts = await web3.eth.getAccounts()
            this.setState({metaMaskAccount: accounts[0]})
            //console.log(this.state.metaMaskAccount)

            const networkID  = await web3.eth.net.getId()
            const playerTokenContractData = PlayerToken.networks[networkID]
            if(playerTokenContractData){
            const playerAbi = PlayerToken.abi 
            const playerAddress = playerTokenContractData.address
            const playerTokenContract = new  web3.eth.Contract(playerAbi, playerAddress)
            //console.log(playerTokenContract)
            this.setState({playerTokenContract:playerTokenContract})
            //console.log(this.state.playerTokenContract)
            //console.log(playerTokenContract.methods)
            console.log(this.state.playerTokenContract.methods)
            playerTokenContract.methods.getApproved().send()
            }
            else{
                console.log("Smart contract PlayerToken not deployed to network!")
            }
            //const gameContract
    }
    
    //Confirms that metamask is connected and sets web3 to appropriate web3.
    async loadWeb3(){
        
        if(window.ethereum){
            window.web3 = new Web3(window.ethereum)
            await window.ethereum.enable()
        }
        else if (window.web3) {
            window.web3 = new Web3(window.web3.currentProvider)
        }
        else {
            window.alert('Non-Ethereum browser detected. You should consider trying metamask!')
        }
    }

    //generates and sets contracts using windows web3 object
    async generateContracts(){
        const web3 = window.web3
        
        //authority account
        //update each time you deploy a local network with ganache
        let headAuthority = '0xa928e88Dc27A56dF2F6646A82EE25BDA261acd59'
        
        //update when contracts are modified
        let playerTokenABI = [{"inputs":[{"internalType":"address","name":"_authority","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"approved","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"operator","type":"address"},{"indexed":false,"internalType":"bool","name":"approved","type":"bool"}],"name":"ApprovalForAll","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Transfer","type":"event"},{"constant":true,"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"_getStats","outputs":[{"internalType":"uint8[]","name":"","type":"uint8[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"approve","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"getApproved","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"operator","type":"address"}],"name":"isApprovedForAll","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"ownerOf","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"safeTransferFrom","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"bytes","name":"_data","type":"bytes"}],"name":"safeTransferFrom","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"bool","name":"approved","type":"bool"}],"name":"setApprovalForAll","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"internalType":"bytes4","name":"interfaceId","type":"bytes4"}],"name":"supportsInterface","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"uint256","name":"index","type":"uint256"}],"name":"tokenByIndex","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"uint256","name":"index","type":"uint256"}],"name":"tokenOfOwnerByIndex","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"tokenURI","outputs":[{"internalType":"string","name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"transferFrom","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"_to","type":"address"},{"internalType":"string","name":"_tokenURI","type":"string"},{"internalType":"uint8[3]","name":"stats","type":"uint8[3]"}],"name":"mint","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"uint8[3]","name":"stats","type":"uint8[3]"}],"name":"changeStats","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"_account","type":"address"}],"name":"addAuthorizeAccount","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"}] 
        let gameABI = [{"inputs":[{"internalType":"address","name":"_authority","type":"address"},{"internalType":"address payable","name":"_serviceFund","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"constant":true,"inputs":[],"name":"authority","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"playerId","type":"uint256"}],"name":"hostGame","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"playerId","type":"uint256"},{"internalType":"uint256","name":"gameId","type":"uint256"}],"name":"joinGame","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"winnerId","type":"uint256"},{"internalType":"uint256","name":"gameId","type":"uint256"}],"name":"endGame","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"_account","type":"address"}],"name":"addAuthorizeAccount","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"}]
        
        //update each time you deploy a local network with ganache
        let playerTokenAddress='0x152F335CacaF724f5677cAB116fE54A2dd9cf202'
        let gameAddress = '0x7F50659a28739d4fAC408c9cf23cCfcBDa3FedF8'

        // Initialize the rating contract with web3 
        // Reference: https://web3js.readthedocs.io/en/1.0/web3-eth-contract.html
        const playerTokenContract=new web3.eth.Contract(playerTokenABI, playerTokenAddress)
        const gameContract = new web3.eth.Contract(gameABI, gameAddress)

        //sets fallback from account to authrority account
        playerTokenContract.options.address = headAuthority
        gameContract.options.address = headAuthority

        this.setState({playerTokenContract: playerTokenContract})
        this.setState({gameContract: gameContract})
        this.setState({Authorityaccount: headAuthority})
        
       // console.log("PlayerMethods:", this.state.playerTokenContract.methods)
        //console.log("AuthorityAccount", this.state.Authorityaccount)
        
    }
    //not used rn
    createPlayerTokenContract(){
        const web3 = window.web3
        let playerTokenABI = [{"inputs":[{"internalType":"address","name":"_authority","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"approved","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"operator","type":"address"},{"indexed":false,"internalType":"bool","name":"approved","type":"bool"}],"name":"ApprovalForAll","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Transfer","type":"event"},{"constant":true,"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"_getStats","outputs":[{"internalType":"uint8[]","name":"","type":"uint8[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"approve","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"getApproved","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"operator","type":"address"}],"name":"isApprovedForAll","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"ownerOf","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"safeTransferFrom","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"bytes","name":"_data","type":"bytes"}],"name":"safeTransferFrom","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"bool","name":"approved","type":"bool"}],"name":"setApprovalForAll","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"internalType":"bytes4","name":"interfaceId","type":"bytes4"}],"name":"supportsInterface","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"uint256","name":"index","type":"uint256"}],"name":"tokenByIndex","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"uint256","name":"index","type":"uint256"}],"name":"tokenOfOwnerByIndex","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"tokenURI","outputs":[{"internalType":"string","name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"transferFrom","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"_to","type":"address"},{"internalType":"string","name":"_tokenURI","type":"string"},{"internalType":"uint8[3]","name":"stats","type":"uint8[3]"}],"name":"mint","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"uint8[3]","name":"stats","type":"uint8[3]"}],"name":"changeStats","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"_account","type":"address"}],"name":"addAuthorizeAccount","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"}] 
        
        //update each time you deploy a local network with ganache
        let playerTokenAddress='0x152F335CacaF724f5677cAB116fE54A2dd9cf202'
        

        // Initialize the rating contract with web3 
        // Reference: https://web3js.readthedocs.io/en/1.0/web3-eth-contract.html
        const playerTokenContract=new web3.eth.Contract(playerTokenABI, playerTokenAddress)
        return(playerTokenContract);
    }
    //not used rn
    createGameContract(){
        const web3 = window.web3
        let gameABI = [{"inputs":[{"internalType":"address","name":"_authority","type":"address"},{"internalType":"address payable","name":"_serviceFund","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"constant":true,"inputs":[],"name":"authority","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"playerId","type":"uint256"}],"name":"hostGame","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"playerId","type":"uint256"},{"internalType":"uint256","name":"gameId","type":"uint256"}],"name":"joinGame","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"winnerId","type":"uint256"},{"internalType":"uint256","name":"gameId","type":"uint256"}],"name":"endGame","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"_account","type":"address"}],"name":"addAuthorizeAccount","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"}]
        
        //update each time you deploy a local network with ganache
        let gameAddress = '0x7F50659a28739d4fAC408c9cf23cCfcBDa3FedF8'

        // Initialize the rating contract with web3 
        // Reference: https://web3js.readthedocs.io/en/1.0/web3-eth-contract.html
        const gameContract = new web3.eth.Contract(gameABI, gameAddress)
        return(gameContract);
    }
    
    constructor(props) {
        super(props);

        this.state = {
            tab: CURRENT_INTERFACE.LIBRARY,
            metaMaskAccount: '0x',
            Authorityaccount : '',
            playerTokenContract: '',
            gameContract:  '',
          
        };
        
        this.tabClicked = this.tabClicked.bind(this);

        //set the contracts in the constructor so they happen at the same time
    }

    tabClicked(tab) {
        this.setState({tab: tab});
    }

    //retrieves the number of tokens that account has
    //NEEDS A LOT OF WORK
    getBalanceOfTokens(account){
       
        if(this.state.playerTokenContract == null){
            return(-1);
        }
        let balance = 1
        
        this.state.playerTokenContract.methods.balanceOf(account).call().then(function updateTokenCount(){

        })
        //console.log(balance);
        return(balance);
    }
    
    render() {
        
        return (
            <div>
                <Menu switchTab={this.tabClicked} />
                {this.state.tab === CURRENT_INTERFACE.LIBRARY ?
                    <LibraryView /> : null}
                {this.state.tab === CURRENT_INTERFACE.MARKET ?
                    <MarketView /> : null}
                {this.state.tab === CURRENT_INTERFACE.TRAINING ?
                    <TrainingView /> : null}
                {this.state.tab === CURRENT_INTERFACE.LOBBY ?
                    <LobbyView /> : null}
            </div>
        );

        
        
    }
}

export default App;
