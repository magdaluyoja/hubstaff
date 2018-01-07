import React from 'react';
import Modal from 'react-modal';

import ProjectModal from './Modal';

export default class AddProject extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpen:false
        };
    }
    handleModalClose() {
        this.setState({
            isOpen: false,
        });
    }
    render() {
        return (
            <div>
                <button className="button button-wide" onClick={() => this.setState({isOpen: true})}>+ Add Project</button>
                {this.state.isOpen ? <ProjectModal ModalClose = {this.handleModalClose.bind(this)} openModal={this.state.isOpen} modalLabel="Add Project"/> : null}
            </div>
        );
    }
}
