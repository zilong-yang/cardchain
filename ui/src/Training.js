import React from 'react';
import './stylesheets/Library.css';
import {randInt, trainToken} from "./Game";

export default class TrainingView extends React.Component {

    async handleTrain(tokenId, stats) {
        let newStats = [stats['stamina'], stats['strength'], stats['elusive']];
        newStats[0] += randInt(1, 5);
        newStats[1] += randInt(1, 5);
        newStats[2] += randInt(1, 5);

        await trainToken(this.props.app.state.account, tokenId, newStats);
        await this.props.app.updateTokens();
        await this.props.app.updateTrainable();
    }

    render() {
        let tableView = this.props.app.state.trainable.map((token, i) => {
            return (
                <tr key={i}>
                    <th>{token.name}</th>
                    <th>{token.id}</th>
                    <th>{token.stats['stamina']}</th>
                    <th>{token.stats['strength']}</th>
                    <th>{token.stats['elusive']}</th>
                    <th>
                        <input type='button' value='Train'
                               onClick={this.handleTrain.bind(this, token.id, token.stats)} />
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