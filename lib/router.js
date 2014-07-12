var subs = new SubsManager({
    // maximum number of cache subscriptions
    cacheLimit: 10,
    // any subscription will be expire after 5 minute, if it's not subscribed again
    expireIn: 5
});

SearchController = FastRender.RouteController.extend({
	fastRender: true,
	template: 'listings',
	increment: 10,
	limit: function(){
		return parseInt(this.params.listingLimit) || this.increment;
	},
	sortStuff: function(){
		return this.params.sortField ||"epoch";
	},
	direction: function(){
		return parseInt(this.params.direction) || -1;
	},
	searchTerm: function(){
		if(Session.get("query"))
			return Session.get("query").replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&")
		else
			return "all"
	},
	category: function(){
		return this.params.category || false;
	},
	type: function(){
		return this.params.type || "both";
	},
	findOptions: function(){
		if(this.sortStuff() == "epoch")
			return {sort: {epoch: this.direction()}, limit: this.limit() };
		else if(this.sortStuff() == "title")
			return {sort: {lowerTitle: this.direction()}, limit: this.limit() };
		else
			return {sort: {price: this.direction()}, limit: this.limit() };
	},
	waitOn: function(){
		if(Meteor.isClient){
			return Meteor.subscribe('searchStuff', this.searchTerm(), this.type(), this.category(), this.findOptions(), function(){
				return Session.set("loading", false);
			});
		} else
			return;
	},
	listings: function(){
		return Listings.find({}, this.findOptions(),{reactive: false});
	},
	data: function(){
		var hasMore = this.listings().count() === this.limit();
		return {
			listings: this.listings(),
			nextPath: hasMore ? this.nextPath() : null
		};
	},
	nextPath: function(){
		if(this.category())
			return Router.routes.listings.path({sortField: this.sortStuff(), direction: this.direction(), listingLimit: this.limit() + this.increment, keyword: this.searchTerm(), type: this.type(), category: this.category()});
		else
			return Router.routes.listings.path({sortField: this.sortStuff(), direction: this.direction(), listingLimit: this.limit() + this.increment, keyword: this.searchTerm(), type: this.type()});
	},
	onBeforeAction: function(){
		if (!this.params.keyword || (this.params.keyword == "all" && this.params.listingLimit == 10)) {
			Session.set("loading", true);
		};
		if(this.params.keyword == "all" || !this.params.keyword){
			Session.set("searching", false);
			Session.set("query", null);
		}
	},
	onAfterAction: function(){
		Session.set("loading", false);
		if(!Meteor.isClient)
			return;
		SEO.set({
	        title: "Listings - TerraTrada",
	        meta: {
	          'description': "User listings on TerraTrada, browse a range of products and services"
	        },
	        og: {
	          'title': "Listings - TerraTrada",
	          'description': "User listings on TerraTrada, browse a range of products and services",
	        },
	        twitter: {
	        	"card": "summary",
	        	"title": "Listings - TerraTrada",
	        	"description": "User listings on TerraTrada, browse a range of products and services",
	        }
	 	});	
	}
});

