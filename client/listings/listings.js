Template.listings.events({
    "submit .search-form": function(e, t){
        e.preventDefault();
        Session.set("loading", true);
        var baseVal = $('.search').val();
        var type = Router.current().params.type || "both";
        var category = Router.current().params.category || false;
        var direction = parseInt(Router.current().params.direction) || -1;
        var sort = Router.current().params.sortField || "epoch";
        if(baseVal == "" || !baseVal){
            if(category)
                Router.go("listings", { sortField: sort, direction: direction, listingLimit: 10, keyword: "all", type: type, category: category});
            else
                Router.go("listings", { sortField: sort, direction: direction, listingLimit: 10, keyword: "all", type: type});
        } else{
        	Session.set("searching", baseVal);
            var val = baseVal.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&");
            Session.set("query", val);

            if(category)
                Router.go("listings", { sortField: sort, direction: direction, listingLimit: 10, keyword: val, type: type, category: category});
            else
                Router.go("listings", { sortField: sort, direction: direction, listingLimit: 10, keyword: val, type: type});
        	
        }
        
    },
    "click .clear-search": function(e, t){
        e.preventDefault();
        $('.options li').each(function(){
            $(this).removeClass("selected");
        });
        $('.options li:nth-child(1)').addClass("selected");
        $('.trigger').text("Date Listed");
        $('#navTabs a:first').tab('show');
    	Session.set("loading", true);
    	Session.set("query", null);
    	Session.set("searching", false);
    	$('.search').val("");
        Router.go("listings", {sortField: "epoch", direction: -1, listingLimit: 10, keyword: "all", type: "both"});
    },
    "click .products-filter": function(e, t){
        $('#navTabs a:first').tab('show');
    },
    "click .services-filter": function(e, t){
        $('#navTabs a:last').tab('show');
    },
    "click .search-select ul li": function(e, t){
        var current = Router.current().params
        var keyword = current.keyword || "all";
        var category = current.category || false;
        var type = current.type || "both";
        var sort = $('#cat-select').val();
        if(category)
            Router.go("listings", { listingLimit: 10, keyword: keyword, type: type, category: category, sortField: sort, direction: -1});
        else
            Router.go("listings", { listingLimit: 10, keyword: keyword, type: type, sortField: sort, direction: -1});
    }
});

Template.listings.helpers({
    searching: function(){
        return Session.get("searching");
    },
    areListings: function(){
    	return Listings.find().count() > 0;
    },
    productClass: function(){
    	if(Router.current().params.type == "product")
    		return "active";
    },
    serviceClass: function(){
    	if(Router.current().params.type == "service")
    		return "active";
    },
    loading: function(){
    	return Session.get("loading");
    },
    productCats: function(){
    	return productCategories;
    },
    serviceCats: function(){
        return serviceCategories;
    },
    productsPath: function(){
    	var keyword = Router.current().params.keyword || "all";
    	var category = Router.current().params.category || false;
        var direction = parseInt(Router.current().params.direction) || -1;
        var sort = Router.current().params.sortField || "epoch";
        if(category)
           return Router.routes.listings.path({sortField: sort, direction: direction, listingLimit: 10, keyword: keyword, type: "product", category: category});
        else
           return Router.routes.listings.path({sortField: sort, direction: direction, listingLimit: 10, keyword: keyword, type: "product"});
    },
    servicesPath: function(){
    	var keyword = Router.current().params.keyword || "all";
        var category = Router.current().params.category || false;
        var direction = parseInt(Router.current().params.direction) || -1;
        var sort = Router.current().params.sortField || "epoch";
        if(category)
           return Router.routes.listings.path({sortField: sort, direction: direction, listingLimit: 10, keyword: keyword, type: "service", category: category});
        else
    	   return Router.routes.listings.path({sortField: sort, direction: direction, listingLimit: 10, keyword: keyword, type: "service"});
    },
    directionClass: function(){
        var direction = parseInt(Router.current().params.direction);
        if(direction == 1){
            return "glyphicon-arrow-up"
        } else{
            return "glyphicon-arrow-down"
        }
    },
    directionPath: function(){
        var direction = parseInt(Router.current().params.direction) || -1;
        var keyword = Router.current().params.keyword || "all";
        var category = Router.current().params.category || false;
        var type = Router.current().params.type || "both";
        var sort = Router.current().params.sortField || "epoch";
        if(direction == 1){
            if(category)
                return Router.routes.listings.path({sortField: sort, direction: -1, listingLimit: 10, keyword: keyword, type: type, category: category});
            else
                return Router.routes.listings.path({sortField: sort, direction: -1, listingLimit: 10, keyword: keyword, type: type});
        } else{
            if(category)
                return Router.routes.listings.path({sortField: sort, direction: 1, listingLimit: 10, keyword: keyword, type: type, category: category});
            else
                return Router.routes.listings.path({sortField: sort, direction: 1, listingLimit: 10, keyword: keyword, type: type});
        }
    }
});

Template.category.helpers({
    activeClass: function(){
        return Router.current().params.category == this.url ? "active" : null;
    },
    categoryPath: function(){
        var keyword = Router.current().params.keyword || "all";
        var type = Router.current().params.type || "both";
        var direction = parseInt(Router.current().params.direction) || -1;
        var sort = Router.current().params.sortField || "epoch";
        return Router.routes.listings.path({sortField: sort, direction: direction, listingLimit: 10, keyword: keyword, type: type, category: this.url});
    }
});

Template.listings.rendered = function(){
    var params = Router.current().params;
    var category = params.category;
    if(_.where(serviceCategoriesArray, category ).length > 0 || params.type == "service"){
        $('#navTabs a:last').tab('show');
    } else{
        $('#navTabs a:first').tab('show');
    }
    var sort = Router.current().params.sortField;
    if(sort)
        $('#cat-select').val(sort);
    else
        $('#cat-select').val("epoch");

    $('#cat-select').fancySelect();
    $('.fancy-select').addClass("search-select");
}
