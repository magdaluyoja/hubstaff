import { Meteor } from 'meteor/meteor';
import React from 'react';
import { Router, Route, browserHistory } from 'react-router';
import { Session } from 'meteor/session';
import { Roles } from 'meteor/alanning:roles';

import Signup from '../ui/Signup';
import Dashboard from '../ui/Dashboard';
import NotFound from '../ui/NotFound';
import Login from '../ui/Login';

import Users from '../ui/admin/manage-users/Users';
import Projects from '../ui/admin/manage-projects/Projects';
import UserActivities from '../ui/admin/user-activities/UserActivities';

import TimeTracker from '../ui/user/TimeTracker/TimeTracker';
import MyProjectList from '../ui/user/MyProjectList/MyProjectList';
import MyActivities from '../ui/user/MyActivities/MyActivities';
import MyWeeklyReport from '../ui/user/MyWeeklyReport/MyWeeklyReport';

const unauthenticatedPages = ['/', '/add-admin'];
const adminPages = [
    '/manage-users', '/manage-projects', '/user-activities'
];
const userPages = [
    '/time-tracker', '/my-projects','/my-activities','/my-weekly-report'
];

const onEnterPublicPage = () => {
    const usertype = Session.get("usertype");
    if (Meteor.userId()) {
        if(usertype){
            if(usertype === "Admin"){
                browserHistory.replace('/time-tracker');
            }
            if(usertype === "User"){
                browserHistory.replace('/manage-users');
            }
        }
    }
};

const onEnterUserPage = () => {
    const usertype = Session.get("usertype");
    if (!Meteor.userId()) {
        browserHistory.replace('/');
    }else{
        if(usertype){
            if(usertype === "Admin"){
                browserHistory.replace('/manage-users');
            }
        }
    }
};

const onEnterAdminPage = () => {
    const usertype = Session.get("usertype");
    if (!Meteor.userId()) {
        browserHistory.replace('/');
    }else{
        if(usertype){
            if(usertype === "User"){
                browserHistory.replace('/time-tracker');
            }
        }
    }
};

export const onAuthChange = (isAuthenticated) => {
    const pathname = browserHistory.getCurrentLocation().pathname;
    const isAdminPage = adminPages.includes(pathname);
    const isUserPage = userPages.includes(pathname);
    const isUnAuthPage = unauthenticatedPages.includes(pathname);

    const Adminrole = Roles.userIsInRole(Meteor.userId(),"Admin");
    const Userrole = Roles.userIsInRole(Meteor.userId(),"User");
    if(Adminrole){
        if(isUserPage || isUnAuthPage){
            browserHistory.replace('/manage-users');
        }
    }
    if(Userrole){
        if(isAdminPage || isUnAuthPage){
            browserHistory.replace('/time-tracker');
        }
    }
    if(!isAuthenticated){
         if(isAdminPage || isUserPage){
            browserHistory.replace('/');
        }
    }
};

export const routes = (
    <Router history={browserHistory}>
        <Route path="/" component={Login} onEnter={onEnterPublicPage}/>
        <Route path="/add-admin" component={Signup} onEnter={onEnterPublicPage}/>

        <Route path="/manage-users" component={Users} onEnter={onEnterAdminPage}/>
        <Route path="/manage-projects" component={Projects} onEnter={onEnterAdminPage}/>
        <Route path="/user-activities" component={UserActivities} onEnter={onEnterAdminPage}/>

        <Route path="/time-tracker" component={TimeTracker} onEnter={onEnterUserPage}/>
        <Route path="/my-weekly-report" component={MyWeeklyReport} onEnter={onEnterUserPage}/>
        <Route path="/my-activities" component={MyActivities} onEnter={onEnterUserPage}/>
        <Route path="/my-projects" component={MyProjectList} onEnter={onEnterUserPage}/>
        
        {/*<Route path="/my-projects" component={MyProjectList} onEnter={onEnterAuthPage}/>
        <Route path="/my-activities" component={MyActivities} onEnter={onEnterAuthPage}/>
        <Route path="/my-weekly-report" component={MyWeeklyReport} onEnter={onEnterAuthPage}/>*/}

        <Route path="*" component={NotFound}/>
    </Router>
);
