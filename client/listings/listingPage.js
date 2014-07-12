Template.listingPage.rendered = function(){
	$( "#spinner-01" ).spinner();
	$('.description').readmore({
		speed: 1000,
		maxHeight: 100,
		moreLink: "<a href=\"#\">Read More</a>",
		heightMargin: 0
	});
	$("img").hide();
	$("img").bind("load", function () { $(this).fadeIn(); });
	try {
        FB.XFBML.parse();
    }catch(e) {} 
}

Template.listingPage.helpers({
	photo: function(){
		return Images.findOne(this.imageObj._id);
	},
	photoReady: function(){	
		
		var photo = Images.findOne(this.imageObj._id);
		return photo && photo.isUploaded && photo.hasStored("mains");
		
	},
	longDescription: function(){
		return this.description.length > 200;
	},
	name: function(){
		return Meteor.users.findOne(this.userId).profile.name;
	},
	product: function(){
		return this.type == "product"
	},
	url: function(){
		return window.location;
	},
	pinphoto: function(){
		return encodeURIComponent(window.location.protocol + "//" + window.location.host + Images.findOne(this.imageObj._id).url());
	},
	pintitle: function(){
		return encodeURIComponent(this.title + " - " + this.description);
	},
	categoryPath: function(){
		return Router.routes.listings.path({sortField: "epoch", direction: -1, listingLimit: 10, keyword: "all", type: "both", category: this.categorySlug});
	},
	moreFromItems: function(){
		return Listings.find( { userId: this.userId, _id: { $ne: this._id } } );
	},
	hasMore: function(){
		return Listings.find( { userId: this.userId, _id: { $ne: this._id } } ).count() > 0;
	},
	favourited: function(){
		return Favourites.findOne({listingId: this._id, userId: Meteor.userId()});
	}
});

Template.moreFromItem.helpers({
	photo: function(){
		return Images.findOne(this.imageObj._id);
	}
});
Template.listingPage.events({
	"submit #add-to-cart": function(e,t){
		e.preventDefault();
		var product = this.type == "product";
		if(product)
			var quantity = parseInt($("#spinner-01").val());
		else
			var quantity = 1;

		var listingId = t.data._id;

		if(!Session.get("cartId") || !Carts.findOne(Session.get("cartId"))){
				var id = Carts.insert({ count: 0});
				Session.set("cartId", id);
		}
		var cartId = Session.get("cartId");

		var obj = {
			quantity: quantity,
			listingId: listingId,
			cartId: cartId,
			orderId: false,
			product: product
		}

		Meteor.call("addToCart", obj, function(err, res){
			toastr.options = {
							  "closeButton": true,
							  "positionClass": "toast-top-left"
							}
			if(err){
				toastr.error(err.reason, "Error");
			} else{

				toastr.success("Added to cart", "Success");
			}
		});
		
	},
	"click .favourite": function(e, t){
		var favourite = Favourites.findOne({listingId: this._id, userId: Meteor.userId()});
		if(favourite){
			Meteor.call("removeFavourite", this._id, function(err, res){
				if(err){
					toastr.options = {
							  "closeButton": true,
							  "positionClass": "toast-top-left"
							}
					toastr.error(err.reason, "Error");
				}
			});
		} else{
			var listing = {
				listingId: this._id,
				userId: this.userId
			}
			Meteor.call("createFavourite", listing, function(err, res){
				if(err){
					toastr.options = {
							  "closeButton": true,
							  "positionClass": "toast-top-left"
							}
					toastr.error(err.reason, "Error");
				}
			});
		}
	}
});
