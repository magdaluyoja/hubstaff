import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';
import { Session } from 'meteor/session';
import FlipMove from 'react-flip-move';

import UserModal from './Modal';

export default class UserList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            users: [],
            user: '',
            isOpen:false
        };
    }
    componentDidMount() {
        document.title = "Time Tracker | Manage Users";
        this.UserTracker = Tracker.autorun(() => {

            Meteor.subscribe('Users');

            const users = Meteor.users.find({"profile.userType":"User"}).fetch();
            this.setState({ users });
        });
    }

    componentWillUnmount() {
        this.UserTracker.stop();
    }

    renderUserListItems() {
        if (this.state.users.length === 0) {
            return (
                <div className="item">
                    <p className="item__status-message">No Users Found</p>
                </div>
            );
        }
        return this.state.users.map((user) => {
            if(user.profile.userType === "User"){
                return (
                    <div className="list" key={user._id}>
                      <div>
                        <h3 className="list__name">{user.profile.name}</h3>
                        <p className="list__details">
                          <span>Email: {user.emails[0].address}</span>
                          <span>Position: {user.profile.position}</span>
                        </p>
                      </div>
                      <div className="list__actions">
                        <button className="button button--round" onClick={this.editUser.bind(this, user)}>Edit</button>
                      </div>
                    </div>
                );
            }
        });
    }
    editUser(user){
        this.setState({
            isOpen: true,
            user:user
        });
    }
    handleModalClose() {
        this.setState({
            isOpen: false,
        });
    }
    render() {
        return (
            <div>
                <FlipMove maintainContainerHeight={true}>
                    {this.renderUserListItems()}
                </FlipMove>
                {this.state.isOpen ? <UserModal user={this.state.user} ModalClose = {this.handleModalClose.bind(this)} openModal={this.state.isOpen} modalLabel="Update User"/> : null}
            </div>
        );
    }
};
