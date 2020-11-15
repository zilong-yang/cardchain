import React, { Component } from 'react';
import './Menu.css';
import './MenuButton.css';

class MenuButton extends Component {

    render() {
        return (
            <div>
                <button className="menu-button">
                    {this.props.name}
                </button>
            </div>
        );
    }
}

export class Menu extends Component {

    render() {
        return (
            <div>
                <div className="buttons">
                    <MenuButton name="Library" />
                    <MenuButton name="Marketplace" />
                    <MenuButton name="Train" />
                    <MenuButton name="Compete" />
                </div>
                <hr />
            </div>
        )
    }
}