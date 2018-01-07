import React from 'react';
import Modal from 'react-modal';
import UserModal from './Modal';

export default class AddMember extends React.Component {
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
                <button className="button button-wide" onClick={() => this.setState({isOpen: true})}>+ Add User</button>
                {this.state.isOpen ? <UserModal ModalClose = {this.handleModalClose.bind(this)} openModal={this.state.isOpen} modalLabel="Add User"/> : null}
            </div>
        );
    }
}
