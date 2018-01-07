import React from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { Session } from 'meteor/session';
import { Roles } from 'meteor/alanning:roles';
import { browserHistory } from 'react-router';

export default class Links extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        adminRole:false
    };
  }
  componentDidMount(){
    this.LinkTracker = Tracker.autorun(() => {
      const role = Roles.userIsInRole(Meteor.userId(),"Admin");
      this.setState({adminRole:role});
    });
  }
  componentWillUnmount() {
      this.LinkTracker.stop();
  }
  redirect(link){
    browserHistory.replace(link);
    Session.set('isNavOpen', false);
  }
  getAdminLinks(){
    const pathname = browserHistory.getCurrentLocation().pathname;
    return (
      <div>
        <a href="#" className={this.isSelected('/manage-users')} onClick={this.redirect.bind(this,"/manage-users")}>Manage Users</a>
        <a href="#" className={this.isSelected('/manage-projects')} onClick={this.redirect.bind(this,"/manage-projects")}>Manage Projects</a>
        <a href="#" className={this.isSelected('/user-activities')} onClick={this.redirect.bind(this,"/user-activities")}>User Activities</a>
      </div>
    )
  }
  getName(){
    if(Meteor.user()){
      let words = Meteor.user().profile.name.split(" ");
      return words[0];  
    }else{
      return null;
    }
  }
  isSelected(link){
    const pathname = browserHistory.getCurrentLocation().pathname;
    if(pathname === link){
      return 'link link--selected';
    }else{
      return 'link';
    }
  }
  getUserLinks(){
    return (
      <div>
        <a href="#" className={this.isSelected('/time-tracker')} onClick={this.redirect.bind(this,"/time-tracker")}>Time Tracker</a>
        <a href="#" className={this.isSelected('/my-projects')} onClick={this.redirect.bind(this,"/my-projects")}>My Projects</a>
        <a href="#" className={this.isSelected('/my-activities')} onClick={this.redirect.bind(this,"/my-activities")}>My Activities</a>
        <a href="#" className={this.isSelected('/my-weekly-report')} onClick={this.redirect.bind(this,"/my-weekly-report")}>Weekly Report</a>
      </div>
    )
  }
  render(){
    return (
      <div className="link-list">
      	<div className="link-list__header">
      		<h3>Hi, {this.getName()}!</h3>
  	    </div>
        {this.state.adminRole ? this.getAdminLinks() : this.getUserLinks()}
      </div>
    );
  }
};