ProfileController = FastRender.RouteController.extend({
	template: 'profile',
	increment: 5,

	limit: function(){
		return parseInt(this.params.listingLimit) || this.increment;
	},
	findOptions: function(){
		return {sort: {epoch: -1, _id: -1}, limit: this.limit() };
	},
	waitOn: function(){
		return Meteor.subscribe('singleUser', this.params._id, this.findOptions());
	},
	listings: function(){
		return Listings.find({userId: this.params._id}, this.findOptions());
	},
	user: function(){
		return Meteor.users.findOne(this.params._id, {fields: {profile: 1}})
	},
	data: function(){
		var hasMore = this.listings().count() === this.limit();
		return {
			user: this.user(),
			listings: this.listings(),
			nextPath: hasMore ? this.nextPath() : null
		};
	},
	nextPath: function(){
		return Router.routes.profile.path({listingLimit: this.limit() + this.increment, _id: this.params._id});
	},
	onAfterAction: function(){
		if(!Meteor.isClient)
			return;
		var name = Meteor.users.findOne(this.params._id).profile.name;
		if(name.slice(-1) == "s")
			var end = '\'';
		else
			var end = '\'s';
		SEO.set({
	        title: name + end + " profile - TerraTrada",
	        meta: {
	          'description': name + end + " profile on TerraTrada",
	        },
	        og: {
	          'title': name + end + " profile - TerraTrada",
	          'description': name + end + " profile on TerraTrada",
	        },
	        twitter: {
	        	"card": "summary",
	        	"title": name + end + " profile - TerraTrada",
	        	"description": name + end + " profile on TerraTrada",
	        }
	    });
	}
});

allPlacedOrdersController = FastRender.RouteController.extend({
	template: 'allPlacedOrders',
	increment: 5,

	limit: function(){
		return parseInt(this.params.orderLimit) || this.increment;
	},
	findOptions: function(){
		return {sort: {epoch: -1, _id: -1}, limit: this.limit() };
	},
	waitOn: function(){
		return Meteor.subscribe('placedOrders', this.findOptions());
	},
	orders: function(){
		return Orders.find({fromId: Meteor.userId()}, this.findOptions());
	},
	data: function(){
		var hasMore = this.orders().count() === this.limit();
		return {
			orders: this.orders(),
			nextPath: hasMore ? this.nextPath() : null
		};
	},
	nextPath: function(){
		return Router.routes.allPlacedOrders.path({orderLimit: this.limit() + this.increment});
	},
	onAfterAction: function(){
		SEO.set({
	        title: "All placed orders - TerraTrada",
	        meta: {
	          'description': "All placed orders on TerraTrada",
	        },
	        og: {
	          'title': "All placed orders - TerraTrada",
	          'description': "All placed orders on TerraTrada",
	        },
	        twitter: {
	        	"card": "summary",
	        	"title": "All placed orders - TerraTrada",
	        	"description": "All placed orders on TerraTrada",
	        }
	    });
	}
});

allRecievedOrdersController = FastRender.RouteController.extend({
	template: 'allRecievedOrders',
	increment: 5,

	limit: function(){
		return parseInt(this.params.orderLimit) || this.increment;
	},
	findOptions: function(){
		return {sort: {epoch: -1, _id: -1}, limit: this.limit() };
	},
	waitOn: function(){
		return Meteor.subscribe('recievedOrders', this.findOptions());
	},
	orders: function(){
		return Orders.find({toId: Meteor.userId()}, this.findOptions());
	},
	data: function(){
		var hasMore = this.orders().count() === this.limit();
		return {
			orders: this.orders(),
			nextPath: hasMore ? this.nextPath() : null
		};
	},
	nextPath: function(){
		return Router.routes.allRecievedOrders.path({orderLimit: this.limit() + this.increment});
	},
	onAfterAction: function(){
		SEO.set({
	        title: "All placed orders - TerraTrada",
	        meta: {
	          'description': "All placed orders on TerraTrada",
	        },
	        og: {
	          'title': "All placed orders - TerraTrada",
	          'description': "All placed orders on TerraTrada",
	        },
	        twitter: {
	        	"card": "summary",
	        	"title": "All placed orders - TerraTrada",
	        	"description": "All placed orders on TerraTrada",
	        }
	    });
	}
});

