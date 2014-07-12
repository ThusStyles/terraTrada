Template.cart.rendered = function () {
	if(Session.get("cartId")){
		if(LineItems.find({cartId: Session.get("cartId")}).count() > 0){
			return true;
		} else{
			Carts.remove(Session.get("cartId"));
			LineItems.remove({cartId: Session.get("cartId")});
			Session.set("cartId", null);
			return false;
		}
	}
};


Template.cart.helpers({
	cartItems: function(){
		if(Session.get("cartId")){
			return LineItems.find({cartId: Session.get("cartId")});
		} else{
			return false;
		}
	},
	hasCartItems: function(){
		if(Session.get("cartId")){
			if(LineItems.find({cartId: Session.get("cartId")}).count() > 0)
				return true;
		} else{
			return false;
		}
	},
	isCheckout: function(){
		return Router.current().route.name == "checkout";
	}
});

Template.cartItem.helpers({
	listing: function(){
		return Listings.findOne(this.listingId);
	},
	photo: function(){
		var imageId = this.imageId;
		return Images.findOne(imageId);
	},
	photoReady: function(){
		var photo = Images.findOne(this.imageId);
		return photo.isUploaded && photo.hasStored("thumbs");
	},
	product: function(){
		return Listings.findOne(this.listingId).type == "product";
	},
	total: function(){
		var price = Listings.findOne(this.listingId).price
		return this.quantity * price;
	}
});

Template.cartItem.rendered = function(){
	$(".spinner-05").spinner();
}

Template.cartItem.events({
	"click .cart-remove": function(e, t){
		e.preventDefault();
		if(Session.get("cartId")){
			LineItems.remove(t.data._id);
			Carts.update(t.data.cartId, { $inc: {count: -1}});
			if(Carts.findOne(t.data.cartId).count == 0){
				Carts.remove(t.data.cartId);
				Session.set("cartId", null);
			}
			toastr.options = {
							  "closeButton": true,
							  "positionClass": "toast-top-left"
							}
			toastr.success("Removed from cart", "Success");
		}
	},
	"click .update": function(e, t){
		e.preventDefault();
		var quantity = parseInt($('#' + t.data._id).val());

		if(quantity != t.data.quantity){
			// quantity changes
			var listing = Listings.findOne(t.data.listingId);
			if(quantity <= 0){
				toastr.error("You cannot have that quantity", "Error");
				$('#' + t.data._id).val(1);
			} else{
				if(quantity > listing.quantity || listing.type == "service"){
					toastr.options = {
							  "closeButton": true,
							  "positionClass": "toast-top-left"
							}
					toastr.error("You cannot have that quantity", "Error");
					$('#' + t.data._id).val(listing.quantity);
				} else{
					LineItems.update(t.data._id, { $set: { quantity: quantity}});
					toastr.options = {
							  "closeButton": true,
							  "positionClass": "toast-top-left"
							}
					toastr.success("Quantity Updated", "Success");
				}
			}
			
		}
	}
});