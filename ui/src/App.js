
import React, { Component } from 'react';
import { render } from 'react-dom';
import Web3 from 'web3'
import { Menu } from "./Menu";


import { LibraryView } from "./Library";
import MarketView from "./Market";
import TrainingView from './Training';
import LobbyView from "./Lobby";


const CURRENT_INTERFACE = {
    LIBRARY: 'library',
    MARKET: 'marketplace',
    TRAINING: 'training',
    LOBBY: 'lobby'
};

class App extends React.Component {
    async componentWillMount(){
        await this.loadWeb3()
        await this.loadBlockchainData()
        
    }
    //Gets account data from metamask and sets state account to first account
    async loadBlockchainData(){
            const web3  = window.web3
    
            const accounts = await web3.eth.getAccounts()
            //console.log("account",  accounts[0])
            this.setState({account: accounts[0]})
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
    constructor(props) {
        super(props);

        this.state = {
            tab: CURRENT_INTERFACE.LIBRARY,
            account :'0x'
        };

        this.tabClicked = this.tabClicked.bind(this);
    }

    tabClicked(tab) {
        this.setState({tab: tab});
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
