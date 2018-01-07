import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import moment from 'moment';
import SimpleSchema from 'simpl-schema';

export const Mytime = new Mongo.Collection('mytime');

if (Meteor.isServer) {
  	Meteor.publish('MyTimeToday', function () {
  		let date = moment().format("YYYY/MM/DD");
   	 	return Mytime.find({
   	 		$and: [
			    { userId:this.userId},
			    { dateStarted: date }
			]
		});
  	});
  	Meteor.publish('MyTime', function () {
   	 	return Mytime.find({userId:this.userId});
  	});
  	Meteor.publish('AllTime', function () {
   	 	return Mytime.find({});
  	});

  	Meteor.methods({
		'mytime.create'(projectId,dateStarted,timeStarted,totalTime){
			if (!this.userId) {
	      		throw new Meteor.Error('not-authorized');
	    	}
			return Mytime.insert({
				    userId:this.userId,
				    project:projectId,
				    dateStarted:dateStarted,
				    timeStarted:timeStarted,
				    totalTime:totalTime
			}); 
		},
		'mytime.update'(id, dateEnded, timeEnded, totalTime){
			if (!this.userId) {
	      		throw new Meteor.Error('not-authorized');
	    	}
			Mytime.update(
				{_id: id},
				{
					$set: {
						dateEnded:dateEnded,
						timeEnded:timeEnded,
					    totalTime:totalTime,
					}
				}
			);
		}
	});
}
