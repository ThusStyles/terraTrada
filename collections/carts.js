Carts = new Meteor.Collection("carts");

Carts.allow({
	insert: function(userId, doc){
		return true;
	},
	remove: function(userId, doc){
		return true;
	},
	update: function(userId, doc, fields, modifier){
		var allowed = ["count"];
		  if (_.difference(fields, allowed).length)
		    return false; // tried to write to forbidden field
		return true;
	}
})