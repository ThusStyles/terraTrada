Orders = new Meteor.Collection("orders");


Orders.deny({
	insert: function(userId, doc){
		return true;
	},
	remove: function(userId, doc){
		return true;
	},
	update: function(userId, doc, fields, modifier){
		return true;
	}
});


Meteor.methods({
	placeOrder: function(cartId){
		check(cartId, String);
		var terras = Meteor.user().terras;
		var cart = Carts.findOne(cartId);
		var line_items = LineItems.find({cartId: cartId}).fetch();
		var userId = Meteor.userId();
		var orderAmount = 0;

		// CHECK TOTAL ORDER AGAINST USER TERRAS
		for(var i = 0; i < line_items.length; i++){
			var listing = Listings.findOne(line_items[i].listingId, { fields: { price: 1, type: 1}});
			if(listing.type == "product"){
				orderAmount += (line_items[i].quantity * listing.price);
			} else{
				orderAmount += listing.price;
			}
			if(listing.userId == Meteor.userId())
				throw new Meteor.Error(422, "You cannot order your own listing, please remove it");
		}

		if(orderAmount > terras)
			throw new Meteor.Error(422, "You don't have enough terras");
		

		// CREATE ORDER LOOP
		for(var i = 0; i < line_items.length; i++){
			var listing = Listings.findOne(line_items[i].listingId);
			var amount = line_items[i].quantity * listing.price;
			var userId = listing.userId;
			var quantity = line_items[i].quantity;
			var sold = line_items[i].quantity;
			if(listing.type == "service"){
				quantity = 0;
				sold = 1;
			}

			Meteor.users.update(userId, { $inc: { terras: Math.abs(amount) }});
			var order = {
				fromId: Meteor.userId(),
				toId: userId,
				epoch: new Date().getTime(),
				totalAmount: amount,
				status: "Processing",
				title: listing.title,
				description: listing.description,
				price: listing.price,
				quantity: line_items[i].quantity,
				type: listing.type,
				imageId: listing.imageObj._id
			}
			var orderId = Orders.insert(order);
			Listings.update(listing._id, { $inc: { quantity: -Math.abs(quantity), sold: Math.abs(sold)}});


			var notification = {
					url: Router.routes.order.path({_id: orderId}),
					userId: userId,
					message: "You have sold " + line_items[i].quantity + " of " + "\"" + listing.title + "\"" +" for T" + amount,
					read: false,
					epoch: new Date().getTime()
				}
			var fromUser = Meteor.user().profile.name;
			var toUser = Meteor.users.findOne(userId).profile.name;
			var message = fromUser + " just ordered " + line_items[i].quantity + " of " + "\"" + listing.title + "\"" + " from " + toUser + " for T" + amount;

			var live = {
				epoch: new Date().getTime(),
				message: message
			}

			//DB
			Lives.insert(live);
			Notifications.insert(notification);		
		}
		
		Meteor.users.update(Meteor.userId(), { $inc: { terras: -Math.abs(orderAmount) } } );
		LineItems.remove({cartId: cartId});
		Carts.remove(cartId);
	}
});