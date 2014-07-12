// Listings list
	Meteor.smartPublish("searchStuff", function(keywords, type, category, options){
		check(keywords, String);
		check(type, String);
		check(options, {
			limit: Match.Integer,
			sort: Object
		});

		if(category)
			check(category, String);
		else
			check(category, Boolean);

		var keywords = new RegExp(keywords, "i");
		if(category){
			if(type != "both"){
				var listings = Listings.find({$or:[{title:keywords},{description:keywords},{searchHelper:keywords}],type:type,categorySlug:category}, options);
			} else{
				var listings = Listings.find({$or:[{title:keywords},{description:keywords},{searchHelper:keywords}],categorySlug:category}, options);
			}
		} else {
			if(type != "both")
				var listings = Listings.find({$or:[{title:keywords},{description:keywords},{searchHelper:keywords}],type: type}, options);
			else
				var listings = Listings.find({$or:[{title:keywords},{description:keywords},{searchHelper:keywords}]}, options);
		}

		imageIds = [];
		userIds = [];
		favouriteIds = [];

		listings.map(function(listing){
			imageIds.push(listing.imageObj._id);
			userIds.push(listing.userId);
			favouriteIds.push(listing._id);
		});

		var publications = [listings, Images.find({ _id: { $in: imageIds } }), Meteor.users.find({ _id: { $in: userIds } }, {fields: {profile: 1}}) ];

		if(this.userId){
			publications.push(Favourites.find({ listingId: { $in: favouriteIds }, userId: this.userId }));
		}

		return publications;
	});

// Lisitng page

Meteor.smartPublish("listing", function(id){
	check(id, String);
	var mainListing = Listings.find(id);
	var listing = mainListing.fetch()[0];
	var image = Images.find(listing.imageObj._id);

	var mainUser = Meteor.users.find(listing.userId, { fields: { profile: 1 }});
	var user = mainUser.fetch()[0];
	var userListings = Listings.find({userId: user._id}, { limit: 3 });

	imageIds = [];

	userListings.map(function(listing){
		imageIds.push(listing.imageObj._id);
	});

	var userImages = Images.find({ _id: { $in: imageIds}});
	var favourites = Favourites.find({listingId: listing._id, userId: this.userId});

	return [mainListing, image, mainUser, userListings, userImages, favourites];
});

// Cart / checkout
	Meteor.publish("cart", function(id){
		check(id, String);
		return Carts.find(id);
	});

	Meteor.smartPublish("cartItems", function(id){
		check(id, String);
		var lineItems = LineItems.find({cartId: id});

		var listingIds = [];
		var imageIds = [];

		lineItems.map(function(item){
			listingIds.push(item.listingId);
			imageIds.push(item.imageId);
		});

		return [lineItems, Listings.find({_id: {$in: listingIds}}), Images.find({_id: {$in: imageIds}})];
	});

// General logged in user info terras etc
	Meteor.publish("userData", function () {
		if(this.userId)
		  return Meteor.users.find({_id: this.userId}, {fields: {"terras": 1}});
		else
			this.ready();
	});

// Notifications in header and page
	Meteor.publish("notifications", function(options) {
		if(this.userId){
			var options = options || { sort: { epoch: -1}, limit: 5}
			check(options, {
				limit: Match.Integer,
				sort: Object
			});
		  	return Notifications.find({userId: this.userId}, options);
		} else
			this.ready();
	});

// Dashboard

Meteor.smartPublish("userListings", function(options){
	if(this.userId){
		var options = options || { sort: { epoch: -1}, limit: 3}

		check(options, {
			limit: Match.Integer,
			sort: Object
		});

		var listings = Listings.find({userId: this.userId}, options);
		imageIds = [];

		listings.map(function(listing){
			imageIds.push(listing.imageObj._id);
		});

		return [listings, Images.find({_id: {$in: imageIds}})]
	} else
		this.ready();
});

	Meteor.smartPublish("placedOrders", function(options){
		if(this.userId){
			var options = options || { sort: { epoch: -1 }, limit: 3 }
	    	check(options, {
				limit: Match.Integer,
				sort: Object
			});
			var orders = Orders.find({ fromId: this.userId }, options);
			var userIds = [];
			var imageIds = [];
			orders.map(function(order){
				userIds.push(order.toId);
				imageIds.push(order.imageId);
			});

			return [orders, Meteor.users.find({_id: {$in: userIds}}, {fields: {profile: 1}}), Images.find({_id: {$in: imageIds}})]

		} else
			this.ready();
	});

	Meteor.smartPublish("recievedOrders", function(options){
		if(this.userId){
			var options = options || { sort: { epoch: -1 }, limit: 3 }
	    	check(options, {
				limit: Match.Integer,
				sort: Object
			});
			var orders = Orders.find({ toId: this.userId }, options);
			var userIds = [];
			var imageIds = [];
			orders.map(function(order){
				userIds.push(order.fromId);
				imageIds.push(order.imageId);
			});

			return [orders, Meteor.users.find({_id: {$in: userIds}}, {fields: {profile: 1}}), Images.find({_id: {$in: imageIds}})]

		} else
			this.ready();
	});

// Live page
	Meteor.publish("lives", function(options){
		check(options, {
			limit: Match.Integer,
			sort: Object
		});
		return Lives.find({}, options);
	});

// Order page

	Meteor.smartPublish("order", function(id){

	});

	Meteor.smartPublish("singleUser", function(id, options){
		check(id, String);
		check(options, {
			limit: Match.Integer,
			sort: Object
		});

		var user = Meteor.users.find(id, {fields: { profile: 1}});

		var listings = Listings.find({userId: id});

		var imageIds = [];
		listings.map(function(listing){
			imageIds.push(listing.imageObj._id);
		});

		return [user, listings, Images.find({_id: {$in: imageIds}})]
	});