allUserListingsController = RouteController.extend({
	template: 'allUserListings',
	increment: 5,

	limit: function(){
		return parseInt(this.params.listingLimit) || this.increment;
	},
	findOptions: function(){
		return {sort: {epoch: -1, _id: -1}, limit: this.limit() };
	},
	waitOn: function(){
		return Meteor.subscribe('userListings', this.findOptions());
	},
	listings: function(){
		return Listings.find({userId: Meteor.userId()}, this.findOptions());
	},
	data: function(){
		var hasMore = this.listings().count() === this.limit();
		return {
			listings: this.listings(),
			nextPath: hasMore ? this.nextPath() : null
		};
	},
	nextPath: function(){
		return Router.routes.allUserListings.path({listingLimit: this.limit() + this.increment});
	},
	onAfterAction: function(){
		if(!Meteor.isClient)
			return;
		SEO.set({
	        title: "All your listings - TerraTrada",
	        meta: {
	          'description': "All your listings on TerraTrada",
	        },
	        og: {
	          'title': "All your listings - TerraTrada",
	          'description': "All your listings on TerraTrada",
	        },
	        twitter: {
	        	"card": "summary",
	        	"title": "All your listings - TerraTrada",
	        	"description": "All your listings on TerraTrada",
	        }
	    });
	}
});

LivesController = FastRender.RouteController.extend({
	template: 'lives',
	increment: 5,

	limit: function(){
		return parseInt(this.params.livesLimit) || this.increment;
	},
	findOptions: function(){
		return {sort: {epoch: -1, _id: -1}, limit: this.limit() };
	},
	waitOn: function(){
		return subs.subscribe('lives', this.findOptions());
	},
	lives: function(){
		return Lives.find({}, this.findOptions());
	},
	data: function(){
		var hasMore = this.lives().count() === this.limit();
		return {
			lives: this.lives(),
			nextPath: hasMore ? this.nextPath() : null
		};
	},
	nextPath: function(){
		return Router.routes.lives.path({livesLimit: this.limit() + this.increment});
	},
	onAfterAction: function(){
		if(!Meteor.isClient)
			return;
		SEO.set({
	        title: "Live Updates - TerraTrada",
	        meta: {
	          'description': "Live updates on TerraTrada"
	        },
	        og: {
	          'title': "TerraTrada Live Updates",
	          'description': "Live updates on TerraTrada",
	        },
	        twitter: {
	        	"card": "summary",
	        	"title": "TerraTrada Live Updates",
	        	"description": "Live updates on TerraTrada",
	        }
	     });
	}
});

NotificationsController = FastRender.RouteController.extend({
	template: 'allNotifications',
	increment: 5,

	limit: function(){
		return parseInt(this.params.notificationLimit) || this.increment;
	},
	findOptions: function(){
		return {sort: {epoch: -1, _id: -1}, limit: this.limit() };
	},
	waitOn: function(){
		return subs.subscribe('notifications', this.findOptions());
	},
	notifications: function(){
		return Notifications.find({userId: Meteor.userId()}, this.findOptions());
	},
	data: function(){
		var hasMore = this.notifications().count() === this.limit();
		return {
			notifications: this.notifications(),
			nextPath: hasMore ? this.nextPath() : null
		};
	},
	nextPath: function(){
		return Router.routes.allNotifications.path({notificationLimit: this.limit() + this.increment});
	},
	onAfterAction: function(){
		if(!Meteor.isClient)
			return;
		SEO.set({
	        title: "Notifications - TerraTrada",
	        meta: {
	          'description': "Notifications on TerraTrada"
	        },
	        og: {
	          'title': "TerraTrada Notifications",
	          'description': "Notifications on TerraTrada",
	        },
	        twitter: {
	        	"card": "summary",
	        	"title": "TerraTrada Notifications",
	        	"description": "Notifications on TerraTrada",
	        }
	     });
	}
});

Router.configure({
	layoutTemplate: "layout",
	loadingTemplate: "loading",
	notFoundTemplate: "notFound",
	waitOn: function(){
		var subscriptions = [subs.subscribe('userData'), Meteor.subscribe("notifications")];
		if (Meteor.isClient) {
			if(Session.get("cartId"))
			subscriptions.push( Meteor.subscribe("cart", Session.get("cartId")) );
		};
		return subscriptions;
		
	}
});

