import React, { Component } from 'react';
import './Menu.css';
import './MenuButton.css';

class MenuButton extends Component {

    constructor(props) {
        super(props);

        this.render = this.render.bind(this);
    }

    handleClick() {
        this.props.action(this.props.name);
    }

    render() {
        return (
            <div>
                <input
                    type="button"
                    value={this.props.name}
                    className="menu-button"
                    onClick={this.handleClick.bind(this)}
                />
            </div>
        );
    }
}

export class Menu extends Component {

    constructor(props) {
        super(props);

        this.clickedTab = this.clickedTab.bind(this);
    }

    clickedTab(tab) {
        this.props.switchTab(tab);
    }

    render() {
        return (
            <div>
                <div className="buttons">
                    <MenuButton name="library" action={this.clickedTab} />
                    <MenuButton name="marketplace" action={this.clickedTab} />
                    <MenuButton name="training" action={this.clickedTab} />
                    <MenuButton name="lobby" action={this.clickedTab} />
                </div>
                <hr />
            </div>
        )
    }
}