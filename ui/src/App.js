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

class App extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            tab: CURRENT_INTERFACE.LIBRARY,
            account: '0x',
            auth : headAuthority,
            balance: 0,

            tokens: [],
        };

        this.updateState = this.updateState.bind(this);
        this.getAccount = this.getAccount.bind(this);
        this.tabClicked = this.tabClicked.bind(this);

        this.getAccount().then(() => {
            this.updateState();
        }).catch(console.log);
    }

    getAccount() {
        const web3 = window.web3;
        const accounts = web3.eth.getAccounts()

        let app = this;
        return accounts.then((accounts) => {
            if (isValidAddress(accounts[0])) {
                app.setState({account: accounts[0]});
            }
        });
    }

    // todo: UI does not update with new account until refreshed
    updateState() {
        let app = this;
        let acc = app.state.account;

        if (isValidAddress(acc)) {
            balanceOf(acc).then((balance) => {
                // update balance
                console.log("Balance of " + shortAddress(acc) + " = " + balance);
                app.setState({balance: balance});
                if (balance < 1) {
                    giveToken(app.state.account, [1, 2, 3]);
                }
            }).then(() => {
                // update tokens
                tokensOfOwner(acc).then((tokens) => {
                    let _tokens = [];
                    tokens.map((tokenID) => {
                        getStats(tokenID).then((_stats) => {
                            _tokens.push({
                                id: tokenID,
                                name: "Token " + tokenID,
                                stats: {
                                    stamina: _stats[0],
                                    strength: _stats[1],
                                    elusive: _stats[2],
                                },
                            });
                        }).then(() => {
                            app.setState({tokens: _tokens});
                        });
                    });
                });
            });

            totalSupply().then((supply) => {console.log("Total tokens = " + supply)});
        }
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
                    <LibraryView account={app.state.account} tokens={app.state.tokens} /> : null}
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
