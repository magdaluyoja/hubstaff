import { Meteor } from 'meteor/meteor';
import moment from 'moment';
import { Mytime } from '../../../api/timeTracker';

let pdfdoc = "";
let selproject = "";
let projects = [];

export let PDF = function(basedate, myprojects, myselproject){
	projects = myprojects;
	selproject = myselproject;
	renderAll(basedate);
	return pdfdoc;
}
renderAll = function(basedate) {
        const baseDate = moment(basedate).format("YYYY/MM/DD");
        const startDate = moment(baseDate).startOf('week').format("YYYY/MM/DD");
        const endDate = moment(baseDate).endOf('week').format("YYYY/MM/DD");
       	pdfdoc = `<div style='padding:1rem;text-align:center;font-family:Helvetica, Arial, sans-serif;font-size:1.4rem;'>
					<h5>My Weekly Report <br/>from ${startDate} to ${endDate}</h5>
					<table style='border: 1px solid black; width:100%; border-collapse:collapse;'>
		                <thead>
		                    <tr>
		                        <th style='border: 1px solid black;padding:.5rem;'>Project</th>
		                        ${renderHeader(startDate)}
		                        <th style='border: 1px solid black;padding:.5rem;'>Total</th>
		                    </tr>
		                </thead>
		                <tbody>
		                    ${renderBody(startDate)}
		                </tbody>
	            	</table>`;
        
    }
renderHeader = function(startDate){
    let th='';
    for (let i = 0; i < 7; i++) {
        let date = moment(startDate).add(i, 'days').format("YYYY/MM/DD");
        th += `<th style='border: 1px solid black;padding:.5rem;'>${date}</th>`;
    }
    return th;
}
renderBody = function(startDate){
    
    let tr='';
    let totalTime = "";
    let cnt = 1;
    let project = "";
    let projectId = "";
    let projectName = "";
    if(!selproject){
        cnt = projects.length;
        project = projects;
    }else{
        project = selproject.value;
    }
    for(let a = 0; a < cnt; a++){
        let td='';
        let totalTimeWeek = 0;
        for (let i = 0; i < 7; i++) {

            let date = moment(startDate).add(i, 'days').format("YYYY/MM/DD");
            if(cnt > 1){
                projectId = project[a].value;
                projectName = project[a].label;
            }else{
                projectId = project;
                projectName = selproject.label;
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
            td += `<td style='border: 1px solid black;padding:.5rem;' className = ${noTime}>${formatTime(totalTime)}</td>`;    
        }
        let noTime = totalTimeWeek ? null : "no-time";
        tr += `<tr>
        			<td style='border: 1px solid black;padding:.5rem;'>${projectName}</td>
        			${td}
        			<td style='border: 1px solid black;padding:.5rem;' className = ${noTime}>${formatTime(totalTimeWeek)}</td>
        		</tr>`;
    }
    return tr;
}
formatTime = function(time){
    return moment("1900/01/01 00:00:00").add(time, 'seconds').format("HH:mm:ss");
}
renderActivities = function(date, projectId){
    let todaysTime = Mytime.find({dateStarted: date, "project.value":projectId, userId:Meteor.userId()}).fetch();
    return sumUpTime(todaysTime);
}
sumUpTime = function(todaysTime){
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