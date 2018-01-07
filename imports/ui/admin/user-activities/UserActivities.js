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
import DetailsModal from './Modal';

import '/node_modules/react-datepicker/dist/react-datepicker.css';

import {PDF} from './PDF';

export default class MyProjectList extends React.Component {
	constructor(){
		super();
		this.state ={
            members:[],
            alltimes:[],
            projects:[],
            projectFilter:"",
            dateFilter:"",
            filter:"",
            startDate: moment()
		};
        this.result = [];
	}
    componentDidMount() {
        document.title = "Time Tracker | User Activities";
        this.MyActivities = Tracker.autorun(() => {

            Meteor.subscribe('Users');
            Meteor.subscribe('Projects');
            Meteor.subscribe('AllTime');

            let projects = Projects.find({}).fetch();
            projects = projects.map(function (item,index) {
                var project = {value:item._id,label:item.name};
                return project;
            })
            let date = this.state.startDate;
            date = moment(date._d).format("YYYY/MM/DD");
            this.setState({
                dateFilter: date
            });
            date = moment(date._d).format("YYYY/MM/DD");
            
            const alltimes = Mytime.find({dateStarted:date}).fetch();
            const members = Meteor.users.find({}).fetch();
    		
            this.setState({ members });
            this.setState({ projects });
            this.setState({ alltimes });
        });
    }
    componentWillUnmount() {
        this.MyActivities.stop();
    }
    renderAll() {
        
        if (this.state.alltimes.length === 0) {
            this.result = [];
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
                        <th>Member Name</th>
                        <th>Date</th>
                        <th>Total Time</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {this.renderMapping()}
                </tbody>
            </table>
        )
    }
    getName(memberId){
        return this.state.members.map((member)=>{
            if(member._id === memberId){
                return member.profile.name;
            }
        });
    }
    formatTime(time){
        return moment("1900/01/01 00:00:00").add(time, 'seconds').format("HH:mm:ss");
    }
    renderMapping(){
        let result = [];
        let self = this;

        this.state.alltimes.forEach(function (a) {
            let seconds = moment.duration(a.totalTime).asSeconds();
            let tot = 0;
            if (!this[a.dateStarted+a.userId+a.project.value]) {
                this[a.dateStarted+a.userId+a.project.value] = { 
                    _id:a._id,
                    dateStarted: a.dateStarted, 
                    userId: a.userId, 
                    user: self.getName(a.userId), 
                    project: {value:a.project.value, label:a.project.label}, 
                    totalTime: 0 
                };
                result.push(this[a.dateStarted+a.userId+a.project.value]);
            }
            
            this[a.dateStarted+a.userId+a.project.value].totalTime += seconds;
        }, Object.create(null));
        this.result = result;
        return result.map((mytime) => {
            return (
                <tr key={mytime._id}>
                    <td>{mytime.project.label}</td>
                    <td>{mytime.user}</td>
                    <td>{mytime.dateStarted}</td>
                    <td>{this.formatTime(mytime.totalTime)}</td>
                    <td>
                        <button className="button" onClick={this.getModal.bind(this, mytime.project.label, mytime.project.value, mytime.dateStarted, mytime.userId, mytime.user)}>
                            Details
                        </button> 
                    </td>
                </tr>
            );
        });
    }
    getModal(modalLabel,projectId,dateStarted, userId, user){
        this.setState({
            isOpen: true,
            modalLabel:modalLabel,
            projectId:projectId,
            dateStarted:dateStarted,
            userId:userId,
            user:user
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
        if(this.state.dateFilter && !this.state.projectFilter){
            const alltimes = Mytime.find({dateStarted:this.state.dateFilter}).fetch();
            this.setState({ alltimes });
        }
        if(!this.state.dateFilter && this.state.projectFilter){
            const alltimes = Mytime.find({"project.value":this.state.projectFilter}).fetch();
            this.setState({ alltimes });
        }
        if(this.state.dateFilter && this.state.projectFilter){
            const alltimes = Mytime.find({dateStarted:this.state.dateFilter, "project.value":this.state.projectFilter}).fetch();
            this.setState({ alltimes });
        }
        if(!this.state.dateFilter && !this.state.projectFilter){
            const alltimes = Mytime.find({}).fetch();
            this.setState({ alltimes });
        }
    }
    handleModalClose() {
        this.setState({
            isOpen: false
        });
    }
    getPDF(){
        Meteor.pdf.save(PDF(this.result), 'User Activities');
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
                    <h2 className="module-title">User Activities</h2>
                    <Select 
                        name="projects" 
                        ref="projects" 
                        value={this.state.selproject}  
                        options={this.state.projects} 
                        onChange={this.logProjects.bind(this)} 
                        placeholder="Select Project"
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
                    {this.state.alltimes.length > 0 ?
                        <button className="button button-wide" onClick={this.getPDF.bind(this)}>Download PDF</button>
                    : null }
                    {this.state.isOpen ?
                        <DetailsModal 
                            openModal={this.state.isOpen} 
                            modalLabel={this.state.modalLabel}
                            projectId={this.state.projectId}
                            dateStarted={this.state.dateStarted}
                            ModalClose = {this.handleModalClose.bind(this)}
                            userId = {this.state.userId}
                            user = {this.state.user}
                        />
                        :
                        null
                    }
                  </div>
                </div>
              </div>
            </div>
        );
    }
};