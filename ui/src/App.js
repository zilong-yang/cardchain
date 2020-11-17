import React from 'react';
import { Menu } from "./Menu";
import { LibraryView } from "./Library";
import MarketView from "./Market";
import TrainingView from './Training';
import LobbyView from "./Lobby";


const CURRENT_INTERFACE = {
    LIBRARY: 'library',
    MARKET: 'marketplace',
    TRAINING: 'training',
    LOBBY: 'lobby'
};

class App extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            tab: CURRENT_INTERFACE.LIBRARY,
        };

        this.tabClicked = this.tabClicked.bind(this);
    }

    tabClicked(tab) {
        this.setState({tab: tab});
    }

    render() {
        return (
            <div>
                <Menu switchTab={this.tabClicked} />
                {this.state.tab === CURRENT_INTERFACE.LIBRARY ?
                    <LibraryView /> : null}
                {this.state.tab === CURRENT_INTERFACE.MARKET ?
                    <MarketView /> : null}
                {this.state.tab === CURRENT_INTERFACE.TRAINING ?
                    <TrainingView /> : null}
                {this.state.tab === CURRENT_INTERFACE.LOBBY ?
                    <LobbyView /> : null}
            </div>
        );
    }
}

export default App;