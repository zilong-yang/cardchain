
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

async loadBlockchainData(){
        const web3  = window.web3

        const accounts = await web3.eth.getAccounts()
        console.log("account",  accounts[0])
        this.setState({account: accounts[0]})
}

async getMetaMaskAccount(){
    const web3  = window.web3
    const accounts = await web3.eth.getAccounts()

    return (accounts[0]);
}


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
