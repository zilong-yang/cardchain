import React from 'react';
import Web3 from 'web3'

import { Menu } from "./Menu";
import { LibraryView } from "./Library";
import MarketView from "./Market";
import TrainingView from './Training';
import LobbyView from "./Lobby";

import {playerTokenContract, headAuthority} from "./config";
import './Game';
import {giveToken, balanceOf, getStats, testFunction} from "./Game";

const CURRENT_INTERFACE = {
    LIBRARY: 'library',
    MARKET: 'marketplace',
    TRAINING: 'training',
    LOBBY: 'lobby'
};

const isValidAddress = (address) => (address !== undefined && address !== '0x');

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
            // playerTokenContract: playerTokenContract,
            // gameContract: gameContract,
            balanceOfTokens : 0
        };

        this.init = this.init.bind(this);
        this.getAccount = this.getAccount.bind(this);
        this.tabClicked = this.tabClicked.bind(this);

        this.init();
        // promise.then(() => {
        //     if (this.state.account !== '0x') {
        //         console.log(this.state.account);
        //         giveToken(this.state.account, [1, 2, 3]);
        //     }
        // });
    }

    init() {
        let app = this;
        this.getAccount().then(function() {
            let acc = app.state.account;
            if (isValidAddress(acc)) {
                balanceOf(acc).then((balance) => {
                    console.log("Balance of " + acc.substr(0, 6) + "... = " + balance);
                    if (balance < 1) {
                        giveToken(app.state.account, [1, 2, 3]);
                    }
                });

                let tokenID = 1;
                getStats(tokenID).then((stats) => {
                    console.log("Token " + tokenID + "\n" +
                        "\tstamina = " + stats[0] + "\n" +
                        "\tstrength = " + stats[1] + "\n" +
                        "\telusive = " + stats[2])
                })
                testFunction([1]);
                // getTokens().call().then((tokens) => {
                //     console.log(tokens);
                // }).catch(console.log);
            }
        });
    }

    getAccount() {
        const web3 = window.web3;
        const accounts = web3.eth.getAccounts()

        let app = this;
        return accounts.then((accounts) => {
            if (isValidAddress(accounts[0])) {
                app.setState({account: accounts[0]});
                if (isValidAddress(app.state.account))
                    console.log("getAccount: " + app.state.account);
            }
        });
    }

    /*getTokens(address) {
        playerTokenContract.methods.balanceOf(address).call((err, tokens) => {
            console.log(err);
            console.log(tokens);
        });
    }*/

    tabClicked(tab) {
        this.setState({tab: tab});
    }

    //retrieves the number of tokens that account has
    //todo NEEDS A LOT OF WORK
    /*getBalanceOfTokens(account){
        if(this.state.playerTokenContract == null){
            return(-1);
        }
        let balance = 1
        
        this.state.playerTokenContract.methods.balanceOf(account)
            .call().then((_balance) => {
                console.log(_balance);
        })
        return(balance);
    }*/
    
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
