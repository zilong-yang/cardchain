import React from 'react';
import './stylesheets/Library.css';

export default class TrainingView extends React.Component {

    async handleTrain(tokenId) {
        console.log("I want to train token " + tokenId);
    }

    render() {
        let tableView = this.props.trainable.map((token, i) => {
            return (
                <tr key={i}>
                    <th>{token.name}</th>
                    <th>{token.id}</th>
                    <th>{token.stats['stamina']}</th>
                    <th>{token.stats['strength']}</th>
                    <th>{token.stats['elusive']}</th>
                    <th>
                        <input type='button' value='Train'
                               onClick={this.handleTrain.bind(this, token.id)} />
                    </th>
                </tr>
            )
        });

        return (
            <div>
                <div>
                    <table>
                        <thead>
                        <tr>
                            <th>Name</th>
                            <th>ID</th>
                            <th>Stamina</th>
                            <th>Strength</th>
                            <th>Elusive</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                            {tableView}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
}