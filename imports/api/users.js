import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import { Accounts } from 'meteor/accounts-base';
import { Roles } from 'meteor/alanning:roles';

export const validateNewUser = (user) => {
  	const email = user.emails[0].address;

  	new SimpleSchema({
	    email: {
	      	type: String,
	      	regEx: SimpleSchema.RegEx.Email
	    }
  	}).validate({ email })
  	return true;
};
if (Meteor.isServer) {
	Accounts.validateNewUser(validateNewUser);
	Accounts.onCreateUser(function(options, user) {
	   	user.profile = options.profile || {};
	   	user.profile.userType = options.userType;
	    user.profile.name = options.name;
	    user.profile.position = options.position;
	   	user.profile.deleted = options.deleted;
	   	return user;
	});

	Meteor.publish('Users', function () {
   	 	return Meteor.users.find({"profile.userType":"User"});
  	});

	  	
	Meteor.methods({
		"user.addRole"(role){
			if (!this.userId) {
	      		throw new Meteor.Error('Not-authorized');
	    	}
			Roles.addUsersToRoles(this.userId, role);
		},
		'user.create'(id,name,email,password, position){
			const adminRole = Roles.userIsInRole(Meteor.userId(),"Admin");
			if (!this.userId && adminRole) {
	      		throw new Meteor.Error('not-authorized');
	    	}
	    	new SimpleSchema({
			    email: {
			      	type: String,
			      	regEx: SimpleSchema.RegEx.Email
			    },
			    name:{
			    	type:String,
			    	min: 4
			    },
			    position:{
			    	type:String,
			    	min: 4
			    }
	  		}).validate({ 
	  			email:email,
	  			name:name,
	  			position:position
	  		});

			const _id = Accounts.createUser({
			    email, 
			    password,
			    name:name,
			    position:position,
			    userType:"User",
			    deleted:"No"
			}); 
			if(_id){
				Roles.addUsersToRoles(_id, "User");
			}
		},
		'user.update'(id,name,email,password, position,oldEmail){
			const adminRole = Roles.userIsInRole(Meteor.userId(),"Admin");
			if (!this.userId && adminRole) {
	      		throw new Meteor.Error('not-authorized');
	    	}
			Meteor.users.update(
				{_id: id},
				{
					$set: {
						"profile.name": name,
						"profile.position":position
					}
				}
			);
			if(password){
				Accounts.setPassword(id, password);
			}
		}
	});
}