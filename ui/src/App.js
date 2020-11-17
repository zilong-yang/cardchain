
import React, { Component } from 'react';
import { render } from 'react-dom';
import Web3 from 'web3'
import { Menu } from "./Menu";
import { yerTokenContracplat, account0 } from "./config";


class App extends Component{

async componentWillMount(){
    await this.loadWeb3()
    await this.loadBlockchainData()
    
}
//Gets account data from metamask and sets state account to first account
async loadBlockchainData(){
        const web3  = window.web3

        const accounts = await web3.eth.getAccounts()
        //console.log("account",  accounts[0])
        this.setState({account: accounts[0]})
}

//Confirms that metamask is connected and sets web3 to appropriate web3.
async loadWeb3(){
    
    if(window.ethereum){
        window.web3 = new Web3(window.ethereum)
        await window.ethereum.enable()
    }
    else if (window.web3) {
        window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
        window.alert('Non-Ethereum browser detected. You should consider trying metamask!')
    }
}

constructor(props){
    super(props)
    this.state={
        account :'0x'
    }
}

render() {
    
    return (
        <div className = "App">
    <Menu />
    <h1 >
        Metamask Account: {this.state.account}
    </h1> 
    </div>  
    );
}


}

export default App;
