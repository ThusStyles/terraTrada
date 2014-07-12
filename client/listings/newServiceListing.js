Template.newServiceListing.rendered = function(){
	$( "#spinner-01" ).spinner();
	Holder.run();
	$('.fileinput').fileinput();
	$('#cat-select').fancySelect();
}
Template.newServiceListing.helpers({
	categories: function(){
		return serviceCategories;
	}
});

Template.newServiceListing.events({
	"submit #newListing": function(e, t){
		e.preventDefault();
		var overviewPoints = [];
		$('.overview .overview-points').each(function(){
			if($(this).val().length <= 0)
				return;
			else
				overviewPoints.push($(this).val());
		});
		var obj = {
			title: $("#listing-title").val(),
			quantity: parseInt($(".listing-quantity").val()),
			price: parseInt($("#listing-price").val()),
			description: $("#listing-description").val(),
			type: "service",
			categoryTitle: $('#cat-select option:selected').text(),
			categorySlug: $('#cat-select').val(),
			overviewPoints: overviewPoints
		}
		var context = serviceListingSchema.namedContext("listingForm");
		var isValid = context.validate(obj);

		if(!isValid){
			_.each(context.invalidKeys(), function(object){
				if(object.name == "categorySlug")
					return;
				object.name == "categoryTitle" ? throwError("Select a valid category") : throwError(object.message);
			});
		} else{
			// valid form
			if( $('#image')[0].files.length > 0){
				var image = $('#image')[0].files[0];
				var fsFile = new FS.File(image);
				fsFile.userId = Meteor.userId();
				var imageObj = Images.insert(fsFile, function(err){
					if(err){
						throwError(err.reason);
					}
				});

				obj.imageObj = imageObj;

				Meteor.call("createListing", (obj), function(error, result){
					toastr.options = {
							  "closeButton": true,
							  "positionClass": "toast-top-left"
							}
					if(error){
						toastr.error(error.reason, "Error");
					} else{
						toastr.success("Listing created", "Success");
						Router.go("listingPage", {_id: result});
					}
				});
			} else{
				toastr.error("Listing must include an image", "Error");
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

Template.newServiceListing.helpers({
	loading: function(){
		return Session.get("loading");
	},
	loadingWidth: function(){
		return Session.get("loadingWidth");
	}
});