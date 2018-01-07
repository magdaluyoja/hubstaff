import { Meteor } from 'meteor/meteor';
import React from 'react';
import moment from 'moment';
import Select from 'react-select';
import FlipMove from 'react-flip-move';

import { Projects } from '../../../api/projects';
import { Mytime } from '../../../api/timeTracker';

import Links from './../../Links';

import PrivateHeader from './../../PrivateHeader';

export default class TimeTracker extends React.Component {
	constructor(){
		super();
		this.timer = "";
		this.selectedProj = "";
		this.state={
			counter:"00:00:00",
			selproject:'',
			mytimes:[],
			hasStarted:false
		};
	}
    componentDidMount() {
    	document.title = "Time Tracker | Timer Tracker";
        this.TimerTracker = Tracker.autorun(() => {

            Meteor.subscribe('MyProjects');
            Meteor.subscribe('MyTimeToday');

            let projects = Projects.find({}).fetch();
            projects = projects.map(function (item,index) {
                var project = {value:item._id,label:item.name};
                return project;
            })

            this.setState({ projects });
        });
    }
    componentWillUnmount() {
        this.TimerTracker.stop();
    }
    isEmpty(obj) {
	    for(var key in obj) {
	        if(obj.hasOwnProperty(key))
	            return false;
	    }
	    return true;
	}
	start(){
		let trxId = "";
		let self = this;
		let seconds = moment.duration(this.state.counter).asSeconds();
		let date = moment().format("YYYY/MM/DD");
		let time = moment().format("HH:mm:ss");
		
		if(this.isEmpty(this.state.selproject)){
			self.setState({
				msg: "Please select project",
				msgClass: "err-msg"
			});	
            return;
		}else{
			self.setState({msg: null});
		}
		
		Meteor.call("mytime.create",this.state.selproject, date, time, this.state.counter,function (err,id) {
            if (err) {
                self.setState({
                	msg: err.reason,
                	msgClass: "err-msg"
                });
            } else {
	            self.setState({
	            	trxId: id,
	            	hasStarted:true
	            });
            }
        });
		this.timer = setInterval(function(){
		  	seconds++;
		  	var t = moment("1900/01/01 00:00:00").add(seconds, 'seconds').format("HH:mm:ss");
		    self.setState({
				counter:t
			});
		    self.updateTime(date,time);
		}, 1000);

	}
	updateTime(date,time){
		let self = this;
		let dateNow = moment().format("YYYY/MM/DD");
		let timeNow = moment().format("HH:mm:ss");

		let secFrom = moment.duration(time).asSeconds();
		let secNow = moment.duration(timeNow).asSeconds();
		let interval = secNow - secFrom;
		let totalInterval = moment("1900/01/01 00:00:00").add(interval, 'seconds').format("HH:mm:ss");

		Meteor.call("mytime.update",this.state.trxId,dateNow, timeNow, totalInterval,function (err,id) {
            if (err) {
                self.setState({
                	msg: err.reason,
                	msgClass: "err-msg"
                });
            }else{
            	self.fetchMyTime();
            }
        });
	}
	stop(){
        clearInterval(this.timer);
		this.setState({
			hasStarted:false
		});
	}
	fetchMyTime(){
		if(this.selectedProj){
			let mytimes = Mytime.find({"project.value":this.selectedProj.value}, {sort:{dateStarted:-1, timeStarted:-1}}).fetch();
			let totalTimeToday = 0;
			mytimes.map((time)=>{
				totalTimeToday += moment.duration(time.totalTime).asSeconds();
			});
			let totalCounter = moment("1900/01/01 00:00:00").add(totalTimeToday, 'seconds').format("HH:mm:ss");
	        this.setState({ mytimes });
	        this.setState({ counter:totalCounter });
	    }else{
	    	this.setState({ 
	    		mytimes:[], 
	    		counter:"00:00:00" 
	    	});
	    }
	}
	logProjects(project){
		this.setState({
			selproject:project
		});
		this.selectedProj = project;
		this.fetchMyTime();
	}
	renderTimes() {
        if (this.state.mytimes.length === 0) {
            return (
                <div className="item">
                    <p className="item__status-message">No Records Found</p>
                </div>
            );
        }
        return this.state.mytimes.map((mytime) => {
            return (
                <div className="list" key={mytime._id}>
                  <div>
                    <h3 className="list__name">{mytime.project.label} : {mytime.totalTime}</h3>
                    <p className="list__details">
                      <span>Start Time: {mytime.dateStarted} {mytime.timeStarted}</span>
                      <span>End Time: {mytime.dateEnded} {mytime.timeEnded}</span>
                      <span>Total Time: {mytime.totalTime}</span>
                    </p>
                  </div>
                </div>
            );
    	});
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
			          	<h2 className="module-title">Time Tracker</h2>
			          	<div className="div-timer">
				          	{this.state.msg ? <p className={this.state.msgClass}>{this.state.msg}</p> : undefined}
		                	<Select 
		                		name="projects" 
		                		ref="projects" 
		                		value={this.state.selproject}  
		                		options={this.state.projects} 
		                		onChange={this.logProjects.bind(this)} 
		                		placeholder="Select Project"
		                		disabled={this.state.hasStarted}
		                		className="r-select"
		                	/>
		                    <h1 className="lbl-timer">{this.state.counter}</h1>
		                    <button className="button button-wide" id="btnStart" onClick={this.state.hasStarted ? this.stop.bind(this) : this.start.bind(this)}>
		                    	{this.state.hasStarted ? "Stop" : "Start"}
		                    </button> 
		                </div>
		                <div>
			                <FlipMove maintainContainerHeight={true}>
			                    {this.renderTimes()}
			                </FlipMove>
			            </div>
			          </div>
			        </div>
			    </div>
            </div>
        );
    }
}
