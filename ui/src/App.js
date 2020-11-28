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

const randInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.ceil(max);
    return Math.floor(Math.random() * (max - min) + min);
};

class App extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            tab: CURRENT_INTERFACE.LIBRARY,
            account: '0x',
            auth : headAuthority,
            balance: -1,

            tokens: [],
        };

        this.tabClicked = this.tabClicked.bind(this);
    }

    async componentDidMount() {
        await this.updateAddress();
        await this.updateBalance();
        await this.updateTokens();
    }

    async updateAddress() {
        let accounts = await window.web3.eth.getAccounts();
        console.assert(accounts !== undefined && accounts.length > 0, "Invalid accounts");

        this.setState({account: accounts[0]});
        return accounts[0];
    }

    async updateBalance() {
        let acc = this.state.account;
        console.assert(isValidAddress(acc), "Invalid account: " + acc);

        let balance = await balanceOf(acc);
        this.setState({balance: balance});

        if (balance === 0) {
            await giveToken(acc, [randInt(1, 10), randInt(1, 10), randInt(1, 10)]);
            await this.updateBalance();
        }

        return balance;
    }

    async updateTokens() {
        let acc = this.state.account;
        console.assert(isValidAddress(acc), "Invalid account: " + acc);

        let tokenIDs = await tokensOfOwner(acc);
        let tokens = [];
        for (let i = 0; i < tokenIDs.length; ++i) {
            let id = tokenIDs[i];
            let stats = await getStats((id));
            tokens.push({
                id: id,
                name: "token " + id,
                stats: {
                    stamina: stats[0],
                    strength: stats[1],
                    elusive: stats[2],
                },
            });
        }

        this.setState({tokens: tokens});
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
