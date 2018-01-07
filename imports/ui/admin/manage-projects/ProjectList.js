import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';
import { Session } from 'meteor/session';
import FlipMove from 'react-flip-move';

import { Projects } from '../../../api/projects';

import ProjectModal from './Modal';

export default class ProjectList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            projects: [],
            project: '',
            isOpen:false
        };
    }
    componentDidMount() {
        document.title = "Time Tracker | Manage Projects";
        this.ProjectTracker = Tracker.autorun(() => {

            Meteor.subscribe('Projects');

            const projects = Projects.find({}).fetch();
            this.setState({ projects });
        });
    }

    componentWillUnmount() {
        this.ProjectTracker.stop();
    }

    renderProjectListItems() {
        if (this.state.projects.length === 0) {
            return (
                <div className="item">
                    <p className="item__status-message">No Projects Found</p>
                </div>
            );
        }
        return this.state.projects.map((project) => {
            return (
                <div className="list" key={project._id}>
                  <div>
                    <h3 className="list__name">{project.name}</h3>
                    <p className="list__details">
                      <span>Managers: {this.getPersons(project.managers)}</span>
                      <span>Members: {this.getPersons(project.members)}</span>
                      <span>Observers: {this.getPersons(project.observers)}</span>
                    </p>
                  </div>
                  <div className="list__actions">
                    <button className="button button--round" onClick={this.editProject.bind(this, project)}>Edit</button>
                  </div>
                </div>
            );
        });
    }
    handleModalClose() {
        this.setState({
            isOpen: false,
        });
    }
    editProject(project){
        this.setState({
            isOpen: true,
            project:project
        });
    }
    getPersons(persons){
        let arrPersons = persons.map((person)=>{ return [person.label]})
        return arrPersons.join();
    }
    render() {
        return (
            <div>
                <FlipMove maintainContainerHeight={true}>
                    {this.renderProjectListItems()}
                </FlipMove>
                {this.state.isOpen ? <ProjectModal project={this.state.project} ModalClose = {this.handleModalClose.bind(this)} openModal={this.state.isOpen} modalLabel="Update Project"/> : null}
            </div>
        );
    }
};
