import React from 'react';
import './stylesheets/Placeholder.css'
import './stylesheets/Library.css';
import {addListing, getListingData, getCurrentListingIds, purchaseToken, isValidAddress} from "./Game";




const shortAddress = (address) => (address.substr(0, 6) + "...");


export default class MarketView extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            account: '0x',
            listings: []

        };

        this.buyToken = this.buyToken.bind(this);
    }

    //Purchase token, handle failure? Update listings if success
    buyToken(event){    
        //this.handleTokenPurchase(id);
        let listingId = event.target.listingId;
        let amount = event.target.amount;
        //this.handleTokenPurchase(listingId, amount);
        console.log(event.target);
    }

     //NEED TO CHANGE FOR TEST NETWORK , SENDING AMOUNT MUST BE THE THE SAME AS THE VALUE
    async handleTokenPurchase(listingId, amount){
        await purchaseToken(listingId).then();
    }

    async componentDidMount() {
        await this.updateAddress();
        await this.updateListings();
    }

    async updateAddress() {
        let accounts = await window.web3.eth.getAccounts();
        console.assert(accounts !== undefined && accounts.length > 0, "Invalid accounts");

        this.setState({account: accounts[0]});
        return accounts[0];
    }

     //NEED TO HANDLE ERROR WHEN getListingData throws error for calling a inactive listing id.
    //Get listing ids, for each, call getListingData. Store to state
    //This might be able to be moved to marketplace component. Get Listing data is authorized. 
    async updateListings(){
        let acc = this.state.account;
        console.assert(isValidAddress(acc), "Invalid account: " + acc);

        let listingIds = await getCurrentListingIds();
        let listings = [];
        for(let i = 0; i < listingIds.length; ++i){
            let id = listingIds[i];
            let listData = await getListingData(id);
            
            
            if(listData != null){
            listings.push({
               id: listData[0],
               tokenId:  listData[1],
               price : listData[2],
               stats: {
                stamina: listData[3],
                strength: listData[4],
                elusive: listData[5],
            },
            }); 
        }
        }

        this.setState({listings : listings});
    }


    render() {
        let listings = this.state.listings.map((listing, i) => {
            return(
                <tr key={i}>
                    <th>{listing.id}</th>
                    <th>[{listing.stats['stamina']}, {listing.stats['strength']}, {listing.stats['elusive']}]</th>
                    <th>{listing.tokenId}</th>
                    <th>{listing.price}</th>
                    <th>
                        <input type="button" value="Buy" listingid = {listing.id} amount = {listing.price} onClick={this.buyToken}/>
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
                                <th>Lisitng Id</th>
                                <th>Stats</th>
                                <th>Token Id</th>
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