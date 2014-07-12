Favourites = new Meteor.Collection("favourites");

Meteor.methods({
	createFavourite: function(listing){
		check(listing, {
			listingId: String,
			userId: String
		});
		var userId = Meteor.userId();
		var currentFavourite = Favourites.findOne({listingId: listing.listingId, userId: userId})
		if(!userId)
			throw new Meteor.Error(422, 'You must be logged in to favourite');

		if(userId == listing.userId)
			throw new Meteor.Error(422, 'You cannot favourite your own listing');

		if(currentFavourite)
			throw new Meteor.Error(422, 'You cannot favourite a listing more than once');

		var favourite = {
			listingId: listing.listingId,
			userId: userId
		}
		return Favourites.insert(favourite);
	},
	removeFavourite: function(listingId){
		check(listingId, String);

		var userId = Meteor.userId();
		if(!userId)
			throw new Meteor.Error(422, 'You must be logged in to remove a favourite');

		return Favourites.remove({listingId: listingId, userId: userId});
	}
})