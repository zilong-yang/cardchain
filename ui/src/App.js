import React from 'react';

import { Menu } from "./Menu";
import { LibraryView } from "./Library";
import MarketView from "./Market";
import TrainingView from './Training';
import LobbyView from "./Lobby";

import { headAuthority } from "./config";
import {
    balanceOf,
    getCurrentListingIds,
    getListingData,
    getStats,
    giveToken,
    isListed,
    isValidAddress,
    randInt,
    tokensOfOwner,
} from "./Game";

const CURRENT_INTERFACE = {
    LIBRARY: 'library',
    MARKET: 'marketplace',
    TRAINING: 'training',
    LOBBY: 'lobby'
};

// const shortAddress = (address) => (address.substr(0, 6) + "...");

class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            tab: CURRENT_INTERFACE.LIBRARY,
            account: '0x',
            auth : headAuthority,
            balance: -1,

            tokens: [],
            listings: [],
            trainable: [],
        };

        this.tabClicked = this.tabClicked.bind(this);
    }

    async componentDidMount() {
        await this.updateAddress();
        await this.updateBalance();
        await this.updateTokens();
        await this.updateListings();
        await this.updateTrainable();
    }

    async updateAddress() {
        let accounts = await window.web3.eth.getAccounts();
        console.assert(accounts !== undefined && accounts.length > 0, "Invalid accounts");

        this.setState({account: accounts[0]});
        return accounts[0];
    }

    async updateBalance() {
        let accountTo = this.state.account;
        console.log(this.state.account);
        console.assert(isValidAddress(accountTo), "Invalid account: " + accountTo);

        let balance = await balanceOf(accountTo);
        this.setState({balance: balance});

        console.log("balance = " + balance)
        if (balance === 0) {
            await this.mintToken(); 
        }
        return balance;
    }

    async updateTokens() {
        let acc = this.state.account;
        console.assert(isValidAddress(acc), "Invalid account: " + acc);

        let tokenIDs = await tokensOfOwner(acc);
        console.log(tokenIDs);
        let tokens = [];
        for (let i = 0; i < tokenIDs.length; ++i) {
            let id = tokenIDs[i];
            let stats = await getStats((id));
            tokens.push({
                id: id,
                name: "token " + id,
                stats: {
                    stamina: Number(stats[0]),
                    strength: Number(stats[1]),
                    elusive: Number(stats[2]),
                },
            });
        }

        this.setState({tokens: tokens});
    }

    async mintToken(){
        let authAccount = this.state.auth;
        let accountTo = this.state.account;
        await giveToken(authAccount, accountTo, [randInt(1, 10), randInt(1, 10), randInt(1, 10)]);

        await this.updateBalance();
        await this.updateTokens();
        console.log("Given Token")
    }

    async updateListings() {
        let acc = this.state.account;
        console.assert(isValidAddress(acc), "Invalid account: " + acc);

        // put all listing IDs into a set to avoid duplicates
        let listingIDs = new Set();
        for (let id of await getCurrentListingIds()) {
            listingIDs.add(id);
        }

        // populate listings in state
        let listings = [];
        for (let id of listingIDs) {
            // let id = listingIDs[i];
            let data = await getListingData(id);

            if (data != null && !data[3]) {
                listings.push({
                    id: data[0],
                    price: data[1],
                    tokenId: data[2],
                    stats: {
                        stamina: data[4],
                        strength: data[5],
                        elusive: data[6],
                    }
                });
            }
        }

        this.setState({listings: listings});
    }

    async updateTrainable() {
        let acc = this.state.account;
        console.assert(isValidAddress(acc), "Invalid account: " + acc);

        let tokens = this.state.tokens;
        let trainable = []
        for (let i = 0; i < tokens.length; ++i) {
            let listed = await isListed(tokens[i].id);
            if (listed != null && !listed) {
                trainable.push(tokens[i]);
            }
        }

        this.setState({trainable: trainable});
    }

    tabClicked(tab) {
        this.setState({tab: tab});
    }

    render() {
        return (
            <div>
                <Menu switchTab={this.tabClicked} />
                {
                    this.state.tab === CURRENT_INTERFACE.LIBRARY ?
                    <LibraryView
                        app={this}
                    />
                    : null
                }

                {
                    this.state.tab === CURRENT_INTERFACE.MARKET ?
                    <MarketView
                        app={this}
                    />
                    : null
                }

                {
                    this.state.tab === CURRENT_INTERFACE.TRAINING ?
                    <TrainingView
                        app={this}
                    />
                    : null
                }

                {
                    this.state.tab === CURRENT_INTERFACE.LOBBY ?
                    <LobbyView />
                    : null
                }
            </div>
        );
    }
}

export default App;