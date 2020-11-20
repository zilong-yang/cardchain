import React from 'react';
import Web3 from 'web3'
import { Menu } from "./Menu";


import { LibraryView } from "./Library";
import MarketView from "./Market";
import TrainingView from './Training';
import LobbyView from "./Lobby";

import {playerTokenContract, gameContract, headAuthority, accounts} from "./config";

const CURRENT_INTERFACE = {
    LIBRARY: 'library',
    MARKET: 'marketplace',
    TRAINING: 'training',
    LOBBY: 'lobby'
};

/*
 * Current Issues:
 * Figure out how to actually send the contract, make sure the contract is created properly
 */
class App extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            tab: CURRENT_INTERFACE.LIBRARY,
            account: '0x',
            auth : headAuthority,
            playerTokenContract: playerTokenContract,
            gameContract: gameContract,
            balanceOfTokens : 0
        };

        this.getAccount = this.getAccount.bind(this);
        this.tabClicked = this.tabClicked.bind(this);

        this.getAccount();
    }

    getAccount() {
        const web3 = window.web3;
        const accounts = web3.eth.getAccounts()

        let app = this;
        accounts.then((acc) => {
            app.setState({account: acc[0]});
        });
    }

    tabClicked(tab) {
        this.setState({tab: tab});
    }

    //retrieves the number of tokens that account has
    //todo NEEDS A LOT OF WORK
    getBalanceOfTokens(account){
        if(this.state.playerTokenContract == null){
            return(-1);
        }
        let balance = 1
        
        this.state.playerTokenContract.methods.balanceOf(account)
            .call().then((_balance) => {
                console.log(_balance);
        })
        return(balance);
    }
    
    render() {
        let app = this;

        return (
            <div>
                <Menu switchTab={this.tabClicked} />
                {this.state.tab === CURRENT_INTERFACE.LIBRARY ?
                    <LibraryView account={app.state.account} /> : null}
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
