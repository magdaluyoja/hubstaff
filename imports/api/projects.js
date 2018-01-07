import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

export const Projects = new Mongo.Collection('projects');

if (Meteor.isServer) {
  	Meteor.publish('Projects', function () {
   	 	return Projects.find({});
  	});
  	Meteor.publish('MyProjects', function () {
   	 	return Projects.find({
	   	 	$or: [
			    { "managers.value": this.userId},
			    { "members.value": this.userId},
			    { "observers.value": this.userId}
			]
		});
  	});
  	
  	Meteor.methods({
		'project.create'(id,name, managers, members, observers){
			const adminRole = Roles.userIsInRole(Meteor.userId(),"Admin");
			if (!this.userId && adminRole) {
	      		throw new Meteor.Error('Not-authorized');
	    	}
			Projects.insert({
			    name:name,
			    managers:managers,
			    members:members,
			    observers:observers
			}); 
		},
		'project.update'(id,name, managers, members, observers){
			const adminRole = Roles.userIsInRole(Meteor.userId(),"Admin");
			if (!this.userId && adminRole) {
	      		throw new Meteor.Error('not-authorized');
	    	}
			Projects.update(
				{_id: id},
				{
					$set: {
						name:name,
					    managers:managers,
					    members:members,
					    observers:observers
					}
				}
			);
		}
	});
}

