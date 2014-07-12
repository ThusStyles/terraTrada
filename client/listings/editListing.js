Template.editListing.rendered = function(){
	$( "#spinner-01" ).spinner();
	Holder.run();
	$('.fileinput').fileinput();
	$("#cat-select").val(this.data.categorySlug);
	$("#cat-select").fancySelect();      
}
Template.editListing.helpers({
	photo: function(){
		return Images.findOne(this.imageObj._id);
	},
	product: function(){
		return this.type == "product";
	},
	categories: function(){
		var product = this.type == "product"
		return product ? productCategories : serviceCategories;
	},
	formHeader: function(){
		var product = this.type == "product"
		return "New " + (product ? "Product" : "Service") + " Listing";
	},
	titlePlaceholder: function(){
		var product = this.type == "product"
		return product ? "Title of the product e.g iPhone 5" : "Title of the service e.g Web Development";
	},
	quantityLabel: function(){
		var product = this.type == "product"
		return product ? "How many do you have to sell?" : "How many days does the service take?";
	},
	descriptionPlaceholder: function(){
		var product = this.type == "product"
		return product ? "Description for the product e.g used iPhone 5 with charger and box" : "Description for the service e.g Web Development with 5 page website";
	},
	extraOverviewPoints: function(){
		this.overviewPoints.shift();
		return this.overviewPoints;
	},
	overviewPoint: function(){
		return this.overviewPoints[0];
	}

});

Template.editListing.events({
	"submit #editListing": function(e, t){
		e.preventDefault();
		var overviewPoints = [];
		$('.overview .overview-points').each(function(){
			if($(this).val().length <= 0)
				return;
			else
				overviewPoints.push($(this).val());
		});
		var instance = this;
		var obj = {
			title: $("#listing-title").val(),
			quantity: parseInt($(".listing-quantity").val()),
			price: parseInt($("#listing-price").val()),
			description: $("#listing-description").val(),
			type: this.type,
			categoryTitle: $('#cat-select option:selected').text(),
			categorySlug: $('#cat-select').val(),
			overviewPoints: overviewPoints
		}
		var product = instance.type == "product";
		var context = product ? productListingSchema.namedContext("listingForm") : serviceListingSchema.namedContext("listingForm");
		var isValid = context.validate(obj);
		if(!isValid){
			_.each(context.invalidKeys(), function(object){
				if(object.name == "categorySlug")
					return;
				object.name === "categoryTitle" ? throwError("Please select a valid category") : throwError(object.message);
			});
		} else{
			obj.listingId = instance._id;
			// valid form
			if( $('#image')[0].files.length > 0){
				// Image changed
				obj.imageId = this.imageObj._id;
				var image = $('#image')[0].files[0];
				var fsFile = new FS.File(image);
				fsFile.userId = Meteor.userId();
				var imageObj = Images.insert(fsFile, function(err){
					if(err){
						throwError(err.reason);
					}
				});

				obj.imageObj = imageObj;

				Meteor.call("updateListing", obj, function(error, result){
					if(error){
						
					} else{
						Meteor.defer(function(){
							Meteor.subscribe("listingImage", instance._id);
						});
						Router.go("listingPage", {_id: instance._id});
						toastr.options = {
							  "closeButton": true,
							  "positionClass": "toast-top-left"
							}
						toastr.success("Updated listing", "Success");
					}
				});
			} else{
				//Image hasn't changed
				Meteor.call("updateListing", obj, function(error, result){
					if(error){
						
					} else{
						Router.go("listingPage", {_id: instance._id});
						toastr.options = {
							  "closeButton": true,
							  "positionClass": "toast-top-left"
							}
						toastr.success("Updated listing", "Success");
					}
				});
			}
		}

		
	},
	"click .add-overview": function(e, t){
		var count = $('.overview .row').length
		if(count < 6){
			var item = $('.overview-item');
			$('.overview').append(item.html());
			$('.overview .row:last').addClass("new-item");
			$('<div class=\"col-md-2\"><a href=\"#\" class=\"btn btn-danger\"><span class=\"glyphicon glyphicon-remove\"></span></a></div>').insertAfter(".overview .row:last .col-md-9");
		} else{
			toastr.options = {
							  "closeButton": true,
							  "positionClass": "toast-top-left"
							}
			toastr.error("Max number of overview points", "Error");
		}
	},
	"click .btn-danger": function(e, t){
		$('.btn-danger:last').closest(".row").remove();
	}
});
