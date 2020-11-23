import React from 'react';
import './stylesheets/Placeholder.css';
import './stylesheets/Library.css';

export class LibraryView extends React.Component {

    render() {
        // Get the list of cards this user has
        // let cards = '';

        return (
            <div>
                <div id="library-table-div">
                    <table id="library-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Description</th>
                                <th>ID</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <th>Name 1</th>
                                <th>Description 1</th>
                                <th>ID 1</th>
                            </tr>
                            <tr>
                                <th>Name 2</th>
                                <th>Description 2</th>
                                <th>ID 2</th>
                            </tr>
                            <tr>
                                <th>Name 3</th>
                                <th>Description 3</th>
                                <th>ID 3</th>
                            </tr>
                        </tbody>
                    </table>
                    
                </div>

                {/*<div className="placeholder">
                    User Library
                </div>*/}
            </div>
        );
    }
}