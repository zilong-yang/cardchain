import React from 'react';
import './stylesheets/Placeholder.css';
import './stylesheets/Library.css';
import {addListing} from "./Game.js";
// const web3 = window.web3;

export class LibraryView extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            newTokenListingPrice: -1,
            newTokenListingId: -1,

        };

        this.render = this.render.bind(this);
        this.handleTokenToMarket = this.handleTokenToMarket.bind(this);
        this.setListingPrice = this.setListingPrice.bind(this);
        this.setListingId = this.setListingId.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.buttonMint = this.buttonMint.bind(this);
    }

    handleSubmit(event) {
        event.preventDefault();
        this.handleTokenToMarket(this.state.newTokenListingId, this.state.newTokenListingPrice);
    }
    //NEED TO CHANGE FOR TEST NETWORK
    handleTokenToMarket(tokenId,  tokenPrice) {
        addListing(tokenId, tokenPrice, this.props.account).then()
    }
  

    setListingPrice(event) {
        this.setState({newTokenListingPrice: event.target.value});
      }

    setListingId(event) {
        this.setState({newTokenListingId: event.target.value});
    }

    buttonMint(event) {
        this.props.mintToken();
        // console.log("HElp me");
    }
    

    render() {
        let tokens = this.props.tokens.map((token, i) => {
            return (
                <tr key={i}>
                    <th>{token.name}</th>
                    <th>[{token.stats['stamina']}, {token.stats['strength']}, {token.stats['elusive']}]</th>
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
                                <th>Stats</th>
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
//ISSUES:
//Pressing the mint token button currently does not update the tokens, only when page is refreshed. I believe this has to do with the update method being called from 
//Sub prop, so the sub prop(library) isnt reloading/reciveing the most up to date 