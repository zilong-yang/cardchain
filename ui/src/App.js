import React from 'react';

import { Menu } from "./Menu";
import { LibraryView } from "./Library";
import MarketView from "./Market";
import TrainingView from './Training';
import LobbyView from "./Lobby";

import {playerTokenContract, headAuthority} from "./config";
import {giveToken, balanceOf, getStats, tokensOfOwner, totalSupply, testFunction} from "./Game";

const CURRENT_INTERFACE = {
    LIBRARY: 'library',
    MARKET: 'marketplace',
    TRAINING: 'training',
    LOBBY: 'lobby'
};

const isValidAddress = (address) => (address !== undefined && address !== '0x');

const shortAddress = (address) => (address.substr(0, 6) + "...");

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
    }

    init() {
        let app = this;
        this.getAccount().then(function() {
            let acc = app.state.account;
            if (isValidAddress(acc)) {
                balanceOf(acc).then((balance) => {
                    console.log("Balance of " + shortAddress(acc) + " = " + balance);
                    if (balance < 3) {
                        giveToken(app.state.account, [1, 2, 3]);
                    }
                });

                let tokenID = 3;
                getStats(tokenID).then((stats) => {
                    console.log("TokenID: " + tokenID + "\n" +
                        "\tstamina = " + stats[0] + "\n" +
                        "\tstrength = " + stats[1] + "\n" +
                        "\telusive = " + stats[2])
                }).catch(() => {
                    console.log("TokenID " + tokenID + " does not exist");
                })

                // testFunction([acc]);
                totalSupply().then((supply) => {console.log("Total tokens = " + supply)});
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
                    console.log("getAccount: " + shortAddress(app.state.account));
            }
        });
    }

    tabClicked(tab) {
        this.setState({tab: tab});
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
