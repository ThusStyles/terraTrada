Template.header.helpers({
	username: function(){
		return Meteor.user().username;
	},
	cartItems: function(){
		var cart = Carts.findOne(Session.get("cartId"));
		

		if(Session.get("cartId") && cart){
			return cart.count;
		} else{
			return 0
		}
	}
});

Template.header.events({
	"click #sign-out": function(e,t){
		e.preventDefault();
		if(Session.get("cartId")){
			var cartId = Session.get("cartId");
		}
		Meteor.logout();
		if(cartId){
			Session.set("cartId", cartId);
		}
		
	},
	"submit .nav-search": function(e, t){
		e.preventDefault();
        Session.set("loading", true);
        var baseVal = $('.search-top').val();
        $('.search-top').val("");
        var type = Router.current().params.type || "both"
        if(baseVal == "" || !baseVal){
            Router.go("listings", { listingLimit: 10, keyword: "all", type: type});
        } else{
        	Session.set("searching", baseVal);
            var val = baseVal.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&");
            Session.set("query", val);
            var limit = parseInt(Router.current().params.listingLimit) || 10;
            Router.go("listings", { listingLimit: 10, keyword: val, type: type});
        	
        }
	}
});