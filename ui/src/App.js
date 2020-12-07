import React from 'react';

import { Menu } from "./Menu";
import { LibraryView } from "./Library";
import MarketView from "./Market";
import TrainingView from './Training';
import LobbyView from "./Lobby";

import {playerTokenContract, headAuthority} from "./config";
import {
    balanceOf,
    getStats,
    tokensOfOwner,
    totalSupply,
    isValidAddress,
    giveToken,
    getCurrentListingIds, getListingData
} from "./Game";

const CURRENT_INTERFACE = {
    LIBRARY: 'library',
    MARKET: 'marketplace',
    TRAINING: 'training',
    LOBBY: 'lobby'
};

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
            listings: [],
        };

        this.tabClicked = this.tabClicked.bind(this);
        this.mintToken =  this.mintToken.bind(this);
        this.updateListings = this.updateListings.bind(this);
    }

    async componentDidMount() {
        
        await this.updateAddress();
        
        await this.updateBalance();
       
        await this.updateTokens();
        
        await this.updateListings();
    }

    async updateAddress() {
        //let accounts = await window.web3.eth.getAccounts();
        let accounts = await window.ethereum.request({method: 'eth_requestAccounts'});
        console.assert(accounts !== undefined && accounts.length > 0, "Invalid accounts");

        this.setState({account: accounts[0]});
        
        //TEMPORARY: NEED TO HAVE USER ACCOUNT BE A GANACHE ACCOUNT
        //this.setState({account: '0x7d471da76fCB32bAe4700b4b61cDf186975EC104'})
        return accounts[0];
    }

    async updateBalance() {
        console.log("UpdateBalance");
        let accountTo = this.state.account;
        console.log(this.state.account);
        console.assert(isValidAddress(accountTo), "Invalid account: " + accountTo);
        //console.log(this.state.auth);
        let balance = await balanceOf(accountTo);
        this.setState({balance: balance});

        console.log("balance = " + balance)
        if (balance === 0) {
            this.mintToken();
            console.log("Test2");
        }
        return balance;
    }

    async updateTokens() {
        console.log("UpdateTokens");
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
                    stamina: stats[0],
                    strength: stats[1],
                    elusive: stats[2],
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

        let listingIDs = await getCurrentListingIds();
        let listings = [];
        for (let i = 0; i < listingIDs.length; ++i) {
            let id = listingIDs[i];
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

    tabClicked(tab) {
        this.setState({tab: tab});
    }

    render() {
        let app = this;

        return (
            <div>
                <Menu switchTab={this.tabClicked} />
                {
                    this.state.tab === CURRENT_INTERFACE.LIBRARY ?
                    <LibraryView
                        account={app.state.account}
                        tokens={app.state.tokens}
                        mintToken={this.mintToken}
                        updateListings={this.updateListings}
                    />
                    : null
                }

                {
                    this.state.tab === CURRENT_INTERFACE.MARKET ?
                    <MarketView
                        account={this.state.account}
                        tokens={this.state.tokens}
                        listings={this.state.listings}
                    />
                    : null
                }

                {
                    this.state.tab === CURRENT_INTERFACE.TRAINING ?
                    <TrainingView
                        tokens={app.state.tokens}
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