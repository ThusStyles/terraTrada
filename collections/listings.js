Listings = new Meteor.Collection("listings");

Listings.allow({
	update: ownsDocument,
	remove: ownsDocument
});

Listings.deny({
	update: function (userId, doc, fields, modifier) {
		return( _.without(fields, 'title', 'description', 'price', "quantity", "imageObj", "categorySlug", "categoryTitle", "overviewPoints").length > 0);
	}
});

Meteor.methods({
	createListing: function(listing){
		check(listing, {
			title: String,
			description: String,
			price: Match.Integer,
			quantity: Match.Integer,
			categorySlug: String,
			categoryTitle: String,
			imageObj: Match.Any,
			type: String,
			overviewPoints: [String]
		});

		_.each(listing.overviewPoints, function(point){
			if(point.length == 0)
				throw new Meteor.Error(422, 'Please fill in all the overview points');
			else if(point.length > 25)
				throw new Meteor.Error(422, 'Max length for each overview point is 25 characters');
		});

		var user = Meteor.user();

		if(listing.type == "product"){
			var cats = productCategories;
		} else{
			var cats = serviceCategories;
		}

		var notValidCategory = (_.where(cats, {title: listing.categoryTitle}).length == 0) || (_.where(cats, {url: listing.categorySlug}).length == 0)

		if(notValidCategory)
			throw new Meteor.Error(422, 'Must be a valid category');

		if(!parseInt(listing.quantity) || parseInt(listing.quantity) <= 0 )
			throw new Meteor.Error(422, 'Amount must be a positive integer');

		if(!listing.title)
			throw new Meteor.Error(422, 'You must provide a title');
		
		if(!listing.quantity)
			throw new Meteor.Error(422, 'You must provide a quantity');
		
		if(!listing.description)
			throw new Meteor.Error(422, "You must provide a description");

		if(!listing.price)
			throw new Meteor.Error(422, "You must provide a price");

		var listing = _.extend(_.pick(listing, "overviewPoints", "title", "description", "price", "type", "imageObj", "quantity", "categoryTitle", "categorySlug"), {
			userId: user._id,
			epoch: new Date().getTime(),
			sold: 0,
			searchHelper: "all",
			lowerTitle: listing.title.toLowerCase()
		});

		var listingId = Listings.insert(listing);
		return listingId;
	},
	updateListing: function(listing){
		if(listing.imageObj){
			check(listing, {
				listingId: String,
				title: String,
				description: String,
				price: Match.Integer,
				quantity: Match.Integer,
				categorySlug: String,
				categoryTitle: String,
				imageObj: Match.Any,
				type: String,
				overviewPoints: [String]
			});
		} else {
			check(listing, {
				listingId: String,
				title: String,
				description: String,
				price: Match.Integer,
				quantity: Match.Integer,
				categorySlug: String,
				categoryTitle: String,
				type: String,
				overviewPoints: [String]
			});
		}

		if(listing.type == "product"){
			var cats = productCategories;
		} else{
			var cats = serviceCategories;
		}

		var notValidCategory = (_.where(cats, {title: listing.categoryTitle}).length == 0) || (_.where(cats, {url: listing.categorySlug}).length == 0)

		if(notValidCategory)
			throw new Meteor.Error(422, 'Must be a valid category');

		if(!parseInt(listing.quantity) || parseInt(listing.quantity) <= 0 )
			throw new Meteor.Error(422, 'Amount must be a positive integer');

		if(!listing.title)
			throw new Meteor.Error(422, 'You must provide a title');
		
		if(!listing.quantity)
			throw new Meteor.Error(422, 'You must provide a quantity');
		
		if(!listing.description)
			throw new Meteor.Error(422, "You must provide a description");

		if(!listing.price)
			throw new Meteor.Error(422, "You must provide a price");

		if(listing.imageId){
			Images.remove(listing.imageId);
			LineItems.update({listingId: listingId}, { $set: { imageId: listing.imageId}}, {multi: true});
			var listingObj = _.pick(listing, "title", "description", "price", "imageObj", "quantity", "categorySlug", "categoryTitle");
		} else{
			var listingObj = _.pick(listing, "title", "description", "price", "quantity", "categorySlug", "categoryTitle");
		}


		var listingId = Listings.update(listing.listingId, { $set: listingObj });
		return listingId;
	},
	deleteListing: function(id, imageId){
		check(id, String);
		check(imageId, String);
		Listings.remove(id);
		Images.remove(imageId);
		LineItems.remove({listingId: id});

	}
});