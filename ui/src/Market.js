import React from 'react';
import './stylesheets/Placeholder.css'
import './stylesheets/Library.css';
import {purchaseToken} from "./Game";

export default class MarketView extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            account: this.props.app.state.account,
            listings: this.props.app.state.listings,
        };
    }

    async handleTokenPurchase(listingId, price) {
        await purchaseToken(listingId, price);

        await this.props.app.updateListings();
        await this.props.app.updateTokens();
        await this.props.app.updateTrainable();
    }

    render() {
        let listings = this.state.listings.map((listing, i) => {
            return (
                <tr key={i}>
                    <th>{listing.id}</th>
                    <th>{listing.stats['stamina']}</th>
                    <th>{listing.stats['strength']}</th>
                    <th>{listing.stats['elusive']}</th>
                    <th>{listing.price}</th>
                    <th>
                        <input type="button" value="Buy"
                               onClick={this.handleTokenPurchase.bind(this, listing.id, listing.price)}/>
                    </th>
                </tr>
            )
        });

        return (
            <div>
                <div className="library-table-div">
                    <table id="library-table">
                        <thead>
                        <tr>
                            <th>Listing Id</th>
                            <th>Stamina</th>
                            <th>Strength</th>
                            <th>Elusive</th>
                            <th>Price (In Wei)</th>
                            <th>Purchase</th>
                        </tr>
                        </thead>
                        <tbody>
                        {listings}
                        </tbody>
                    </table>
                </div>

            </div>
        )
    }
}