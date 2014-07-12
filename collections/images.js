if(Meteor.isClient){

imageStore = new FS.Store.S3("mains");

thumbStore = new FS.Store.S3("thumbs");

Images = new FS.Collection("mains", {
  stores: [imageStore, thumbStore]
});

Images.allow({
	insert: function(userId, doc){
		if(userId)
			return true
		return false;
	},
	download: function(userId, doc){
		return true;
	},
	update: function(userId, doc){
		return true;
	}
});

Images.deny({
	insert: function(userId, doc){
		if(userId != doc.userId)
			return true
		return false;
	},
	update: function(userId, doc, fields, modifier){
		return false;
	},
	remove: function(userId, doc){
		return true;
	},
});
}