Template.dashboard.rendered = function(){
	Holder.run();
}

Template.allRecievedOrders.rendered = function(){
	Holder.run();
}

Template.allUserListings.helpers({
	hasListings: function(){
		return Listings.find({userId: Meteor.userId()}).count() > 0;
	}
});

Template.allRecievedOrders.helpers({
	hasRecievedOrders: function(){
		return Orders.find({toId: Meteor.userId()}).count() > 0;
	}
});

Template.allPlacedOrders.helpers({
	hasPlacedOrders: function(){
		return Orders.find({fromId: Meteor.userId()}).count() > 0;
	}
});

Template.dashboardNav.events({
	"click .sign-out": function(e, t){
		e.preventDefault();
		if(Session.get("cartId")){
			var cartId = Session.get("cartId");
		}
		Meteor.logout();
		if(cartId){
			Session.set("cartId", cartId);
		}
	}
});
Template.allPlacedOrders.rendered = function(){
	Holder.run();
}

Template.dashboard.helpers({
	listings: function(){
		return Listings.find({userId: Meteor.userId()}, { sort: { epoch: -1 }, limit: 3});
	},
	hasListings: function(){
		return Listings.find({userId: Meteor.userId()}).count() > 0;
	},
	hasMoreListings: function(){
		return Listings.find({userId: Meteor.userId()}).count() > 5;
	},
	hasPlacedOrders: function(){
		return Orders.find({fromId: Meteor.userId()}).count() > 0;
	},
	placedOrders: function(){
		return Orders.find({fromId: Meteor.userId()}, { sort: { epoch: -1 }, limit: 5});
	},
	hasMorePlacedOrders: function(){
		return Orders.find({fromId: Meteor.userId()}).count() > 5;
	},
	hasRecievedOrders: function(){
		return Orders.find({toId: Meteor.userId()}).count() > 0;
	},
	recievedOrders: function(){
		return Orders.find({toId: Meteor.userId()}, { sort: { epoch: -1 }, limit: 5});
	},
	hasMoreRecievedOrders: function(){
		return Orders.find({toId: Meteor.userId()}).count() > 5;
	},
});

Template.recievedOrder.helpers({
	buyer: function(){
		return Meteor.users.findOne(this.fromId, { fields: {profile: 1}});
	},
	photo: function(){
		return Images.findOne(this.imageId);
	},
	photoReady: function(){
		var photo = Images.findOne(this.imageId);
		return photo.isUploaded && photo.hasStored("mains");
	},
	statusClass: function(){
		switch (this.status){
			case "Processing":
				return "label-info"
				break;
			case "Pending":
				return "label-default"
				break;
			case "Completed":
				return "label-success"
				break;
		}
	},
	statusChange: function(){
		switch (this.status){
			case "Processing":
				return "Set Completed"
				break;
			case "Pending":
				return "Set Processing"
				break;
		}
	},
	statusButton: function(){
		switch (this.status){
			case "Processing":
				return "status-completed"
				break;
			case "Pending":
				return "status-processing"
				break;
		}
	},
	notCompleted: function(){
		return this.status != "Completed";
	}
});

Template.placedOrder.helpers({
	seller: function(){
		return Meteor.users.findOne(this.toId, { fields: {profile: 1}});
	},
	photo: function(){
		return Images.findOne(this.imageId);
	},
	photoReady: function(){
		var photo = Images.findOne(this.imageId);
		return photo.isUploaded && photo.hasStored("mains");
	},
	statusClass: function(){
		switch (this.status){
			case "Processing":
				return "label-info"
				break;
			case "Pending":
				return "label-default"
				break;
			case "Completed":
				return "label-success"
				break;
		}
	}
})


Template.userListing.helpers({
	photo: function(){
		return Images.findOne(this.imageObj._id);
	},
	photoReady: function(){
		var photo = Images.findOne(this.imageObj._id);
		return photo.isUploaded && photo.hasStored("mains");
	},
	product: function(){
		return this.type == "product";
	},
	categoryPath: function(){
		return Router.routes.listings.path({sortField: "epoch", direction: -1, listingLimit: 10, keyword: "all", type: "both", category: this.categorySlug})
	}
});

Template.userListing.events({
	"click .delete-listing": function(e, t){
		e.preventDefault();
		if(confirm("Are you sure you want to delete this?")){
			Meteor.call("deleteListing", t.data._id, t.data.imageObj._id, function(err, res){
				if(err){
					toastr.options = {
							  "closeButton": true,
							  "positionClass": "toast-top-left"
							}
					toastr.success("Listing could not be removed", "Error");
				}
				else{
					toastr.success("Listing removed", "Success");
					toastr.options = {
							  "closeButton": true,
							  "positionClass": "toast-top-left"
							}
					Meteor.subscribe("userListings");
				}
			});
		}
	}
});

Template.userListing.rendered = function(){
	$("img").hide();
	$("img").bind("load", function () { $(this).fadeIn(); });
}

Template.recievedOrder.events({
	"click .status-processing": function(e, t){
		if(confirm("Are you sure you want to set this order to Processing?")){
			if(this.status != "Processing"){
				var obj = {
					id: this._id,
					status: "Processing",
					path: Router.routes.order.path({_id: this._id}),
					fromId: this.fromId
				}
				Meteor.call("orderNotification", obj, function(err, res){
					if(!err){
						toastr.options = {
							  "closeButton": true,
							  "positionClass": "toast-top-left"
							}
						toastr.success("Updated to " + obj.status, "Success");
					}
				});
			}
		}
		
	},
	"click .status-completed": function(e, t){
		if(confirm("Are you sure you want to set this order Completed?")){
			if(this.status != "Completed"){
				var obj = {
					id: this._id,
					status: "Completed",
					path: Router.routes.order.path({_id: this._id}),
					fromId: this.fromId
				}
				Meteor.call("orderNotification", obj, function(err, res){
					if(!err){
						toastr.options = {
							  "closeButton": true,
							  "positionClass": "toast-top-left"
							}
						toastr.success("Updated to " + obj.status, "Success");
					}
				});
			}
		}
	}
});