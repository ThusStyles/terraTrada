Template.order.helpers({
	userPlaced: function(){
		return this.fromId == Meteor.userId();
	},
	name: function(){
		if(this.fromId == Meteor.userId()){
			return Meteor.users.findOne(this.toId).profile.name;
		} else{
			return Meteor.users.findOne(this.fromId).profile.name;
		}
	}
});

Template.order.events({
	"click .processing": function(e, t){
		if(this.status != "Processing"){
			var obj = {
				id: this._id,
				status: "Processing",
				path: Router.routes.order.path({_id: this._id}),
				fromId: this.fromId
			}
			Meteor.call("orderNotification", obj, function(err, res){
				if(!err){
					toastr.success("Updated to " + obj.status, "Success");
				}
			});
		}
		
	},
	"click .pending": function(e, t){
		if(this.status != "Pending"){
			var obj = {
				id: this._id,
				status: "Pending",
				path: Router.routes.order.path({_id: this._id}),
				fromId: this.fromId
			}
			Meteor.call("orderNotification", obj, function(err, res){
				if(!err){
					toastr.success("Updated to " + obj.status, "Success");
				}
			});
		}
	},
	"click .completed": function(e, t){
		if(this.status != "Completed"){
			var obj = {
				id: this._id,
				status: "Completed",
				path: Router.routes.order.path({_id: this._id}),
				fromId: this.fromId
			}
			Meteor.call("orderNotification", obj, function(err, res){
				if(!err){
					toastr.success("Updated to " + obj.status, "Success");
				}
			});
		}
	}
});