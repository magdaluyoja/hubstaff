import { Meteor } from 'meteor/meteor';
import React from 'react';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import FlipMove from 'react-flip-move';

import { Projects } from '../../../api/projects';
import { Mytime } from '../../../api/timeTracker';

import Links from './../../Links';
import PrivateHeader from './../../PrivateHeader';

import '/node_modules/react-datepicker/dist/react-datepicker.css';

import {PDF} from './PDF';

export default class MyProjectList extends React.Component {
	constructor(){
		super();

        const baseDate = moment().format("YYYY/MM/DD");
        const startDate = moment(baseDate).startOf('week').format("YYYY/MM/DD");
        const endDate = moment(baseDate).endOf('week').format("YYYY/MM/DD");

        this.state ={
            mytimes:[],
            projects:[],
            projectFilter:"",
            dateFilter:"",
            startDate:startDate,
            endDate:endDate,
            filter:"",
            baseDate:moment(baseDate),
        };
	}
    componentDidMount() {
        document.title = "Time Tracker | My Weekly Report";
        this.MyActivities = Tracker.autorun(() => {

            Meteor.subscribe('MyProjects');
            Meteor.subscribe('MyTime');

            let projects = Projects.find({}).fetch();
            projects = projects.map(function (item,index) {
                var project = {value:item._id,label:item.name};
                return project;
            })
            this.setState({ projects });
            let iniVal = projects[0];
            this.setState({
                selproject: iniVal
            });
        });
        
    }
    componentWillUnmount() {
        this.MyActivities.stop();
    }
    renderAll() {
        const baseDate = moment(this.state.baseDate._d).format("YYYY/MM/DD");
        const startDate = moment(baseDate).startOf('week').format("YYYY/MM/DD");
        const endDate = moment(baseDate).endOf('week').format("YYYY/MM/DD");
        return (
            <table>
                <thead>
                    <tr>
                        <td>Project</td>{this.renderHeader(startDate)}<td>Total</td>
                    </tr>
                </thead>
                <tbody>
                    {this.renderBody(startDate)}
                </tbody>
            </table>
        )
    }
    renderHeader(startDate){
        const th=[];
        for (let i = 0; i < 7; i++) {
            let date = moment(startDate).add(i, 'days').format("ddd,MMM DD");
            th.push(<td key={i}>{date}</td>);
        }
        return th;
    }
    renderBody(startDate){
        
        let tr=[];
        let totalTime = "";
        let cnt = 1;
        let project = "";
        let projectId = "";
        let projectName = "";
        if(!this.state.selproject){
            cnt = this.state.projects.length;
            project = this.state.projects;
        }else{
            project = this.state.selproject.value;
        }
        for(let a = 0; a < cnt; a++){
            let td=[];
            let totalTimeWeek = 0;
            for (let i = 0; i < 7; i++) {

                let date = moment(startDate).add(i, 'days').format("YYYY/MM/DD");
                if(cnt > 1){
                    projectId = project[a].value;
                    projectName = project[a].label;
                }else{
                    projectId = project;
                    projectName = this.state.selproject.label;
                }
                let total = this.renderActivities(date, projectId);  
                if(total){
                    if(total.length > 0){
                        totalTime = total[0].totalTime;
                        totalTimeWeek +=totalTime;
                    }else{
                        totalTime = "";
                    }
                }else{
                    totalTime = "";
                }
                let noTime = totalTime ? null : "no-time";
                td.push(<td key={date+projectId+i} className = {noTime}>{this.formatTime(totalTime)}</td>);    
            }
            let noTime = totalTimeWeek ? null : "no-time";
            tr.push(<tr key={tr+a}><td>{projectName}</td>{td}<td className = {noTime}>{this.formatTime(totalTimeWeek)}</td></tr>);
        }
        return tr;
    }
    formatTime(time){
        return moment("1900/01/01 00:00:00").add(time, 'seconds').format("HH:mm:ss");
    }
    renderActivities(date, projectId){
        let todaysTime = Mytime.find({dateStarted: date, "project.value":projectId, userId:Meteor.userId()}).fetch();
        return this.sumUpTime(todaysTime);
    }
    sumUpTime(todaysTime){
        var result = [];
        todaysTime.forEach(function (a) {
            let seconds = moment.duration(a.totalTime).asSeconds();
            let tot = 0;
            if (!this[a.dateStarted+a.userId+a.project.value]) {
                this[a.dateStarted+a.userId+a.project.value] = { 
                    _id:a._id,
                    totalTime: 0 
                };
                result.push(this[a.dateStarted+a.userId+a.project.value]);
            }
            
            this[a.dateStarted+a.userId+a.project.value].totalTime += seconds;
        }, Object.create(null));
        return result;
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
            baseDate: date
        });
        if(date){
            const startDate = moment(date._d).startOf('week').format("YYYY/MM/DD");
            this.setState({
                dateFilter: startDate
            });
        }else{
            this.setState({
                dateFilter:""
            });
        }
    }
    getPDF(){
        Meteor.pdf.save(PDF(this.state.baseDate._d, this.state.projects, this.state.selproject), 'My Weekly Report from to ');
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
                    <h2 className="module-title">Weekly Report</h2>

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
                            selected={this.state.baseDate}
                            onChange={this.handleChange.bind(this)}
                            placeholderText="Date"
                        />
                    </div>

                    <FlipMove maintainContainerHeight={true}>
                        <div className="tbl-container">
                            {this.renderAll()}
                        </div>
                    </FlipMove>
                    <button className="button button-wide" onClick={this.getPDF.bind(this)}>Download PDF</button>
                  </div>
                </div>
              </div>
            </div>
        );
    }
};