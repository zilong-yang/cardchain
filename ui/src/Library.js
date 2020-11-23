import React from 'react';
import './stylesheets/Placeholder.css';
import './stylesheets/Library.css';

// const web3 = window.web3;

export class LibraryView extends React.Component {

    constructor(props) {
        super(props);

        this.render = this.render.bind(this);
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
                </div>
            </div>
        );
    }
}