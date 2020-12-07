import React from 'react';
import './stylesheets/Placeholder.css';
import './stylesheets/Library.css';
import {addListing} from "./Game.js";

export class LibraryView extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            listingPrice: -1,
            listingId: -1,
        };

        this.render = this.render.bind(this);
        this.handleTokenToMarket = this.handleTokenToMarket.bind(this);
        this.setListingPrice = this.setListingPrice.bind(this);
        this.setListingId = this.setListingId.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.buttonMint = this.buttonMint.bind(this);
    }

    async handleSubmit(event) {
        event.preventDefault();
        await this.handleTokenToMarket(this.state.listingId, this.state.newTokenListingPrice);
    }

    async handleTokenToMarket(tokenId, tokenPrice) {
        await addListing(tokenId, tokenPrice);
        await this.props.updateListings();
    }

    setListingPrice(event) {
        this.setState({newTokenListingPrice: event.target.value});
    }

    setListingId(event) {
        this.setState({listingId: event.target.value});
    }

    buttonMint() {
        this.props.mintToken();
    }

    render() {
        let tokens = this.props.tokens.map((token, i) => {
            return (
                <tr key={i}>
                    <th>{token.name}</th>
                    <th>{token.stats['stamina']}</th>
                    <th>{token.stats['strength']}</th>
                    <th>{token.stats['elusive']}</th>
                    <th>{token.id}</th>
                   
                    
                </tr>
            )
        });

        return (
            <div>
                <h1 align="center">Account: {this.props.account}</h1>
                <div id="library-table-div">
                    <table id="library-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Stamina</th>
                                <th>Strength</th>
                                <th>Elusive</th>
                                <th>ID</th>
                             
                            </tr>
                        </thead>
                        <tbody>
                            {tokens}
                        </tbody>
                    </table>
                    <br/>
                    <form id="ListToken" onSubmit={this.handleSubmit}>
                    <label id="tokenId"> Token Id: </label>

                    <input type="text" id="tokenId" required onChange={this.setListingId}/><br/>
                    <label id="listPrice"> List Price(In Wei): </label>
                    <input type="text" id="listPrice"  required onChange={this.setListingPrice}/><br/>
                    <input type="submit" value="List Token on Market" />
                    </form>

                    <form>

                    <input type="button"  value = "Mint Token" onClick = {this.buttonMint}/>
                    </form>
                        
                </div>
            </div>
        );
    }
}