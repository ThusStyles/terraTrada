LineItems = new Meteor.Collection("line_items");

LineItems.allow({
	insert: function(userId, doc){
		return true;
	},
	update: function(userId, doc, fields, modifier){
		var allowed = ["quantity"];
		  if (_.difference(fields, allowed).length)
		    return false; // tried to write to forbidden field
		return true;
	},
	remove: function(userId, doc){
		return false;
	}
});


Meteor.methods({
	addToCart: function(obj){
		check(obj, {
			cartId: String,
			listingId: String,
			quantity: Match.Integer,
			product: Boolean,
			orderId: Boolean
		});
		var listing = Listings.findOne(obj.listingId);
		var cartId = obj.cartId;
		var listingQuantity = listing.quantity;
		
		var quantity = obj.quantity;

		if(!obj.product)
			listingQuantity = 1;
		
		
		var listingId = obj.listingId;

		if(listing.userId == Meteor.userId())
			throw new Meteor.Error(422, 'You cannot add your own listing to your cart');
		
		if(listing.quantity == 0)
			throw new Meteor.Error(422, 'There are none left');

		if(quantity > listingQuantity)
			throw new Meteor.Error(422, 'You cannot add that many to your cart');
			
		var lineItem = LineItems.findOne({ cartId: cartId, listingId: listingId });
		if(lineItem){
			//in cart
			var cartQuantity = lineItem.quantity;
			if ( (cartQuantity + obj.quantity) > listing.quantity || listing.type == "service")
				throw new Meteor.Error(422, 'You cannot add that many to your cart');

			LineItems.update({ cartId: cartId, listingId: listingId}, { $inc: { quantity: quantity}});			
		} else{
			// not in cart
			lineItem = {
				cartId: cartId,
				listingId: listingId,
				quantity: quantity,
				imageId: listing.imageObj._id
			}
			LineItems.insert(lineItem);
			Carts.update(cartId, { $inc: { count: 1 }});
		}
	}
});