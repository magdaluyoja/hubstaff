import { Meteor } from 'meteor/meteor';
import React from 'react';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import FlipMove from 'react-flip-move';

import { Projects } from '../../../api/projects';
import { Mytime } from '../../../api/timeTracker';

import PrivateHeader from './../../PrivateHeader';
import Links from './../../Links';

import '/node_modules/react-datepicker/dist/react-datepicker.css';

import {PDF} from './PDF';

export default class MyProjectList extends React.Component {
	constructor(){
		super();
		this.state ={
            mytimes:[],
            projects:[],
            projectFilter:"",
            dateFilter:"",
            filter:"",
            startDate: moment()
		};
	}
    componentDidMount() {
        var subscriptions = new SubsManager();
        document.title = "Time Tracker | My Activities";
        this.MyActivities = Tracker.autorun(() => {

            subscriptions.subscribe('MyProjects');
            subscriptions.subscribe('MyTime');

            let projects = Projects.find({}).fetch();
            projects = projects.map(function (item,index) {
                var project = {value:item._id,label:item.name};
                return project;
            });
            this.setState({ projects });
            if(projects.length > 0){
                this.setState({ selproject: projects[0]});    
            }

            let date = this.state.startDate;
            date = moment(date._d).format("YYYY/MM/DD");
            this.setState({
                dateFilter: date
            });
            if(projects.length > 0){
                const mytimes = Mytime.find({dateStarted:date, "project.value":projects[0].value, userId: Meteor.userId()}).fetch();
                this.setState({ mytimes });
            }
        });
    }
    componentWillUnmount() {
        this.MyActivities.stop();
    }
    renderAll() {
        
        if (this.state.mytimes.length === 0) {
            return (
                <div className="item">
                    <p className="item__status-message">No Records Found</p>
                </div>
            );
        }
        return (
            <table>
                <thead>
                    <tr>
                        <th>Project Name</th>
                        <th>Date & Time Started</th>
                        <th>Date & Time Ended</th>
                        <th>Total Time</th>
                    </tr>
                </thead>
                <tbody>
                    {this.renderMapping()}
                </tbody>
            </table>
        )
    }
    renderMapping(){
        return this.state.mytimes.map((mytime) => {
            return (
                <tr key={mytime._id}>
                    <td>{mytime.project.label}</td>
                    <td>{mytime.dateStarted} {mytime.timeStarted}</td>
                    <td>{mytime.dateEnded} {mytime.timeEnded}</td>
                    <td>{mytime.totalTime}</td>
                </tr>
            );
        });
    }
    logProjects(project){
        this.setState({
            selproject:project,
        });
        
        if(project){
            this.setState({
                projectFilter:project.value
            },this.setNewState);
        }else{
            this.setState({
                projectFilter:""
            },this.setNewState);
        }
    }
    handleChange(date){
        
        this.setState({
            startDate: date
        });
        if(date){
            const fDate = moment(date._d).format("YYYY/MM/DD");
            this.setState({
                dateFilter: fDate
            },this.setNewState);
        }else{
            this.setState({
                dateFilter:""
            },this.setNewState);
        }
    }
    setNewState(){
        this.handleFilters();
    }
    handleFilters(){
        let limitSort = {limit: 10, sort: {date: -1}};
        if(this.state.dateFilter && !this.state.projectFilter){
            const mytimes = Mytime.find({dateStarted:this.state.dateFilter, userId: Meteor.userId()}, limitSort).fetch();
            this.setState({ mytimes });
        }
        if(!this.state.dateFilter && this.state.projectFilter){
            const mytimes = Mytime.find({"project.value":this.state.projectFilter, userId: Meteor.userId()}, limitSort).fetch();
            this.setState({ mytimes });
        }
        if(this.state.dateFilter && this.state.projectFilter){
            const mytimes = Mytime.find({dateStarted:this.state.dateFilter, "project.value":this.state.projectFilter, userId: Meteor.userId()}, limitSort).fetch();
            this.setState({ mytimes });
        }
        if(!this.state.dateFilter && !this.state.projectFilter){
            const mytimes = Mytime.find({userId: Meteor.userId()}, limitSort).fetch();
            this.setState({ mytimes });
        }
    }
    getPDF(){
        Meteor.pdf.save(PDF(this.state.mytimes), 'My Activities');
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
                    <h2 className="module-title">My Activities</h2>
                    <Select 
                        name="projects" 
                        ref="projects" 
                        value={this.state.selproject}  
                        options={this.state.projects} 
                        onChange={this.logProjects.bind(this)} 
                        placeholder="My Projects"
                        disabled={this.state.hasStarted}
                    />
                    <div className="div-datepicker">
                        <DatePicker
                            selected={this.state.startDate}
                            onChange={this.handleChange.bind(this)}
                            placeholderText="Date"
                        />
                    </div>
                    <FlipMove maintainContainerHeight={true}>
                        <div className="tbl-container">
                            {this.renderAll()}
                        </div>
                    </FlipMove>
                    {this.state.mytimes.length ?
                        <button className="button button-wide" onClick={this.getPDF.bind(this)}>Download PDF</button>
                    : null}
                  </div>
                </div>
              </div>
            </div>
        );
    }
};