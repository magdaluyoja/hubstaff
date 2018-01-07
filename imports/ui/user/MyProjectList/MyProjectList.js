import { Meteor } from 'meteor/meteor';
import React from 'react';
import FlipMove from 'react-flip-move';

import { Projects } from '../../../api/projects';

import PrivateHeader from './../../PrivateHeader';
import Links from './../../Links';

export default class MyProjectList extends React.Component {
	constructor(){
		super();
		this.state ={
			projects:[]
		};
	}
    componentDidMount() {
        var subscriptions = new SubsManager();
        
        document.title = "Time Tracker | My Projects";
        this.ProjectList = Tracker.autorun(() => {

            subscriptions.subscribe('MyProjects');

            let projects = Projects.find({}).fetch();
    		
            this.setState({ projects });
        });
    }
    componentWillUnmount() {
        this.ProjectList.stop();
    }
    renderProjectListItems() {
        if (this.state.projects.length === 0) {
            return (
                <div className="item">
                    <p className="item__status-message">No Projects Found</p>
                </div>
            );
        }
        return (
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Managers</th>
                        <th>Members</th>
                        <th>Observers</th>
                    </tr>
                </thead>
                <tbody>
                    {this.renderMapping()}
                </tbody>
            </table>
        )
    }
    renderMapping(){
        return this.state.projects.map((project) => {
            return (
                <tr key={project._id}>
                    <td>{project.name}</td>
                    <td>{this.getPersons(project.managers)}</td>
                    <td>{this.getPersons(project.members)}</td>
                    <td>{this.getPersons(project.observers)}</td>
                </tr>
            );
        });
    }
    getPersons(persons){
        let arrPersons = persons.map((person)=>{ return [person.label]})
        return arrPersons.join();
    }
	render() {
        return (
            <div>
              <PrivateHeader title="Time Tracker"/>
              <div className="page-content">
                <div className="page-content__sidebar">
                  <Links/>
                </div>
                <div className="page-content__main">
                  <div className="content">
                    <h2 className="module-title">My Projects</h2>
                    <FlipMove maintainContainerHeight={true}>
                        <div className="tbl-container">
                            {this.renderProjectListItems()}
                        </div>
                    </FlipMove>
                  </div>
                </div>
              </div>
            </div>
        );
    }
};