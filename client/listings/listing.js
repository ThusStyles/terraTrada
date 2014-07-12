Template.listing.helpers({
	photo: function(){
		return Images.findOne(this.imageObj._id);
	},
	photoReady: function(){
		var photo = Images.findOne(this.imageObj._id);
		if(photo){
			return photo.isUploaded && photo.hasStored("mains");
		}
	},
	name: function(){
		return Meteor.users.findOne(this.userId).profile.name;
	},
	product: function(){
		return this.type == "product";
	},
	categoryPath: function(){
		var keyword = Router.current().params.keyword || "all";
        var type = Router.current().params.type || "both";
        var sort = Router.current().params.sortField || "epoch";
        var direction = Router.current().params.diection || -1;
		return Router.routes.listings.path({sortField: sort, direction: direction, listingLimit: 10, keyword: keyword, type: type, category: this.categorySlug});
	},
	favourited: function(){
		return Favourites.findOne({listingId: this._id, userId: Meteor.userId()});
	}
});

Template.listing.events({
	"click .category": function(e, t){
		var keyword = Router.current().params.keyword || "all";
        var type = Router.current().params.type || "both";
        Router.go("listings", {listingLimit: 10, keyword: keyword, type: type, category: this.categorySlug});
		var params = Router.current().params;
	    var category = params.category;
	    if(_.where(serviceCategoriesArray, category ).length > 0 || params.type == "service"){
	        $('#navTabs a:last').tab('show');
	    } else{
	        $('#navTabs a:first').tab('show');
	    }
	}
});

Template.listing.rendered = function(){
	$("img").hide();
	$("img").bind("load", function () { $(this).fadeIn(); });
}