Router.map(function(){
	this.route("listings", {
		path: '/listings/:keyword?/:type?/:listingLimit?/:sortField?/:direction?/:category?',
		controller: SearchController
	});

	this.route("loginSignup", {
		path: "/login/:token?",
		onAfterAction: function(){
			if (this.params.token) {
		    	Session.set('resetPassword', this.params.token);
			} 
		},
		onAfterAction: function(){
			if(!Meteor.isClient)
				return;
			SEO.set({
		        title: "Login and Sign Up - TerraTrada",
		        meta: {
		          'description': "Login and Sign Up to TerraTrada"
		        },
		        og: {
		          'title': "Login and Sign Up - TerraTrada",
		          'description': "Login and Sign Up to TerraTrada",
		        },
		        twitter: {
		        	"card": "summary",
		        	"title": "Login and Sign Up - TerraTrada",
		        	"description": "Login and Sign Up to TerraTrada",
		        }
		     });
		}
	});

	this.route("verifyEmail", {
		path: "/verify-email/:token?",
		onAfterAction: function(){
			if (this.params.token) {
				Session.set('verifyToken', this.params.token);
			}
			SEO.set({
		        title: "Verify Email - TerraTrada",
		     });
		}
	});

	this.route("dashboard", {
		path: "/dashboard",
		waitOn: function(){
			return [Meteor.subscribe("userListings"), Meteor.subscribe("recievedOrders"), Meteor.subscribe("placedOrders")];
		},
		onAfterAction: function(){
			if(!Meteor.isClient)
				return;
			SEO.set({
		        title: "Dashboard - TerraTrada",
		     });
		},
		fastRender: true,
	});

	this.route("lives", {
		path: "/live/:livesLimit?",
		controller: LivesController
	});

	this.route("profile", {
		path: "/profile/:_id/:listingLimit?",
		controller: ProfileController
	});

	this.route("allUserListings", {
		path: '/dashboard/listings/:listingLimit?',
		controller: allUserListingsController
	});

	this.route("allPlacedOrders",{
		path: '/dashboard/placed/:orderLimit?',
		controller: allPlacedOrdersController
	});

	this.route("allRecievedOrders",{
		path: '/dashboard/recieved/:orderLimit?',
		controller: allRecievedOrdersController
	});

	this.route("newProductListing", {
		fastRender: true,
		path: "product/new",
		onAfterAction: function(){
			if(!Meteor.isClient)
				return;
			SEO.set({
		        title: "New Listing - TerraTrada",
		     });
		}
	});

	this.route("newServiceListing", {
		fastRender: true,
		path: "service/new",
		onAfterAction: function(){
			if(!Meteor.isClient)
				return;
			SEO.set({
		        title: "New Listing - TerraTrada",
		     });
		}
	});

	this.route("listingPage", {
		fastRender: true,
		path: "/listing/:_id",
		data: function(){
			return Listings.findOne(this.params._id);
		},
		waitOn: function(){
			return Meteor.subscribe("listing", this.params._id);
		},
		onAfterAction: function(){
			if(!Meteor.isClient)
				return;
			var listing = this.data();
			var image = Images.findOne(listing.imageObj._id);
			if(image && listing){
				SEO.set({
			        title: listing.title + " - TerraTrada",
			        meta: {
			          'description': listing.description
			        },
			        og: {
			          'title': listing.title + " on TerraTrada",
			          'description': listing.description,
			          'url': window.location,
			          'image': "test",
			          'type': "website"
			        },
			        twitter: {
			        	"card": "summary",
			        	"title": listing.title + " on TerraTrada",
			        	"description": listing.description,
			        	"image": window.location.protocol + "//" + window.location.host + image.url()
			        }
		    	});
			}
			
		}
	});

	this.route("editListing", {
		fastRender: true,
		path: "/edit/:_id",
		data: function(){
			return Listings.findOne(this.params._id);
		},
		waitOn: function(){
			return subs.subscribe("listing", this.params._id);
		},
		onAfterAction: function(){
			if(!Meteor.isClient)
				return;
			SEO.set({
		        title: "Edit Listing - TerraTrada",
		    });
		}
	});

	this.route("order", {
		fastRender: true,
		path: "/order/:_id",
		data: function(){
			return Orders.findOne(this.params._id);
		},
		waitOn: function(){
			return subs.subscribe("order", this.params._id);
		},
		onAfterAction: function(){
			if(!Meteor.isClient)
				return;
			SEO.set({
		        title: "View Order - TerraTrada",
		     });
		}
	});

	this.route("cart", {
		fastRender: true,
		path: "/cart",
		waitOn: function(){
			if(Meteor.isClient){
				var cart = Carts.findOne(Session.get("cartId"))
				if(Session.get("cartId") && cart){
					var cartId = Session.get("cartId");
					return Meteor.subscribe("cartItems", cartId);
				}
			}
		},
		onAfterAction: function(){
			if(!Meteor.isClient)
				return;
			SEO.set({
		        title: "Your Cart - TerraTrada",
		     });
		}
	});

	this.route("checkout", {
		fastRender: true,
		path: "/checkout",
		waitOn: function(){
			if(Meteor.isClient){
				var cart = Carts.findOne(Session.get("cartId"));
				if(Session.get("cartId") && cart){
					var cartId = Session.get("cartId");
					return Meteor.subscribe("cartItems", cartId);
				}
			}
		},
		onAfterAction: function(){
			if(!Meteor.isClient)
				return;
			SEO.set({
		        title: "Your Checkout - TerraTrada",
		     });
		}
	});

	this.route("allNotifications", {
		path: "/notifications/:notificationLimit?",
		controller: NotificationsController
	});

	this.route("home", {
		fastRender: true,
		path: "/:_id?",
		onAfterAction: function(){
			if(!Meteor.isClient)
				return;
			if (this.params._id) {
		    	Session.set('referralId', this.params._id);
			}
			SEO.set({
		        title: "TerraTrada - Trading Platform",
		        meta: {
		          'description': "TerraTrada is a unique trading platform with it\'s own currency, the Terra, Sign Up now and get 50 free terras in your account"
		        },
		        og: {
		          'title': "TerraTrada - Trading Platform",
		          'description': "TerraTrada is a unique trading platform with it\'s own currency, the Terra, Sign Up now and get 50 free terras in your account",
		        },
		        twitter: {
		        	"card": "summary",
		        	"title": "TerraTrada - Trading Platform",
		          'description': "TerraTrada is a unique trading platform with it\'s own currency, the Terra, Sign Up now and get 50 free terras in your account"
		        }
		     });
		}
	});
});

var redirectIfLogged = function(pause){
	if(Meteor.user()){
		Router.go("dashboard");
		pause();
	}
	
}

var requireLogin = function(pause){
	if(!(Meteor.user() || Meteor.loggingIn())){
		Router.go("loginSignup");
		pause();
	}
}


var checkCartItems = function(){
	var line_items = LineItems.find({cartId: Session.get("cartId")});
	if(!line_items || line_items.count() == 0){
		Router.go("cart");
	}
	
}

var removeForgotSession = function(){
	if(Meteor.isClient && Router.current().route.name != "loginSignup"){
		if(Session.get("showResetForm")){
			Session.set("showResetForm", null);
		}
	}
}

Router.onBeforeAction(requireLogin, {only: required});
Router.onBeforeAction(redirectIfLogged, {only: ["loginSignup", "home"]});
Router.onBeforeAction(checkCartItems, {only: ["checkout"]});
Router.onBeforeAction(function(){ clearErrors() });
Router.onBeforeAction("loading");
Router.onAfterAction(removeForgotSession);
